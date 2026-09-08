import type { Faq } from "@/data/products";

export type PartnerAudience = {
  slug: string;
  name: string;
  short: string;
  headline: string;
  summary: string;
  why: string[];
  fit: string[];
  products: string[];
  example: { scenario: string; math: string };
  keywords: string[];
  faqs: Faq[];
  updatedAt: string;
};

export const partnerSteps = [
  { name: "Apply online", text: "Fill the two-minute partner form with your profile, city and the products you want to distribute." },
  { name: "Verification call", text: "A partner manager calls within one working day to understand your network and answer questions." },
  { name: "KYC and agreement", text: "Share PAN, Aadhaar, a bank proof and a photograph. Sign the digital partner agreement and code of conduct." },
  { name: "Onboarding and training", text: "Get your partner code, product training, lender policy cheat-sheets and marketing collateral." },
  { name: "Start sourcing", text: "Log leads on the partner portal or WhatsApp. Our desk handles lender selection, documentation and follow-up." },
  { name: "Get paid", text: "Payouts are computed on disbursed amounts and released monthly with a statement you can reconcile." },
];

export const partnerEligibility = [
  "Indian resident aged 21 years or above",
  "Valid PAN and Aadhaar; a bank account in your name or your firm's name",
  "No history of fraud or wilful default; a clean bureau report is preferred",
  "A network of potential borrowers: clients, colleagues, community or business contacts",
  "Willingness to follow our code of conduct, which reflects RBI's fair practice and outsourcing norms: no cash handling, honest disclosure, and customer contact only between 9 am and 6 pm",
];

export const partnerDocuments = ["PAN card", "Aadhaar card", "Cancelled cheque or bank statement", "Passport-size photograph", "GST certificate (only if your firm is registered)", "Business proof for firms and companies"];

export const partnerBenefits = [
  { title: "One code, our whole lender panel", text: "Register once. Reach public sector banks, private banks, HFCs and NBFCs without separate empanelments." },
  { title: "Payouts among the best in the market", text: "Transparent slabs by product, published in your agreement. No hidden deductions." },
  { title: "We do the processing", text: "You bring the lead; our credit desk handles lender selection, documentation and lender follow-up." },
  { title: "Zero investment", text: "No joining fee, no deposit, no target pressure. Earn on what you disburse." },
  { title: "Real-time tracking", text: "Every file's status, from login to disbursal, visible on the partner portal and WhatsApp updates." },
  { title: "Training and compliance cover", text: "Product training, lender policy briefs and a code of conduct that keeps you on the right side of RBI rules." },
];

export const partnerFaqs: Faq[] = [
  { question: "What is a loan DSA and how does it earn?", answer: "A Direct Selling Agent sources loan customers for banks and NBFCs. When a sourced loan is disbursed, the lender pays a commission, typically 0.25% to 3% of the loan amount depending on the product. LoansPartner is empanelled with many lenders, so partners work under our code and earn a share of every disbursal they source." },
  { question: "Is there any fee to become a LoansPartner channel partner?", answer: "No. Registration, training and the partner portal are free. We earn only when loans disburse, and so do you." },
  { question: "Do I need finance experience or a qualification?", answer: "No. Many of our best partners are insurance advisors, property consultants, chartered accountants and working professionals. We train you on products and lender policies; your job is to bring genuine borrowers and help collect documents." },
  { question: "How and when are payouts made?", answer: "Payouts are calculated on the disbursed loan amount at the slab in your agreement and released monthly for all files disbursed in the previous month, after the lender's own payout to us. In practice that is 30 to 60 days from disbursal. You receive a statement showing each file, amount and payout." },
  { question: "Can I work with LoansPartner alongside my existing business?", answer: "Yes. Most partners run this alongside an existing practice or job. There are no minimum targets, though active partners naturally earn more." },
  { question: "Can I register as a company or firm?", answer: "Yes. Individuals, proprietorships, partnerships, LLPs and companies can all register. Firms need their entity PAN, GST where applicable and business proof." },
  { question: "What are my obligations under RBI rules?", answer: "Never collect cash or any fee from borrowers, never promise approval, disclose that the lender decides the loan and its terms, contact customers only between 9 am and 6 pm, and protect customer data. These are written into the partner code of conduct and we train you on them." },
  { question: "Which products pay the most?", answer: "Unsecured business loans and personal loans carry the highest percentage payouts. Home loans and loans against property pay a lower percentage on much larger amounts, so a single file can pay more. See the commission page for indicative slabs by product." },
];

