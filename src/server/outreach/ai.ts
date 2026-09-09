import Anthropic from "@anthropic-ai/sdk";
import { siteConfig } from "@/data/site-config";
import type { ReplyClassification } from "@prisma/client";

let client: Anthropic | null = null;
function anthropic() {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set. Outreach drafting and reply classification need it.");
    client = new Anthropic({ apiKey });
  }
  return client;
}

const DRAFTING_MODEL = "claude-sonnet-5";
const CLASSIFICATION_MODEL = "claude-haiku-4-5-20251001";

export type LenderFacts = {
  name: string;
  type: string;
  website: string;
  products: string[];
  strengths: string[];
  summary: string;
  bestFor: string;
};

/**
 * The only facts the model is allowed to use about LoansPartner and the
 * lender. Everything the model writes has to trace back to one of these
 * lines, which is why the system prompt below repeats "only" so much: a
 * cold email that invents a statistic or a partnership term is worse than
 * one that is a little plain.
 */
function loansPartnerFacts() {
  return [
    `Company: ${siteConfig.legalName}, operating as ${siteConfig.name}`,
    `Website: ${siteConfig.url}`,
    `What we do: ${siteConfig.description}`,
    `Founded: ${siteConfig.foundedYear}`,
    `Contact for this outreach: ${process.env.OUTREACH_REPLY_TO ?? siteConfig.contact.partnerEmail}, ${siteConfig.contact.phoneDisplay}`,
    `Registered office: ${siteConfig.contact.address.street}, ${siteConfig.contact.address.locality}, ${siteConfig.contact.address.region} ${siteConfig.contact.address.postalCode}`,
    `Regulatory role: ${siteConfig.compliance.dsaDisclosure}`,
    `Borrower fee policy: ${siteConfig.compliance.feeDisclosure}`,
  ].join("\n");
}

function lenderFactsBlock(lender: LenderFacts) {
  return [
    `Name: ${lender.name}`,
    `Type: ${lender.type}`,
    `Website: ${lender.website}`,
    `Products they lend against: ${lender.products.join(", ")}`,
    `Known strengths: ${lender.strengths.join("; ")}`,
    `Public summary: ${lender.summary}`,
    `Best fit borrower: ${lender.bestFor}`,
  ].join("\n");
}

const GROUNDING_RULE =
  "Use only the facts given to you below. Do not invent disbursal volumes, borrower counts, commission percentages, turnaround times, approval rates, testimonials, dates, or any other number or claim that is not explicitly provided. If you want to reference something about the lender, use only what is in \"Lender facts\". Never claim an existing relationship, meeting, or conversation that has not happened. Write in plain sentences: no en dash or em dash characters, use a comma or the word to instead.";

export type DraftedEmail = { subject: string; body: string };

const emailTool: Anthropic.Tool = {
  name: "write_email",
  description: "Return the drafted email as a subject line and a plain-text body.",
  input_schema: {
    type: "object",
    properties: {
      subject: { type: "string", description: "Email subject line, under 80 characters, specific and not generic." },
      body: { type: "string", description: "Full plain-text email body, including greeting and sign-off. No markdown, no placeholders like [Name]." },
    },
    required: ["subject", "body"],
  },
};

function extractToolInput<T>(message: Anthropic.Message, toolName: string): T {
  const block = message.content.find((b): b is Anthropic.ToolUseBlock => b.type === "tool_use" && b.name === toolName);
  if (!block) throw new Error(`AI response did not call ${toolName}. Stop reason: ${message.stop_reason}`);
  return block.input as T;
}

