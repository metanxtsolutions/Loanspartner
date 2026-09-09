import type { Guide } from "@/data/guide-types";
import { policyRates, repoRateLabel } from "@/data/policy-rates";

export const guidesBatch2: Guide[] = [
  {
    slug: "loan-against-property-vs-personal-loan",
    title: "Loan Against Property vs Personal Loan: Which Is Cheaper for You?",
    seoTitle: "Loan Against Property vs Personal Loan",
    category: "Borrowing basics",
    excerpt: "Cost, speed, amount, risk and tax treatment compared, with the situations where each product wins and a worked comparison on a ₹20 lakh need.",
    readTime: "7 min read",
    publishedDate: "2026-04-10",
    updatedDate: "2026-09-01",
    primaryKeyword: "loan against property vs personal loan",
    secondaryKeywords: ["LAP vs personal loan", "secured vs unsecured loan", "cheapest way to borrow 20 lakh", "mortgage loan vs personal loan"],
    tags: ["loan against property", "personal loan", "comparison"],
    intro: [
      "Borrowers who own property regularly take personal loans at 14% to 18% because they are fast, while a loan against the flat they live in would cost 9% to 11%. Sometimes the personal loan is still the right call. The difference lies in amount, urgency, tenure and how you feel about pledging your home.",
    ],
    sections: [
      {
        heading: "Cost: secured wins, and by more than the rate suggests",
        body: [
          "Loan against property rates run 8.75% to 12.5%; personal loans 10.25% to 24%, with most borrowers paying 12% to 16%. The gap compounds over tenure. On ₹20 lakh over 5 years, 15% costs about ₹8.5 lakh in interest; 10% costs about ₹5.5 lakh. Processing fees are similar in percentage, though LAP adds legal and valuation charges of ₹10,000 to ₹25,000.",
        ],
        table: {
          headers: ["", "Loan against property", "Personal loan"],
          rows: [
            ["Indicative rate", "8.75% to 12.5%", "10.25% to 24%"],
            ["Maximum tenure", "15 to 20 years", "5 to 7 years"],
            ["Amount", "Up to 70% of property value", "Up to ₹50 lakh, income-capped"],
            ["Time to disbursal", "2 to 4 weeks", "2 to 5 days"],
            ["Collateral", "Property mortgaged", "None"],
            ["Prepayment charge", "Nil for individuals on floating", "Often 2% to 5% on fixed rate"],
          ],
        },
      },
      {
        heading: "Tenure changes the EMI more than the rate does",
        body: ["The same ₹20 lakh at 10% over 15 years has an EMI of about ₹21,500. Over 5 years at 15% it is about ₹47,600. For a business owner managing cash flow or a family funding education, the longer tenure is often the decisive advantage, even if total interest over 15 years is higher in absolute terms. You can always prepay a floating-rate LAP without charge."],
      },
      {
        heading: "When the personal loan is right",
        body: ["Choose unsecured when:"],
        bullets: [
          "You need funds within a week.",
          "The amount is under ₹5 lakh, where LAP's legal and valuation costs and effort are disproportionate.",
          "You do not own property, or all owners will not sign as co-applicants.",
          "The property has title or approval issues that would take months to resolve.",
          "You can repay within one to two years, which limits the interest difference.",
        ],
      },
      {
        heading: "When the loan against property is right",
        body: ["Choose secured when:"],
        bullets: [
          "The amount is ₹10 lakh or more and you can wait two to four weeks.",
          "You want a low EMI over a long tenure.",
          "Your income documents understate your real cash flow; surrogate programmes look at banking and GST.",
          "You are consolidating several expensive loans into one.",
          "Your credit score is mediocre; property quality can offset it.",
        ],
      },
      {
        heading: "Risk and tax",
        body: [
          "A LAP puts your property at risk if you default; a personal loan puts your credit report and peace of mind at risk. Both are serious, and the mortgage is the more serious. On tax, interest on either is deductible only if the funds are used for business or for acquiring or improving a property; there is no deduction for personal use.",
          "A middle path exists: a top-up on an existing home loan gives near-LAP pricing with far less process, if you have one.",
        ],
      },
    ],
    keyTakeaways: [
      "LAP costs roughly 4% to 6% less per year and offers tenures three times longer.",
      "Personal loans win on speed and for amounts under ₹5 lakh.",
      "For ₹10 lakh or more with a few weeks to spare, LAP is usually far cheaper.",
      "A home loan top-up is often the best of both if you already have a home loan.",
    ],
    faqs: [
      { question: "Can I get a loan against property if I have an existing home loan on it?", answer: "Yes, as a top-up from the same lender or by transferring the home loan and taking additional funds, up to the combined LTV cap." },
      { question: "Is a personal loan ever cheaper than LAP?", answer: "For very small amounts and short tenures, the fixed legal and valuation costs of a LAP can make the personal loan cheaper overall." },
    ],
    relatedProducts: ["loan-against-property", "personal-loan", "home-loan-balance-transfer"],
    relatedGuides: ["personal-loan-eligibility-how-lenders-decide", "home-loan-balance-transfer-when-it-saves-money"],
  },
  {
    slug: "business-loan-documents-checklist-msme",
    title: "Business Loan Documents Checklist for MSMEs (2026)",
    seoTitle: "Business Loan Documents for MSMEs",
    category: "Business finance",
    excerpt: "Every document a bank or NBFC asks for on an unsecured business loan, why each one matters, the mistakes that get files rejected, and how to prepare a file that sanctions in a week.",
    readTime: "8 min read",
    publishedDate: "2026-03-30",
    updatedDate: "2026-09-01",
    primaryKeyword: "business loan documents",
    secondaryKeywords: ["MSME loan documents required", "business loan documents checklist", "documents for unsecured business loan", "GST business loan documents"],
    tags: ["business loan", "MSME", "documents", "GST"],
    intro: [
      "Most business loan rejections are not about the business. They are about the file: a missing GST return, bank statements that do not match declared turnover, a proprietor's PAN with a mismatched name. Credit teams process hundreds of files a week and an incomplete or inconsistent one goes to the bottom of the pile or straight to decline.",
      "This checklist covers what lenders ask for, what each document tells them, and how to present a file that gets a decision in days.",
    ],
    sections: [
      {
        heading: "KYC of the business and its owners",
        body: ["Identity and existence come first:"],
        bullets: [
          "PAN of the entity (for firms and companies) and PAN and Aadhaar of all proprietors, partners or directors holding 25% or more.",
          "Business proof: GST registration certificate, Udyam registration, shop and establishment licence, trade licence, or for companies the certificate of incorporation and MOA/AOA; for partnerships the deed.",
          "Address proof of the business premises: utility bill, rent agreement or ownership document.",
          "Photographs of the owners.",
        ],
      },
      {
        heading: "Income and financials",
        body: ["This is where the decision is made:"],
        bullets: [
          "ITR of the entity and of the owners for the last two or three years, with computation of income.",
          "Audited or CA-certified financial statements: balance sheet and profit and loss for two or three years.",
          "For newer or smaller businesses, provisional financials for the current year.",
        ],
        table: {
          headers: ["What the lender checks", "Why it matters"],
          rows: [
            ["Turnover trend", "Growth or stability supports the loan amount; sharp falls raise questions"],
            ["Net profit and cash accruals", "Repayment capacity after existing debt"],
            ["Debt to turnover and interest coverage", "Whether the business is already stretched"],
            ["Owner's drawings and related-party flows", "Where the money really goes"],
          ],
        },
      },
      {
        heading: "Banking",
        body: [
          "Twelve months of statements of all current accounts, and often the owner's savings account. Lenders compute average balance, credit summation against declared turnover, cheque returns, EMI bounces and cash deposits. The most damaging finding is a mismatch between bank credits and GST or ITR turnover. Explain any legitimate difference (cash sales, multiple accounts) up front.",
        ],
      },
      {
        heading: "GST returns",
        body: [
          "GSTR-3B for the last 12 months, often pulled directly from the portal with your consent. Lenders look for regular filing and turnover consistent with banking. Late filings and nil returns in recent months weaken a file considerably. If you are below the GST threshold, say so and be ready for a lower loan amount based on banking alone.",
        ],
      },
      {
        heading: "Existing loans and obligations",
        body: ["Sanction letters and repayment schedules of all current loans, and the latest statements. Lenders check these against the bureau report; undisclosed loans that show up on the bureau are a common reason for decline, because they suggest concealment."],
      },
      {
        heading: "Mistakes that sink files",
        body: ["From our desk's experience, the recurring problems:"],
        bullets: [
          "Name mismatches across PAN, GST and bank account.",
          "Turnover declared to the lender that exceeds GST or bank credits.",
          "Missing months in bank statements or GST returns.",
          "Financials not signed or stamped by a CA where required.",
          "Applying to several lenders simultaneously, which stacks bureau enquiries.",
        ],
      },
      {
        heading: "Preparing a file that sanctions fast",
        body: ["Register on Udyam if you have not; it costs nothing and opens scheme benefits. Reconcile GST, ITR and banking before you apply and prepare a one-paragraph explanation of any gap. Keep all documents as clear PDFs. Then apply to the one lender whose policy fits your sector and size, which is where a partner earns their keep."],
      },
    ],
    keyTakeaways: [
      "KYC, two to three years of financials and ITR, 12 months of banking and GST returns are the core file.",
      "Consistency between GST, ITR and bank credits matters more than any single number.",
      "Undisclosed loans and name mismatches are the most common avoidable declines.",
      "Udyam registration is free and unlocks priority sector and guarantee scheme benefits.",
    ],
    faqs: [
      { question: "Can I get a business loan without GST registration?", answer: "Yes, with some lenders, based on ITR and banking, typically for smaller amounts. GST returns strengthen the file and raise the eligible amount." },
      { question: "How many years of ITR are needed?", answer: "Two years for most NBFCs, three for most banks. Newer businesses may qualify with one year plus strong banking at select lenders." },
    ],
    relatedProducts: ["business-loan", "working-capital-loan", "machinery-loan"],
    relatedGuides: ["loan-against-property-vs-personal-loan", "personal-loan-for-self-employed"],
  },
  {
    slug: "understanding-your-cibil-score",
    title: "Understanding Your CIBIL Score and How to Improve It",
    seoTitle: "CIBIL Score: How to Read and Improve It",
    category: "Credit and scores",
    excerpt: "How the score is built, what each range means to a lender, the five factors that move it, common myths, and a 90-day improvement plan.",
    readTime: "8 min read",
    publishedDate: "2026-03-12",
    updatedDate: "2026-09-01",
    primaryKeyword: "CIBIL score",
    secondaryKeywords: ["what is a good CIBIL score", "how to improve CIBIL score", "CIBIL score range", "check CIBIL score free"],
    tags: ["CIBIL", "credit score", "credit report"],
    intro: [
      "Your credit score is the first thing a lender sees and, for unsecured loans, the biggest single influence on whether you are approved and at what rate. It is also widely misunderstood: people close old cards to 'clean up', check their score constantly fearing it will fall, and are surprised when a single missed payment costs them 1% on a home loan.",
      "This guide explains the mechanics plainly, with a practical plan for improving a score in three months.",
    ],
    sections: [
      {
        heading: "What the score is and who makes it",
        body: [
          "India has four licensed credit bureaus: TransUnion CIBIL, Experian, Equifax and CRIF High Mark. Each receives monthly data from every regulated lender on every loan and card account and computes a score from 300 to 900. CIBIL is the most used by lenders, so its score is the one people quote, but the others matter and can differ by 20 to 40 points because of data timing.",
          "The score summarises the report; lenders read both.",
        ],
      },
      {
        heading: "What each range means",
        body: [],
        table: {
          headers: ["Score", "How lenders read it", "Typical outcome"],
          rows: [
            ["750 to 900", "Excellent", "Best rates, pre-approved offers, higher amounts"],
            ["700 to 749", "Good", "Approval with most lenders at standard rates"],
            ["650 to 699", "Fair", "Fewer lenders, higher rates, lower amounts"],
            ["550 to 649", "Poor", "Mostly secured products; unsecured rare and costly"],
            ["Below 550 or NA", "Very poor or no history", "Build history with a secured card or small loan"],
          ],
        },
      },
      {
        heading: "The five factors that move it",
        body: ["Bureau models differ, but the drivers are consistent, in roughly this order of weight:"],
        bullets: [
          "Payment history: every on-time or late payment, with recent months weighing most. A 30-day delay can cost 50 to 100 points; a 90-day delay far more.",
          "Credit utilisation: card balances as a share of limits. Above 30% to 40% for sustained periods hurts; near-zero utilisation with active use is ideal.",
          "Credit mix and age: a blend of secured and unsecured accounts, and older accounts, help. Closing your oldest card reduces average age.",
          "Enquiries: each loan or card application by a lender is a hard enquiry; several in a few months signal stress.",
          "Negative events: settlements, write-offs and accounts in collection stay for years and weigh heavily.",
        ],
      },
      {
        heading: "Myths that cost people points",
        body: [],
        bullets: [
          "Checking your own score lowers it: false. Self-checks are soft enquiries.",
          "Closing cards improves the score: usually false. It cuts available limit and account age.",
          "Paying the minimum due keeps the score healthy: false. It avoids a delay but keeps utilisation high.",
          "A settled account is the same as a closed one: false. Settled is a negative marker.",
          "Having no loans gives a perfect score: false. No history means no score, which lenders treat cautiously.",
        ],
      },
      {
        heading: "A 90-day improvement plan",
        body: [],
        bullets: [
          "Week 1: pull reports from all four bureaus (one free report each per year) and list every error and every negative. Raise disputes online; bureaus must resolve within 30 days.",
          "Weeks 1 to 12: pay every EMI and card bill in full and on time. Set up auto-debit.",
          "Weeks 1 to 12: bring card utilisation below 30% before each statement date. Ask for a limit increase if your bank offers one without an enquiry.",
          "Throughout: apply for nothing. No cards, no loans, no 'check your offer' buttons that trigger hard enquiries.",
          "Month 3: clear any overdue or settled account and get the lender to update the status; a no-dues certificate is your evidence.",
        ],
      },
      {
        heading: "Building a score from nothing",
        body: ["New borrowers can start with a secured credit card against a fixed deposit, use it lightly, and pay in full for six months. A small consumer durable loan repaid on time does the same. Within six to twelve months a score appears, usually in the 700s if the conduct is clean."],
      },
    ],
    keyTakeaways: [
      "750 and above earns the best pricing; below 650 pushes you to secured products.",
      "Payment history and utilisation drive most of the score; keep both clean for three statements to see movement.",
      "Do not close old cards and do not apply for new credit while repairing.",
      "Dispute errors; they are common and must be fixed within 30 days.",
    ],
    faqs: [
      { question: "How often is the CIBIL score updated?", answer: "Lenders report monthly, so the score can change every 30 to 45 days as new data arrives." },
      { question: "Why do my CIBIL and Experian scores differ?", answer: "Different models and slightly different data timing. Lenders may pull any bureau; keeping all four clean is the safe approach." },
      { question: "Can I remove a settled account from my report?", answer: "Not by request alone. Paying the remaining balance and asking the lender to update the status to closed is the accepted route." },
    ],
    relatedProducts: ["personal-loan", "home-loan"],
    relatedGuides: ["personal-loan-with-low-cibil-score", "personal-loan-eligibility-how-lenders-decide"],
  },
  {
    slug: "fixed-vs-floating-home-loan-rate",
    title: "Fixed vs Floating Home Loan Rate in 2026: Which Should You Choose?",
    seoTitle: "Fixed vs Floating Home Loan Rate",
    category: "Home loans",
    excerpt: `How repo-linked floating rates work, what fixed and hybrid options really offer, and how to decide with the repo rate at ${repoRateLabel} and the cycle where it is.`,
    readTime: "6 min read",
    publishedDate: "2026-02-18",
    updatedDate: "2026-09-01",
    primaryKeyword: "fixed vs floating home loan",
    secondaryKeywords: ["repo linked home loan", "EBLR home loan", "fixed rate home loan India", "home loan interest rate type"],
    tags: ["home loan", "interest rate", "repo rate", "EBLR"],
    intro: [
      "Almost every home loan sanctioned in India today is floating, linked to the RBI repo rate. Fixed-rate loans exist but are rare and priced at a premium. Understanding why, and what the choice means for your EMI over 20 years, is worth ten minutes before you sign.",
    ],
    sections: [
      {
        heading: "How a repo-linked floating rate works",
        body: [
          `Since October 2019, banks must link floating-rate home loans to an external benchmark, and nearly all chose the RBI repo rate. Your rate equals the repo rate plus a spread fixed at sanction. With the repo rate at ${repoRateLabel} in ${policyRates.asOfLabel} and typical spreads of 2.10% to 2.75%, new loans price at about 7.35% to 8%. When the RBI changes the repo rate, your rate follows at the next reset, at most three months later.`,
          "The spread has two parts: the bank's base spread, which cannot rise during the loan except on a credit downgrade, and a credit risk premium that reflects your profile. Housing finance companies use their own benchmark rate rather than the repo, which is less transparent; compare their actual rates and reset history.",
        ],
      },
      {
        heading: "What a fixed rate really offers",
        body: [
          "A genuinely fixed rate for the full tenure is rare and typically 1.5% to 2.5% above floating. More common are hybrid products: fixed for 2, 3 or 5 years, then floating. Read the reset clause; some 'fixed' products allow the lender to change the rate on a money-market event. Fixed-rate loans can carry prepayment charges, which floating-rate loans to individuals cannot.",
        ],
      },
      {
        heading: "The decision in the current cycle",
        body: [
          `After the 2025 and 2026 cuts, the repo rate is at ${repoRateLabel} and most forecasts see it steady or slightly lower over the next year. Locking a fixed rate at a premium when rates are low and stable is usually poor value: you pay more from day one for protection against rises that may not come for years. Floating wins in most scenarios today.`,
          "Fixed makes sense for a borrower who cannot tolerate any EMI increase, such as someone on a tight, fixed budget near retirement, or when a lender offers a short fixed period at no premium.",
        ],
      },
      {
        heading: "What to compare between floating offers",
        body: [],
        bullets: [
          "The spread over the repo rate, not just today's rate.",
          "Reset frequency: quarterly is the norm; monthly is better for you in a falling cycle.",
          "Whether rate cuts reduce EMI or tenure by default, and whether you can choose.",
          "Conversion fee to reduce the spread later if the bank's new-customer spread narrows.",
          "Processing, legal and technical fees, which vary more than rates do.",
        ],
      },
      {
        heading: "Managing rate risk on a floating loan",
        body: ["Keep six months of EMIs as a buffer, prepay when rates fall rather than reducing EMI, and review your spread every two years against what the bank offers new customers. Repricing with your existing bank for a small fee, or a balance transfer if the gap is large, keeps a floating loan competitive over its life."],
      },
    ],
    keyTakeaways: [
      "Nearly all home loans are repo-linked floating; your rate is repo plus a fixed spread.",
      "Fixed rates cost 1.5% to 2.5% more and are rarely fixed for the whole tenure.",
      `With the repo rate at ${repoRateLabel} and stable, floating is the better value for most borrowers.`,
      "Compare spreads and fees between floating offers, and review your spread every two years.",
    ],
    faqs: [
      { question: "Can I switch from fixed to floating later?", answer: "Usually yes, for a conversion fee, once any fixed period ends. Check the agreement for the terms." },
      { question: "Does a repo rate cut reduce my EMI automatically?", answer: "Your rate falls at the next reset. Most banks keep the EMI constant and shorten the tenure unless you ask for the EMI to be reduced." },
    ],
    relatedProducts: ["home-loan", "home-loan-balance-transfer"],
    relatedGuides: ["home-loan-balance-transfer-when-it-saves-money", "how-to-read-a-key-fact-statement"],
  },
  {
    slug: "personal-loan-for-self-employed",
    title: "Personal Loan for Self-Employed: Documents and Eligibility",
    seoTitle: "Personal Loan for the Self-Employed",
    category: "Borrowing basics",
    excerpt: "Why self-employed applicants face more scrutiny, the documents that prove income, banking-based programmes when ITR understates earnings, and alternatives that are cheaper.",
    readTime: "7 min read",
    publishedDate: "2026-02-05",
    updatedDate: "2026-09-01",
    primaryKeyword: "personal loan for self employed",
    secondaryKeywords: ["personal loan without salary slip", "self employed personal loan documents", "personal loan for business owners", "personal loan on bank statement"],
    tags: ["personal loan", "self-employed", "documents"],
    intro: [
      "Salaried applicants have a salary slip; self-employed applicants have a story. Lenders find stories harder to underwrite, so they ask for more documents, apply lower income multiples and price a little higher. It is still very possible to get a good personal loan as a professional or business owner, provided the file speaks the lender's language.",
    ],
    sections: [
      {
        heading: "Who counts as self-employed",
        body: ["Lenders split the segment in two. Self-employed professionals, such as doctors, CAs, architects and lawyers, are treated favourably and often get dedicated programmes. Self-employed non-professionals, meaning traders, manufacturers, contractors and service providers, face stricter income verification. Freelancers and gig workers fall in the second bucket and need strong banking to qualify."],
      },
      {
        heading: "Documents that prove income",
        body: [],
        bullets: [
          "PAN and Aadhaar, and business proof: GST, Udyam, trade licence or professional registration.",
          "ITR for the last two years with computation of income. Lenders usually take the average or the lower of the two years' profit.",
          "Bank statements for 12 months, current and savings. Credit summation and average balance are the second income test.",
          "Business continuity proof of two to three years: an old ITR, licence or registration date.",
          "Office address proof.",
        ],
      },
      {
        heading: "When ITR understates income: banking-based programmes",
        body: [
          "Many businesses show a modest taxable profit while running healthy cash flows. Several NBFCs and some banks run programmes that assess income from bank statements, typically as a fraction of average monthly credits or of average balance, for applicants with regular, clean banking. Rates are 1% to 3% higher than ITR-based programmes and amounts are smaller, but approval odds are far better. Knowing which lender runs such a programme in your city is most of the work.",
        ],
      },
      {
        heading: "Eligibility norms to expect",
        body: [],
        table: {
          headers: ["Criterion", "Typical requirement"],
          rows: [
            ["Age", "25 to 65 years at loan maturity"],
            ["Business vintage", "2 to 3 years, sometimes 5 for non-professionals"],
            ["Annual income", "₹3 lakh to ₹5 lakh net profit, or turnover thresholds for banking programmes"],
            ["Credit score", "700 and above; 680 with some NBFCs"],
            ["Amount", "Up to 2 to 3 times annual profit, capped by FOIR"],
          ],
        },
      },
      {
        heading: "Cheaper alternatives to consider first",
        body: ["A professional loan for eligible professionals prices 2% to 6% below a standard personal loan. A loan against property is roughly half the cost for larger amounts. A business loan may offer more if the need is for the business. A gold loan is fastest and score-independent for short-term needs."],
      },
      {
        heading: "Improving the odds",
        body: [],
        bullets: [
          "Route all business receipts through one current account for at least 12 months.",
          "File GST and ITR on time; late filings are visible and hurt.",
          "Keep personal and business banking separate.",
          "Apply for an amount comfortably within FOIR; ask for a top-up later rather than an oversized first loan.",
          "Pre-screen and apply to one lender.",
        ],
      },
    ],
    keyTakeaways: [
      "Professionals get dedicated programmes; non-professionals need strong ITR or banking.",
      "Banking-based programmes exist for businesses whose ITR understates cash flow, at a modest rate premium.",
      "Two to three years of continuity and 12 months of clean banking are the core requirements.",
      "Professional loans, LAP and gold loans are often cheaper routes for the self-employed.",
    ],
    faqs: [
      { question: "Can I get a personal loan without ITR?", answer: "With some NBFCs, on 12 months of bank statements and business proof, for smaller amounts at higher rates. Two years of ITR opens far more options." },
      { question: "Do freelancers qualify for personal loans?", answer: "Yes, with regular client credits over 12 months, ITR for two years and a good score. Several lenders now assess gig and freelance income." },
    ],
    relatedProducts: ["personal-loan", "professional-loan", "business-loan"],
    relatedGuides: ["personal-loan-eligibility-how-lenders-decide", "business-loan-documents-checklist-msme"],
  },
  {
    slug: "how-to-spot-loan-fraud",
    title: "How to Spot a Loan Scam: Fake Agents and Advance Fees",
    seoTitle: "How to Spot a Loan Scam",
    category: "Safety and compliance",
    excerpt: "The patterns behind India's most common loan frauds, the checks that take two minutes, and what to do if you have already paid.",
    readTime: "6 min read",
    publishedDate: "2026-01-20",
    updatedDate: "2026-09-01",
    primaryKeyword: "loan fraud",
    secondaryKeywords: ["fake loan agent", "loan scam India", "advance fee loan scam", "fake loan app", "loan processing fee scam"],
    tags: ["fraud", "safety", "scam", "RBI"],
    intro: [
      "Loan fraud thrives on urgency and hope. A person who needs ₹2 lakh by Friday and has been refused by their bank is exactly who the fake agent calls. The pitch is always the same: guaranteed approval, no credit check, just a small fee first. The loan never arrives.",
      "Because LoansPartner's name and the names of the lenders we work with are sometimes used in such scams, we publish this guide and repeat one rule everywhere: we never take money from borrowers, and neither does any genuine agent or lender.",
    ],
    sections: [
      {
        heading: "The advance-fee scam",
        body: [
          "A caller or WhatsApp message offers a loan, often 'pre-approved', and sends a convincing sanction letter with a bank's logo. Before disbursal they need a processing fee, GST on the loan, an insurance premium, a 'RBI verification charge' or a refundable security deposit, paid by UPI to a personal account. After the first payment there is always another. Then the number goes dead.",
          "Regulated lenders deduct any processing fee from the disbursal amount. They never ask you to pay anything to a personal account, and never before sanction and agreement.",
        ],
      },
      {
        heading: "The fake app and the harassment loop",
        body: [
          "Unregulated loan apps disburse small amounts instantly, deduct huge upfront charges, and charge effective rates in the hundreds of percent. When repayment is due they use the contacts and photos harvested from your phone to threaten and shame you. RBI's Digital Lending Directions require regulated lenders to publish their apps and agents, and app stores have removed thousands of illegal apps, but new ones appear weekly.",
        ],
      },
      {
        heading: "The impersonation scam",
        body: ["Fraudsters pose as employees or agents of well-known banks, NBFCs or distribution companies, using real names and logos, sometimes with fake ID cards. They may quote a real lender's product and rates. The tell is always the same: a request for money, or for OTPs and account credentials."],
      },
      {
        heading: "Two-minute checks before you engage",
        body: [],
        bullets: [
          "Is the lender on the RBI's list of banks or registered NBFCs? Search the RBI website; if it is not there, stop.",
          "Is the app listed on the lender's website as its official app, and does the lender's name appear in the app?",
          "Has anyone asked for money before disbursal, or for an OTP, PIN or password? Stop.",
          "Is approval 'guaranteed' regardless of credit score? No regulated lender does this.",
          "Does the sanction letter come with a Key Fact Statement in RBI's format, from the lender's official email domain?",
          "Is the caller contacting you outside 9 am to 6 pm or pressuring you to decide now?",
        ],
      },
      {
        heading: "If you have already paid",
        body: [],
        bullets: [
          "Call the national cybercrime helpline 1930 immediately and file a complaint at cybercrime.gov.in. Fast reporting can freeze the recipient account.",
          "Inform your bank and, if you shared card or account details, block them.",
          "Save every message, screenshot, number and UPI ID as evidence.",
          "If a real lender's name was used, inform that lender; most have fraud reporting channels.",
          "Do not pay anything further, whatever they threaten.",
        ],
      },
      {
        heading: "How LoansPartner works, so you can tell the difference",
        body: ["We are paid by lenders after disbursal and never by borrowers. Our staff and partners identify themselves and the lender, contact you only in working hours, and never ask for OTPs or payments. Any loan we arrange comes with the lender's own Key Fact Statement and agreement, and funds go from the lender's account to yours. If someone claiming to be from LoansPartner asks you for money, they are not from LoansPartner. Report it to us and to 1930."],
      },
    ],
    keyTakeaways: [
      "No regulated lender or genuine agent takes money before disbursal or guarantees approval.",
      "Check the lender on the RBI website and insist on a Key Fact Statement.",
      "Never share OTPs, PINs or passwords with anyone offering a loan.",
      "If you have paid, call 1930 immediately; speed matters.",
    ],
    faqs: [
      { question: "Do banks charge a processing fee before disbursal?", answer: "No. Processing fees are disclosed in the Key Fact Statement and deducted from the disbursed amount. Any upfront payment request is a scam." },
      { question: "How do I verify a loan agent?", answer: "Ask which lender they represent and confirm with the lender's customer care using the number on the lender's website. Genuine agents never collect money." },
    ],
    relatedProducts: ["personal-loan", "business-loan"],
    relatedGuides: ["rbi-rules-for-loan-dsas-2026", "how-to-read-a-key-fact-statement"],
    featured: true,
  },
  {
    slug: "how-to-read-a-key-fact-statement",
    title: "How to Read a Key Fact Statement (KFS) Before Signing Your Loan",
    seoTitle: "How to Read a Key Fact Statement",
    category: "Safety and compliance",
    excerpt: "Line by line through RBI's standard loan disclosure: APR, fees, EMI schedule, prepayment terms and what to do if something is missing.",
    readTime: "6 min read",
    publishedDate: "2026-01-08",
    updatedDate: "2026-09-01",
    primaryKeyword: "key fact statement",
    secondaryKeywords: ["KFS loan", "what is key fact statement", "APR in KFS", "loan disclosure RBI"],
    tags: ["KFS", "RBI", "APR", "disclosure"],
    intro: [
      "Since October 2024 every bank and NBFC must hand retail and MSME borrowers a Key Fact Statement in a standard format before the loan agreement is signed, and give time to read it. It is the single most useful document in Indian lending: one page that shows exactly what the loan costs. Most borrowers still do not read it. Here is how.",
    ],
    sections: [
      {
        heading: "What the KFS must contain",
        body: ["RBI prescribes the format. Expect these fields in this order:"],
        bullets: [
          "Loan proposal and type, sanctioned amount and disbursal schedule.",
          "Tenure, and whether repayment is EMI-based or otherwise.",
          "Interest rate, whether fixed or floating, and for floating the benchmark, spread and reset periodicity.",
          "All fees payable to the lender: processing, documentation, insurance, valuation, legal.",
          "Fees payable to third parties through the lender, such as insurance premiums.",
          "The Annual Percentage Rate: the all-in cost including fees, as a single yearly rate.",
          "Contingent charges: prepayment, late payment, cheque bounce, conversion fees.",
          "The EMI, the number of instalments and the total amount you will repay.",
          "Details of the recovery agent policy and the grievance redressal officer.",
          "For digital loans, the cooling-off period and the LSP involved.",
        ],
      },
      {
        heading: "The line that matters most: APR",
        body: [
          "APR converts interest plus all lender fees into one annual rate. It lets you compare a 10.5% loan with a 3% processing fee against an 11% loan with no fee, which on a short tenure can be cheaper. Compare APRs across offers, not interest rates. If the APR is much higher than the interest rate, the fees are heavy; ask what each one is.",
        ],
      },
      {
        heading: "Check the floating-rate details",
        body: ["For a repo-linked loan the KFS should show the benchmark (repo rate), your spread, and the reset frequency. The spread is what you are really negotiating; two banks at 7.75% today may have different spreads if one is using a temporary discount. Ask whether rate changes will alter EMI or tenure."],
      },
      {
        heading: "Check the contingent charges",
        body: ["Prepayment and foreclosure charges must be nil for floating-rate loans to individuals. For fixed-rate loans, see the percentage and the lock-in period. Late payment penalties must be a reasonable 'penal charge', not a higher interest rate, under RBI's 2023 rules. Conversion and switching fees tell you what a future repricing will cost."],
      },
      {
        heading: "The repayment schedule and total cost",
        body: ["The KFS shows the number of EMIs and the total amount payable. For a home loan, that total is often more than double the principal; seeing it in writing is a useful reality check on tenure choice. Confirm the EMI matches the one you were quoted verbally and matches our calculator for the stated rate and tenure."],
      },
      {
        heading: "If something is missing or different",
        body: ["A KFS that lacks the APR, omits a fee you were told about, or quotes a rate different from the sanction letter should stop the process. Ask the lender to reissue it. Anything not in the KFS cannot be charged later. Keep the KFS with your agreement; it is your evidence in any dispute, and the grievance officer named on it is your first escalation."],
      },
    ],
    keyTakeaways: [
      "The KFS is mandatory before signing and must show the APR, all fees, EMI schedule and contingent charges.",
      "Compare APRs between offers, not interest rates.",
      "For floating loans, check the spread and reset frequency; for fixed loans, the prepayment charges.",
      "Anything not in the KFS cannot be charged later; keep it with your agreement.",
    ],
    faqs: [
      { question: "Is the KFS legally binding?", answer: "Yes. Lenders cannot levy charges not disclosed in the KFS, and the terms in it must match the loan agreement." },
      { question: "How long do I get to read the KFS?", answer: "Lenders must give a validity period, typically at least three working days for loans of seven days or longer, during which the terms cannot change." },
    ],
    relatedProducts: ["personal-loan", "home-loan", "business-loan"],
    relatedGuides: ["how-to-spot-loan-fraud", "fixed-vs-floating-home-loan-rate", "rbi-rules-for-loan-dsas-2026"],
  },
];