export const partnerAudiences: PartnerAudience[] = [
  {
    slug: "chartered-accountants",
    name: "Chartered Accountants",
    short: "CAs and tax practitioners",
    headline: "Your clients already ask you about loans. Get paid for the answer.",
    summary: "Chartered accountants and tax practitioners see every client's financials, know exactly when a business needs working capital or a property loan, and are trusted to recommend. A LoansPartner code turns those conversations into a compliant, well-paid second revenue line without changing how you work.",
    why: ["You know the client's turnover, profit and banking before anyone else does, so your referrals are pre-qualified.", "Business loans, working capital and loans against property carry the strongest payouts and the largest tickets.", "Our credit desk prepares the lender file, so your staff time is minimal.", "A professional code of conduct and payout statement keep the arrangement clean for your practice."],
    fit: ["CA firms with SME and trader clients", "Tax consultants and GST practitioners", "Company secretaries and cost accountants", "Accounting outsourcing firms"],
    products: ["business-loan", "working-capital-loan", "loan-against-property", "machinery-loan", "professional-loan", "home-loan"],
    example: { scenario: "A CA firm refers four SME clients in a quarter: two unsecured business loans of ₹25 lakh, one ₹80 lakh loan against property and one ₹40 lakh working capital limit.", math: "At indicative payouts of 2% on the business loans, 1% on the LAP and 1% on the working capital limit, the quarter's payout is approximately ₹2.2 lakh." },
    keywords: ["loan DSA for chartered accountants", "CA loan referral partner", "loan partner program for CA", "DSA registration for chartered accountant"],
    faqs: [
      { question: "Does partnering with a DSA conflict with ICAI guidelines?", answer: "Members should review the ICAI code of ethics on other occupations and referral income and choose the structure that suits their practice, such as registering a separate entity or a family member. We provide the agreement and payout statements needed for transparent accounting." },
      { question: "Do I need to handle documentation?", answer: "No. You share the referral and, if convenient, the financials you already hold. Our desk takes it from there and keeps you informed at each stage." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "insurance-agents",
    name: "Insurance Agents",
    short: "Life and general insurance advisors",
    headline: "Add loans to your product basket and earn from clients you already meet.",
    summary: "Insurance advisors have deep, recurring relationships with households and business owners, and every one of those clients will need a loan at some point. Distributing loans through LoansPartner adds a high-payout product line that complements your policies and deepens the relationship.",
    why: ["Home loan customers need term and property insurance; loan customers need protection. The products reinforce each other.", "Personal loans and home loans fit naturally into life-event conversations you already have.", "No investment, no targets, and payouts that often exceed first-year insurance commission on a comparable client.", "Our processing desk means you never have to become a loan expert."],
    fit: ["LIC and private life insurance agents", "General insurance and health advisors", "Insurance marketing firms and POSPs", "Financial advisors and MDRT members"],
    products: ["personal-loan", "home-loan", "home-loan-balance-transfer", "car-loan", "loan-against-property", "education-loan"],
    example: { scenario: "An insurance advisor refers six clients over a quarter: three personal loans of ₹6 lakh each, two home loans of ₹50 lakh and one car loan of ₹9 lakh.", math: "At indicative payouts of 2% on personal loans, 0.5% on home loans and 1% on the car loan, the quarter's payout is approximately ₹95,000." },
    keywords: ["loan DSA for insurance agents", "insurance agent loan partner", "additional income for insurance advisors", "loan referral for LIC agents"],
    faqs: [
      { question: "Can I refer clients without being a loan expert?", answer: "Yes. You identify the need and share the lead. Our credit desk explains products, checks eligibility and processes the file. You stay informed and get paid on disbursal." },
      { question: "Will my insurance company object?", answer: "Most insurers permit agents to distribute other financial products through separate arrangements. Check your agency agreement; many partners register a family member or a separate entity where required." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "real-estate-agents",
    name: "Real Estate Agents",
    short: "Property consultants and brokers",
    headline: "Close deals faster with financing in hand, and earn on every home loan.",
    summary: "Property consultants lose deals to financing delays every week. As a LoansPartner channel partner you bring a lender panel to the table, get buyers pre-approved before site visits, and earn a payout on every home loan and loan against property that closes through your referral.",
    why: ["Pre-approved buyers close faster and negotiate confidently, which helps your sale.", "Home loans are the largest tickets in retail lending; even a modest percentage is meaningful.", "Sellers who become buyers, and investors who need LAP, create repeat referrals.", "We handle the lender's legal and technical process alongside your registration timeline."],
    fit: ["RERA-registered property agents and brokerages", "Builder sales teams and channel partners", "Property management firms", "Interior and home-improvement businesses"],
    products: ["home-loan", "home-loan-balance-transfer", "loan-against-property", "personal-loan"],
    example: { scenario: "A brokerage closes five home purchases in a quarter with financing through LoansPartner: loans of ₹45 lakh, ₹60 lakh, ₹75 lakh, ₹1 crore and ₹1.2 crore.", math: "At an indicative payout of 0.5% on home loans, the quarter's payout is approximately ₹2 lakh, in addition to your brokerage." },
    keywords: ["home loan DSA for real estate agents", "property dealer loan partner", "real estate agent loan referral income", "home loan partner for brokers"],
    faqs: [
      { question: "Can you pre-approve my buyers before a site visit?", answer: "Yes. Share the buyer's income profile and we return an indicative eligibility and lender shortlist within a day, which you can use in negotiations." },
      { question: "Do you work with under-construction projects?", answer: "Yes, for RERA-registered projects on lender-approved lists. We check approvals and can help get a project onto lender panels." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "ex-bankers",
    name: "Ex-bankers and Finance Professionals",
    short: "Former bank, NBFC and fintech staff",
    headline: "Use your credit judgement and network, without the targets and the branch.",
    summary: "Former bankers and NBFC professionals know how credit decisions are made and have relationships built over years. As a LoansPartner channel partner you apply that judgement across a 40-lender panel rather than a single institution, and earn on disbursals with none of the institutional overhead.",
    why: ["Your understanding of policy means better-qualified files and higher conversion.", "One code covers banks, HFCs and NBFCs, so you are never limited to one product shelf.", "Higher payout slabs are available for partners who bring processing capability.", "Build an independent practice with our portal, training and compliance support."],
    fit: ["Retired or former bank and NBFC officers", "Former fintech and lending-app staff", "Credit and collections professionals", "Wealth managers and relationship managers"],
    products: ["business-loan", "loan-against-property", "working-capital-loan", "home-loan", "personal-loan", "professional-loan"],
    example: { scenario: "A former SME banker sources three business files and two loans against property in a quarter: business loans of ₹30 lakh, ₹40 lakh and ₹50 lakh, and LAPs of ₹1 crore and ₹1.5 crore.", math: "At indicative payouts of 2% on business loans and 1% on LAP, the quarter's payout is approximately ₹4.9 lakh." },
    keywords: ["loan DSA for ex bankers", "retired banker loan agent", "DSA business for finance professionals", "independent loan consultant India"],
    faqs: [
      { question: "Can I build a team under my code?", answer: "Yes. Partners who bring sub-partners or staff can operate under a master code with sub-codes, and we structure payouts accordingly." },
      { question: "Are higher payout slabs available?", answer: "Partners with consistent volume or their own processing capability qualify for enhanced slabs, reviewed quarterly." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "mutual-fund-distributors",
    name: "Mutual Fund and Wealth Distributors",
    short: "MFDs, RIAs and wealth advisors",
    headline: "Your clients trust you with their wealth. They will trust you with their borrowing too.",
    summary: "Mutual fund distributors and wealth advisors advise households on every major financial decision, and borrowing is one of the largest. Adding loans through LoansPartner gives your clients a trusted route to home loans, loans against property and balance transfers, and gives you a payout that complements trail income.",
    why: ["Balance transfers and top-ups are natural advice for clients paying high rates, and they pay well.", "Loans against property fund education and business needs without redeeming investments.", "The service deepens your advisory relationship and defends it from banks that bundle products.", "No investment, no targets, and full processing support from our desk."],
    fit: ["AMFI-registered mutual fund distributors", "SEBI-registered investment advisers", "Wealth management boutiques", "Financial planners"],
    products: ["home-loan-balance-transfer", "home-loan", "loan-against-property", "personal-loan", "education-loan"],
    example: { scenario: "A wealth advisor refers three clients in a quarter: two home loan balance transfers of ₹60 lakh and ₹80 lakh with top-ups, and one ₹1 crore loan against property for a client's business.", math: "At indicative payouts of 0.5% on the transfers and 1% on the LAP, the quarter's payout is approximately ₹1.7 lakh." },
    keywords: ["loan DSA for mutual fund distributors", "wealth advisor loan partner", "MFD additional income loans", "loan referral for financial planners"],
    faqs: [
      { question: "Does this conflict with my advisory registration?", answer: "Review your SEBI or AMFI obligations on other activities. Many advisors register a separate entity or family member as the partner; we provide the agreement structure to keep it transparent." },
      { question: "Can clients get a loan against their mutual fund holdings?", answer: "Yes, through select lenders. Speak to our desk about loans against securities for clients who prefer not to redeem." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "working-professionals",
    name: "Working Professionals and Freelancers",
    short: "Anyone with a network",
    headline: "Earn a serious second income from referrals, with no investment and no target.",
    summary: "You do not need a finance background to succeed as a LoansPartner channel partner. Colleagues, friends, community members and social media followers all need loans, and a compliant referral through our desk earns you a payout on every disbursal. Many of our partners started with a single referral.",
    why: ["Personal loans and car loans are quick to close and pay well for the effort.", "No fees, no deposit, no minimum business: earn on what you refer.", "Training, WhatsApp support and a portal that shows every file's status.", "Grow into a full-time practice or keep it as a side income."],
    fit: ["Salaried professionals in corporate offices", "Freelancers, consultants and creators", "Community leaders and society office bearers", "Students and homemakers with strong networks"],
    products: ["personal-loan", "car-loan", "used-car-loan", "home-loan", "education-loan", "gold-loan"],
    example: { scenario: "A corporate professional refers five colleagues in a quarter for personal loans averaging ₹5 lakh and one for a ₹10 lakh car loan.", math: "At indicative payouts of 2% on personal loans and 1% on the car loan, the quarter's payout is approximately ₹60,000." },
    keywords: ["become loan agent", "part time loan DSA", "loan referral income", "how to earn from loan referrals", "DSA registration online"],
    faqs: [
      { question: "How much time does it take?", answer: "As little as an hour a week. You identify the need, share basic details with us, and help the borrower gather documents. Everything else is handled by our desk." },
      { question: "Can I do this alongside my job?", answer: "Yes. Check your employer's policy on outside income; most permit referral-based activities. Payouts are made to your bank account with a statement for your records." },
    ],
    updatedAt: "2026-09-01",
  },
];

export const audienceMap = new Map(partnerAudiences.map((a) => [a.slug, a]));
export const getAudience = (slug: string) => audienceMap.get(slug);