export async function generateProposal(lender: LenderFacts, opts?: { contactName?: string | null; contactTitle?: string | null }): Promise<DraftedEmail> {
  const system = [
    "You write first-contact B2B partnership emails for LoansPartner, an Indian loan advisory and distribution (DSA) company, proposing a lender partnership with a bank, NBFC or housing finance company.",
    GROUNDING_RULE,
    "The email should: open with a specific, credible reason this lender is relevant to LoansPartner given their products and strengths, not a generic compliment. State plainly what LoansPartner is proposing: a channel partnership where LoansPartner originates and refers qualified, documented borrower leads for the lender's relevant products, under a standard DSA or referral arrangement. Note that terms, empanelment process and commission structure would be discussed on a call, since you do not know the lender's actual terms. Ask for a short call or the right person to route this to. Keep it under 220 words, professional, specific, no bullet lists, no exclamation points, no filler business jargon.",
    "Address it to the named contact if one is given; otherwise address it to the partnerships or business development team generically (e.g. \"Hello,\" or \"Dear Partnerships team,\").",
  ].join(" ");
  const contactLine = opts?.contactName ? `Contact: ${opts.contactName}${opts.contactTitle ? `, ${opts.contactTitle}` : ""}` : "Contact: unnamed, use a role-based greeting";
  const user = `LoansPartner facts:\n${loansPartnerFacts()}\n\nLender facts:\n${lenderFactsBlock(lender)}\n\n${contactLine}\n\nWrite the partnership proposal email now.`;
  const message = await anthropic().messages.create({
    model: DRAFTING_MODEL,
    max_tokens: 1024,
    system,
    tools: [emailTool],
    tool_choice: { type: "tool", name: "write_email" },
    messages: [{ role: "user", content: user }],
  });
  return extractToolInput<DraftedEmail>(message, "write_email");
}

export async function generateFollowUp(lender: LenderFacts, previousSubject: string, previousBody: string, stepNumber: number): Promise<DraftedEmail> {
  const system = [
    "You write short, polite follow-up emails to a previously sent B2B partnership proposal that has not received a reply. This is follow-up number " + stepNumber + " in the sequence.",
    GROUNDING_RULE,
    "Keep it under 90 words. Reference that you wrote before without repeating the whole pitch. Add at most one new, genuinely relevant detail from the lender facts that was not the focus of the first email, to give a real reason to reply rather than just nudging. End with an easy yes or no question. If this is the third or later follow-up, make clear this is the last check-in and you will not follow up further unless they want you to.",
  ].join(" ");
  const user = `LoansPartner facts:\n${loansPartnerFacts()}\n\nLender facts:\n${lenderFactsBlock(lender)}\n\nOriginal email subject: ${previousSubject}\nOriginal email body:\n${previousBody}\n\nWrite follow-up number ${stepNumber} now.`;
  const message = await anthropic().messages.create({
    model: DRAFTING_MODEL,
    max_tokens: 512,
    system,
    tools: [emailTool],
    tool_choice: { type: "tool", name: "write_email" },
    messages: [{ role: "user", content: user }],
  });
  return extractToolInput<DraftedEmail>(message, "write_email");
}

export type ClassificationResult = { classification: ReplyClassification; confidence: "high" | "medium" | "low"; note: string };

const classifyTool: Anthropic.Tool = {
  name: "classify_reply",
  description: "Classify an inbound email reply to a partnership outreach email.",
  input_schema: {
    type: "object",
    properties: {
      classification: {
        type: "string",
        enum: ["INTERESTED", "NEEDS_INFO", "REQUEST_CALL", "NOT_INTERESTED", "WRONG_CONTACT", "NEEDS_DOCUMENTS", "FOLLOW_UP_LATER", "OUT_OF_OFFICE", "UNSUBSCRIBE", "UNCLEAR"],
      },
      confidence: { type: "string", enum: ["high", "medium", "low"] },
      note: { type: "string", description: "One sentence explaining the read, for a human reviewer." },
    },
    required: ["classification", "confidence", "note"],
  },
};

export async function classifyReply(threadSummary: string, replyText: string): Promise<ClassificationResult> {
  const system = [
    "You classify inbound email replies to a cold B2B partnership outreach email sent by LoansPartner to a lender.",
    "Categories: INTERESTED (wants to move forward or learn more), NEEDS_INFO (asking clarifying questions before deciding), REQUEST_CALL (explicitly wants a call or meeting), NOT_INTERESTED (declines), WRONG_CONTACT (says this is not the right person or team), NEEDS_DOCUMENTS (asking for company documents, empanelment forms, or compliance paperwork), FOLLOW_UP_LATER (interested in principle but asks to be contacted later, gives a timeframe), OUT_OF_OFFICE (automated absence reply, not a real response), UNSUBSCRIBE (asks to stop being contacted, or this looks like a spam or compliance complaint), UNCLEAR (none of the above fit confidently).",
    "If the reply expresses any frustration, threatens legal or regulatory action, raises a compliance or legal question, or is ambiguous between two categories, prefer UNCLEAR and say why in the note, so a human reviews it.",
  ].join(" ");
  const user = `Thread so far:\n${threadSummary}\n\nNew reply to classify:\n${replyText}`;
  const message = await anthropic().messages.create({
    model: CLASSIFICATION_MODEL,
    max_tokens: 300,
    system,
    tools: [classifyTool],
    tool_choice: { type: "tool", name: "classify_reply" },
    messages: [{ role: "user", content: user }],
  });
  return extractToolInput<ClassificationResult>(message, "classify_reply");
}

export async function draftReplyToInbound(lender: LenderFacts, threadSummary: string, inboundText: string, classification: ReplyClassification): Promise<DraftedEmail> {
  const intentByClass: Record<ReplyClassification, string> = {
    INTERESTED: "Thank them, confirm next steps: propose a short call and ask for their preferred time or a scheduling link, and ask who else should join from their side.",
    NEEDS_INFO: "Answer plainly using only the LoansPartner facts given. If the question needs information you do not have (exact commission structure, volumes, specific empanelment steps), say that will be confirmed on a call rather than guessing, and offer to set one up.",
    REQUEST_CALL: "Confirm you would welcome a call, propose two or three general time windows in the coming week, and ask them to pick one or share a scheduling link.",
    NEEDS_DOCUMENTS: "Confirm LoansPartner can share the documents they need for empanelment and ask them to list exactly what their process requires, since requirements vary by lender.",
    FOLLOW_UP_LATER: "Acknowledge the timing they gave, confirm LoansPartner will follow up around then, and thank them for the response.",
    NOT_INTERESTED: "Thank them for the response, keep the door open for the future, and confirm no further outreach will follow unless they reach out.",
    WRONG_CONTACT: "Thank them and ask if they can point to the right person or team for partnership or DSA enquiries.",
    OUT_OF_OFFICE: "No reply needed; this function should not be called for this classification.",
    UNSUBSCRIBE: "Confirm LoansPartner will not contact this address again and apologise for the inconvenience. No further outreach.",
    UNCLEAR: "This needs a human to read the full thread before replying; keep any draft short and neutral.",
  };
  const system = [
    "You write short, professional reply emails for LoansPartner in an ongoing partnership conversation with a lender contact.",
    GROUNDING_RULE,
    `The reply was classified as ${classification}. ${intentByClass[classification]}`,
    "Keep it under 130 words, match the tone of a real person replying to email, no bullet lists unless listing specific items they asked for.",
  ].join(" ");
  const user = `LoansPartner facts:\n${loansPartnerFacts()}\n\nLender facts:\n${lenderFactsBlock(lender)}\n\nThread so far:\n${threadSummary}\n\nTheir latest message:\n${inboundText}\n\nDraft the reply now.`;
  const message = await anthropic().messages.create({
    model: DRAFTING_MODEL,
    max_tokens: 512,
    system,
    tools: [emailTool],
    tool_choice: { type: "tool", name: "write_email" },
    messages: [{ role: "user", content: user }],
  });
  return extractToolInput<DraftedEmail>(message, "write_email");
}
