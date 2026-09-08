import type { City } from "@/data/city-types";

export const citiesBatch1: City[] = [
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    region: "West",
    tier: 1,
    tagline: "India's financial capital, where lender competition is fiercest and ticket sizes largest.",
    overview: [
      "Mumbai is home to the head offices of most Indian banks, housing finance companies and NBFCs, which means every lender programme launches here first and pricing is as competitive as anywhere in the country. Salaried professionals in banking, insurance, media, pharma and consulting have access to pre-approved offers from multiple institutions at once, and the challenge is choosing well rather than getting approved.",
      "The flip side is cost. Property prices in Mumbai make home loans and loans against property very large by national standards, so even a small rate difference has a meaningful rupee impact over the tenure. Our Mumbai desk spends most of its time on exactly that comparison, and on documentation for older buildings, redevelopment projects and society transfers that trip up standard checklists.",
    ],
    economy:
      "The Mumbai Metropolitan Region combines the corporate corridors of Nariman Point, Bandra Kurla Complex, Lower Parel and Andheri with the industrial belts of Thane, Navi Mumbai and Bhiwandi. Banking, capital markets, insurance, entertainment, pharmaceuticals, diamonds and textiles all cluster here, producing a deep pool of salaried borrowers and a large base of family-run trading and manufacturing businesses.",
    propertyMarket:
      "Mumbai has the highest residential prices in India, with strong demand in the western suburbs, central Mumbai's redeveloped mill land, Navi Mumbai and Thane. Stamp duty in Mumbai is 5% plus a 1% metro cess, with a concession for women buyers, and registration is capped at ₹30,000. Verify the current schedule with the state before you transact. Lenders scrutinise society NOCs, occupancy certificates and redevelopment agreements closely, and many older buildings need additional legal work.",
    lenderPresence:
      "Every major bank, housing finance company and NBFC operates full retail and SME credit teams in Mumbai, and many decisions are taken locally rather than at a regional hub. This depth means we can place unusual cases, such as loans on old buildings, pagdi-to-ownership conversions or surrogate-income business files, with a lender that has seen them before.",
    localNotes: [
      "Society NOC and share certificate are routinely required for flat purchases and loans against property in cooperative housing societies.",
      "Redevelopment and under-construction projects in Mumbai are financed by most lenders only after RERA registration and project approval.",
      "Salaried borrowers with employers in BKC, Lower Parel and Andheri typically qualify for corporate-category pricing with several banks.",
    ],
    productNotes: {
      "personal-loan":
        "Personal loans in Mumbai are dominated by pre-approved offers for salaried employees of listed companies, banks and multinationals, with amounts up to ₹40 lakh available to senior professionals. High rents and lifestyle costs mean fixed obligations run high, so we pay close attention to the FOIR calculation and often recommend a slightly longer tenure to keep the file within policy without cutting the amount.",
      "home-loan":
        "Home loans in Mumbai are large, with ₹75 lakh to ₹2 crore being routine in the suburbs and higher in South and Central Mumbai. Lenders offer 75% funding above ₹75 lakh, so buyers need meaningful own contribution. We help with the extra legal steps that older societies, redevelopment allotments and MHADA properties require, and we compare rates across banks and HFCs where a 0.25% spread difference on a ₹1.2 crore loan is worth several lakh rupees.",
      "business-loan":
        "Mumbai's trading and manufacturing families, from Bhiwandi textiles to Zaveri Bazaar jewellers and Andheri media firms, are well served by unsecured business loan programmes, and lenders here are comfortable with GST and banking-based assessments. Turnover thresholds are higher than in smaller cities, so we route smaller firms to NBFC programmes and larger ones to bank pricing.",
      "loan-against-property":
        "Because property values are so high, a loan against a modest Mumbai flat or shop can raise a substantial amount, and LAP is the most cost-effective route for business owners who would otherwise borrow unsecured. Lenders here value properties conservatively in older buildings without occupancy certificates, so we shortlist lenders by their appetite for the specific building type and location.",
      "car-loan":
        "Car buyers in Mumbai benefit from dense dealer networks and aggressive bank campaigns, with 100% on-road funding common for salaried applicants. Parking constraints mean compact and electric models dominate, and several lenders offer lower rates for EVs. We compare bank offers with dealer finance so that a cash discount is not offset by a higher rate.",
    },
    nearbySlugs: ["pune", "surat", "ahmedabad"],
    keywords: ["loan in Mumbai", "personal loan Mumbai", "home loan Mumbai", "business loan Mumbai", "loan against property Mumbai", "loan DSA Mumbai", "loan agent Mumbai"],
    faqs: [
      { question: "Which lenders offer the best home loan rates in Mumbai?", answer: "Rates are national, but Mumbai has the widest choice: all large banks and HFCs compete here, and salaried buyers of approved projects get the sharpest repo-linked spreads. The lender that is best for you depends on your income type and the building's documentation; we compare all-in cost rather than headline rates." },
      { question: "Can I get a loan against a flat in an old Mumbai building?", answer: "Usually yes, but the lender universe narrows for buildings without an occupancy certificate or with redevelopment pending. Several banks and HFCs have programmes for such properties at slightly higher rates and lower loan-to-value. We place these files with lenders that fund them." },
      { question: "Do you serve Navi Mumbai and Thane?", answer: "Yes. Our Mumbai desk covers the entire Mumbai Metropolitan Region including Thane, Navi Mumbai, Kalyan, Vasai-Virar and Panvel, with the same lender panel." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi",
    region: "North",
    tier: 1,
    tagline: "The capital's mix of government, corporate and trading incomes needs lender-specific handling.",
    overview: [
      "Delhi's borrower base is unusually varied: central and state government employees, PSU staff, corporate professionals in Connaught Place and Aerocity, and a very large trading community across Chandni Chowk, Karol Bagh, Lajpat Nagar and the industrial areas of Okhla, Bawana and Narela. Each group is treated differently by lenders, and the best lender for a government employee is rarely the best for a trader with cash-heavy banking.",
      "Property in Delhi brings its own vocabulary: DDA flats, freehold and leasehold conversions, builder floors on plotted land, L&DO properties and unauthorised colonies that lenders will not touch. Our Delhi desk knows which lenders finance which property type and how to document builder-floor purchases so that sanctions do not stall at the legal stage.",
    ],
    economy:
      "Delhi's economy rests on government and public sector employment, services, wholesale and retail trade, and a growing base of startups and professional firms. The city is the hub of the National Capital Region, with Gurugram and Noida supplying corporate and IT employment to a large commuting population that borrows through Delhi addresses.",
    propertyMarket:
      "Residential property ranges from DDA flats in Dwarka and Rohini to builder floors in South Delhi colonies and premium apartments in Vasant Kunj and Chanakyapuri. Stamp duty is 6% for men, 4% for women and 5% for joint ownership, plus 1% registration. Lenders prefer freehold properties with a clear chain of title and an approved building plan; leasehold DDA properties are financed with additional documentation.",
    lenderPresence:
      "All public sector banks have strong retail operations in Delhi, and government employees often get the best pricing through salary account relationships. Private banks and NBFCs run large SME and LAP books here, particularly for the trading community, with programmes that assess businesses on banking and GST rather than reported profit.",
    localNotes: [
      "Builder floors on plots are financed by most lenders provided the plan is sanctioned and the plot is freehold; unauthorised colonies are generally excluded.",
      "Government and PSU employees qualify for special rates and higher multiples with several public sector banks.",
      "Traders in wholesale markets are best served by lenders with banking-surrogate business loan and LAP programmes.",
    ],
    productNotes: {
      "personal-loan":
        "Delhi personal loan applicants span government employees with pension-backed stability, corporate professionals and self-employed traders. Public sector banks price government staff very competitively, while private banks favour corporate salary accounts. For self-employed applicants we lean on NBFC programmes that assess bank statements rather than ITR alone, which suits the city's trading community.",
      "home-loan":
        "Home loans in Delhi involve more property due diligence than almost anywhere else: freehold status, DDA conveyance, builder-floor plan sanction and mutation records all come into play. We prepare the property file before approaching the lender so that legal clearance is quick, and we match government employees to public sector banks and corporate borrowers to private banks and HFCs for the best pricing.",
      "business-loan":
        "Delhi's wholesale traders, garment exporters, manufacturers in Okhla and Bawana and service firms in Nehru Place have strong access to unsecured business credit, with lenders comfortable assessing GST turnover and banking. Cash-heavy businesses benefit from programmes that look at average bank balance and transaction patterns rather than reported profits.",
      "loan-against-property":
        "Loans against property are extremely popular with Delhi's business families because commercial shops in markets such as Karol Bagh and Lajpat Nagar and residential builder floors carry high valuations. Lenders differentiate sharply between freehold and leasehold and between authorised and unauthorised colonies, so lender selection decides both approval and rate.",
      "car-loan":
        "Delhi has the country's largest car market, with dense dealer networks across the city and strong competition among banks and captive financiers. Government and PSU employees receive concessional rates from public sector banks, and EV buyers benefit from state incentives alongside lender EV schemes.",
    },
    nearbySlugs: ["gurugram", "noida", "chandigarh"],
    keywords: ["loan in Delhi", "personal loan Delhi", "home loan Delhi", "business loan Delhi", "loan against property Delhi", "loan DSA Delhi", "loan agent Delhi NCR"],
    faqs: [
      { question: "Can I get a home loan for a builder floor in Delhi?", answer: "Yes, if the plot is freehold, the building plan is sanctioned by the MCD and the chain of title is clear. Most banks and HFCs fund builder floors in authorised colonies. Properties in unauthorised colonies are generally not financed by regulated lenders." },
      { question: "Do government employees get lower loan rates in Delhi?", answer: "Public sector banks offer concessional home and personal loan rates and higher eligibility to central and state government and PSU employees with salary accounts. We compare these against private bank offers to confirm the best deal." },
      { question: "Which areas of Delhi do you cover?", answer: "All of Delhi, including Dwarka, Rohini, Pitampura, South Delhi, East Delhi and the industrial areas, plus the wider NCR through our Gurugram and Noida desks." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    region: "South",
    tier: 1,
    tagline: "Technology salaries, startup equity and fast-moving property: a market built for well-structured loans.",
    overview: [
      "Bengaluru's borrowers are overwhelmingly salaried technology and services professionals with strong, well-documented incomes, which makes them the most sought-after personal loan and home loan customers in the country. Lenders compete hard for employees of large IT firms, global capability centres and funded startups, and pre-approved offers are common.",
      "The complications are elsewhere: property documentation in Karnataka, with its A-khata and B-khata distinctions, BDA and BBMP approvals and layout conversions, is where home loans and loans against property get stuck. Our Bengaluru desk handles this daily and knows which lenders fund which categories.",
    ],
    economy:
      "Bengaluru is India's technology capital, with Electronic City, Whitefield, Outer Ring Road and Manyata hosting IT services, product companies and global capability centres, alongside aerospace, biotechnology and a dense startup ecosystem. Manufacturing clusters in Peenya and Bommasandra add a large MSME base.",
    propertyMarket:
      "Residential demand is concentrated along the IT corridors: Whitefield, Sarjapur Road, Electronic City, Hebbal and North Bengaluru near the airport. Stamp duty is 5% for properties above ₹45 lakh plus surcharge and cess, and registration is 1%. Lenders require A-khata for standard funding; B-khata and revenue-site properties are financed by fewer lenders at lower loan-to-value.",
    lenderPresence:
      "Private banks, HFCs and NBFCs have very large books in Bengaluru and run dedicated programmes for IT employees, including higher multiples for RSU-bearing or variable-pay profiles. Public sector banks are strong on government and PSU staff and on plot purchase and construction loans.",
    localNotes: [
      "A-khata versus B-khata determines lender appetite and loan-to-value for many Bengaluru properties.",
      "Salaried IT professionals frequently qualify for corporate-category personal loan pricing with several banks.",
      "Startup employees with ESOPs and variable pay are underwritten differently by lenders; we choose lenders that count such income.",
    ],
    productNotes: {
      "personal-loan":
        "Bengaluru's technology workforce enjoys the best personal loan pricing in the country, with several banks offering 10.25% to 11.5% p.a. to employees of listed IT companies and large GCCs. Startup employees with variable pay or recent job changes need lenders that read the full profile, and we route such files to banks with more flexible tenure and employment-vintage norms.",
      "home-loan":
        "Home loans in Bengaluru are shaped by property documentation more than by income. A-khata apartments in approved projects sanction quickly; B-khata sites, gram panchayat approvals and DC-converted land need lenders with specific programmes. We check the property first and then match the lender, and we compare the strong HFC presence here against bank rates for IT salaried buyers.",
      "business-loan":
        "Bengaluru's MSMEs in Peenya, Bommasandra and Jigani, alongside a fast-growing base of service startups and D2C brands, use unsecured business loans for working capital. Lenders here are experienced with young, high-growth firms and with revenue-based assessments, and several NBFCs run programmes for businesses under three years old with strong banking.",
      "loan-against-property":
        "Rising property values on the IT corridors make loans against property attractive for business owners and for professionals funding overseas education or a second home. Lender selection hinges on khata type, approval authority and whether the property is a site, an apartment or an independent house; we handle all three with lenders that have Bengaluru-specific programmes.",
      "car-loan":
        "Car loans in Bengaluru are quick for salaried applicants, and the city has become India's largest EV market by share, with lenders offering dedicated electric vehicle schemes at lower rates and longer tenures. We compare captive finance offers on popular models with bank rates, including for the premium segment popular with senior technology professionals.",
    },
    nearbySlugs: ["chennai", "hyderabad", "kochi"],
    keywords: ["loan in Bengaluru", "personal loan Bangalore", "home loan Bangalore", "business loan Bangalore", "loan against property Bangalore", "loan DSA Bangalore", "loan agent Bengaluru"],
    faqs: [
      { question: "Can I get a home loan on a B-khata property in Bengaluru?", answer: "A limited number of lenders fund B-khata properties, typically at lower loan-to-value and a slightly higher rate, and only when other approvals are in order. A-khata properties are financed by all lenders. We identify the right lender before you commit to a property." },
      { question: "Do startup employees qualify for personal loans?", answer: "Yes. Some banks require the employer to be on their approved list, but several banks and NBFCs underwrite startup employees on salary credits and bank statements. Recent job changes and variable pay are handled better by some lenders than others." },
      { question: "Is there special financing for electric cars in Bengaluru?", answer: "Several banks and NBFCs offer EV-specific car loans with lower interest rates and tenures up to 8 years. We compare these with manufacturer captive finance for the model you choose." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    region: "South",
    tier: 1,
    tagline: "Pharma, IT and a surging property market, with some of the most borrower-friendly registration in India.",
    overview: [
      "Hyderabad combines a large technology and pharmaceutical workforce with an active real estate market that has grown rapidly westward from HITEC City and Gachibowli toward the Outer Ring Road. Salaried professionals at global technology firms, pharma majors and public sector units have access to competitive personal and home loan offers.",
      "The city's registration system is unusually transparent, with online encumbrance certificates and market value data, which speeds up lender legal checks compared with many other metros. Our Hyderabad desk uses that to get home loans and loans against property sanctioned quickly, while paying attention to HMDA and GHMC approvals for newer layouts.",
    ],
    economy:
      "Hyderabad hosts one of India's largest IT and global capability centre clusters in HITEC City, Gachibowli and Financial District, the Genome Valley life sciences hub, major pharmaceutical manufacturers, defence and aerospace units and a growing base of startups. Traditional trade around Charminar and Secunderabad adds a large self-employed segment.",
    propertyMarket:
      "Residential demand is strongest in the western corridor: Gachibowli, Kondapur, Kokapet, Narsingi and Tellapur, with affordable growth in Bachupally, Miyapur and Kompally. Stamp duty is 4% plus 1.5% transfer duty and 0.5% registration, about 6% in total. Lenders look for HMDA or GHMC approvals and a clear encumbrance certificate, and most approved projects sanction quickly.",
    lenderPresence:
      "All major banks and HFCs have large retail operations in Hyderabad, and several run dedicated pharma and IT employee programmes. NBFCs are active in business loans and loans against property for the trading and manufacturing community across Secunderabad, Balanagar and Jeedimetla.",
    localNotes: [
      "Online encumbrance certificates and market-value data make legal checks quicker than in most metros.",
      "HMDA and GHMC approval status matters for plots and independent houses; gram panchayat approvals narrow the lender set.",
      "Employees of large pharma and IT companies often qualify for pre-approved offers at corporate-category pricing.",
    ],
    productNotes: {
      "personal-loan":
        "Hyderabad's technology and pharmaceutical professionals are prime personal loan borrowers with access to bank pricing from around 10.5% p.a. and amounts up to ₹40 lakh for senior roles. Self-employed traders and small manufacturers are served by NBFC programmes that assess banking behaviour, and we choose between the two based on how the income shows up in documents.",
      "home-loan":
        "Home loans in Hyderabad move fast: approved projects in Kokapet, Tellapur and Kompally sanction in days because registration and encumbrance checks are online. Ticket sizes in the western corridor have risen sharply, so rate comparison matters, and we look at both banks and HFCs for salaried buyers and at lenders with plot-plus-construction programmes for buyers of HMDA-approved plots.",
      "business-loan":
        "Hyderabad's pharma ancillary units, engineering workshops in Balanagar and Jeedimetla, and service businesses across the city qualify for unsecured business loans on GST turnover and banking. Lenders are also familiar with the city's large pharmaceutical supply chain, which helps vendors to major manufacturers secure larger limits.",
      "loan-against-property":
        "Rapid appreciation in West Hyderabad has made loans against property a strong option for business owners and for families funding overseas education, which is very common here. Transparent market-value data helps lenders value quickly; lender selection depends mainly on property approval status and the income assessment method that suits the borrower.",
      "car-loan":
        "Car loans in Hyderabad are competitive across banks and captive financiers, with quick approvals for salaried applicants and 100% on-road schemes on popular models. Telangana's EV policy incentives combine well with lender EV schemes for buyers considering electric cars.",
    },
    nearbySlugs: ["bengaluru", "chennai", "pune"],
    keywords: ["loan in Hyderabad", "personal loan Hyderabad", "home loan Hyderabad", "business loan Hyderabad", "loan against property Hyderabad", "loan DSA Hyderabad", "loan agent Hyderabad"],
    faqs: [
      { question: "How quickly can a home loan be sanctioned in Hyderabad?", answer: "For salaried buyers of approved projects, 3 to 5 working days is typical because encumbrance and market-value checks are online in Telangana. Resale and plot cases take a little longer for legal verification." },
      { question: "Can I get a loan against an HMDA-approved plot?", answer: "Yes. Several banks and HFCs offer loans against approved plots and plot-plus-construction loans. Gram panchayat plots without HMDA approval are funded by very few lenders." },
      { question: "Do you cover Secunderabad and the outer ring road areas?", answer: "Yes. Our Hyderabad desk serves the whole GHMC area and the HMDA region, including Secunderabad, Kompally, Shamshabad and the western suburbs." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    region: "South",
    tier: 1,
    tagline: "Manufacturing, IT and conservative borrowing culture: lenders here reward clean, complete files.",
    overview: [
      "Chennai's economy is broader than most metros, with automobile and component manufacturing, IT services along the OMR corridor, healthcare, ports and a deep base of family-run trading and industrial businesses. Borrowers here tend to be conservative and well-documented, and lenders respond with strong pricing for salaried professionals and established businesses.",
      "Tamil Nadu's high stamp duty and registration charges make home loan sizing important, and the state's property documentation, including patta, chitta and approved layouts from CMDA or DTCP, determines which lenders will finance a given property. Our Chennai desk checks these before the application so that sanctions are not delayed.",
    ],
    economy:
      "Chennai is India's automobile manufacturing hub, with plants and supplier clusters in Sriperumbudur, Oragadam and Maraimalai Nagar, alongside IT and ITES on Old Mahabalipuram Road and in Sholinganallur, a large healthcare sector, ports and logistics in Ennore, and traditional trade in T. Nagar, Parry's Corner and Ambattur's industrial estate.",
    propertyMarket:
      "Residential demand is spread across OMR and ECR in the south, Porur and Poonamallee in the west, and Ambattur and Anna Nagar in the north-west. Stamp duty is 7% and registration 4%, among the highest in India, so buyers need to budget for around 11% in transaction costs. Lenders require CMDA or DTCP approval and clear patta for standard financing.",
    lenderPresence:
      "Public sector banks headquartered in Chennai have a strong home loan and MSME presence, joined by every private bank, HFC and NBFC. Lenders run specific programmes for automobile ancillary suppliers and for IT employees on the OMR corridor.",
    localNotes: [
      "Patta and chitta documents and CMDA or DTCP approval are checked by every lender for plots and independent houses.",
      "Automobile ancillary units with purchase orders from OEMs have access to specialised working capital programmes.",
      "Stamp duty and registration of about 11% affect the own-contribution calculation on home purchases.",
    ],
    productNotes: {
      "personal-loan":
        "Chennai's salaried professionals in IT, automotive and healthcare receive competitive personal loan pricing from banks, with pre-approved offers common for employees of large manufacturers and IT firms. The city's conservative borrowing pattern shows in low credit utilisation, which generally translates into stronger scores and better rates; we make sure the lender chosen reflects that.",
      "home-loan":
        "Home loans in Chennai require careful property vetting: patta in the seller's name, CMDA or DTCP approval and an approved building plan are non-negotiable for most lenders. With transaction costs around 11%, we help buyers size the loan correctly and compare the strong public sector bank offers here against private banks and HFCs for the same profile.",
      "business-loan":
        "Chennai's automotive suppliers, engineering firms in Ambattur, textile traders and healthcare businesses have well-documented financials that lenders value. Unsecured business loans are readily available on GST turnover, and suppliers to large OEMs qualify for larger limits with lenders that recognise the strength of their customers.",
      "loan-against-property":
        "Loans against property in Chennai are popular with industrial and trading families in Ambattur, Guindy and Ekkatuthangal, and with landlords of commercial property in T. Nagar and Anna Nagar. Clear patta and approvals allow high loan-to-value from banks; older properties without full approvals go to HFCs and NBFCs with suitable programmes.",
      "car-loan":
        "As the country's automobile capital, Chennai has dense dealer networks and strong captive finance offers, especially for brands manufactured locally. We compare these against bank car loans, which often price lower for salaried applicants, and we track the Tamil Nadu EV incentives that pair with lender EV schemes.",
    },
    nearbySlugs: ["bengaluru", "hyderabad", "kochi"],
    keywords: ["loan in Chennai", "personal loan Chennai", "home loan Chennai", "business loan Chennai", "loan against property Chennai", "loan DSA Chennai", "loan agent Chennai"],
    faqs: [
      { question: "What property documents do lenders need in Chennai?", answer: "Patta and chitta in the seller's name, the parent documents and chain of title, CMDA or DTCP layout approval, an approved building plan and an encumbrance certificate for at least 13 to 30 years. We review these before you apply." },
      { question: "How much should I budget for registration in Chennai?", answer: "Stamp duty is 7% and registration 4%, so about 11% of the guideline or agreement value, whichever is higher. This must come from your own funds because lenders finance only the property value." },
      { question: "Do you serve the OMR and Sriperumbudur areas?", answer: "Yes. Our Chennai desk covers the entire Chennai Metropolitan Area including OMR, ECR, Sriperumbudur, Oragadam, Tambaram and Avadi." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    region: "East",
    tier: 1,
    tagline: "Eastern India's commercial hub, where lender selection matters more because fewer programmes are local.",
    overview: [
      "Kolkata anchors eastern India's credit market with a large base of public sector and corporate employees, a deep trading and manufacturing community across Burrabazar, Howrah and the industrial belts, and a growing IT sector in Salt Lake Sector V and New Town. Lender competition is somewhat less intense than in Mumbai or Bengaluru, which makes choosing the right lender more consequential for pricing and approval.",
      "Property here has its own conventions: cooperative housing, older buildings in North and Central Kolkata, thika tenancy issues and mutation with the Kolkata Municipal Corporation all affect financing. Our Kolkata desk knows which lenders are comfortable with each, and where a housing finance company is a better route than a bank.",
    ],
    economy:
      "Kolkata's economy spans public sector undertakings, banking and insurance head offices, jute and engineering, leather in Bantala, tea and commodity trading, IT and ITES in Salt Lake and New Town, and one of the country's largest wholesale trading communities. Howrah and Hooghly add a dense MSME manufacturing base.",
    propertyMarket:
      "Residential demand is concentrated in New Town and Rajarhat, the EM Bypass corridor, South Kolkata and Howrah's riverside developments. Stamp duty is around 6% to 7% depending on value and location, plus 1% registration. Lenders scrutinise mutation, completion certificates and society or association documents, and many older properties need extra legal work.",
    lenderPresence:
      "Public sector banks with regional headquarters in Kolkata are strong on home loans and MSME finance; private banks, HFCs and NBFCs operate across the city with growing LAP and business loan books focused on the trading community.",
    localNotes: [
      "Mutation records and completion certificates from KMC are routinely requested for resale properties.",
      "The wholesale trading community is best served by lenders with banking-based business loan programmes.",
      "Public sector and government employees qualify for concessional rates with several banks headquartered locally.",
    ],
    productNotes: {
      "personal-loan":
        "Personal loans in Kolkata are driven by public sector and corporate salaried employees, who receive competitive pricing from banks with strong local presence, and by IT professionals in Salt Lake and New Town who qualify for private bank programmes. Self-employed traders benefit from NBFC programmes that assess bank statements rather than reported income.",
      "home-loan":
        "Home loans in Kolkata are well served by public sector banks and HFCs for New Town and Rajarhat projects, while older properties in North and South Kolkata need lenders comfortable with cooperative structures and older completion certificates. We check mutation and building documents early and route each file to a lender that funds that property type at the best rate.",
      "business-loan":
        "Kolkata's traders in Burrabazar and Posta, engineering units in Howrah and leather exporters in Bantala have access to unsecured business loans from banks and NBFCs, with turnover assessed through GST and banking. Family businesses with modest reported profits but strong banking do best with surrogate-income programmes.",
      "loan-against-property":
        "Commercial property in Burrabazar, Park Street and Salt Lake, and residential property in South Kolkata, supports substantial loans against property for business families. Lender appetite depends heavily on title clarity and building age, so we shortlist lenders with local experience in older buildings and cooperative flats.",
      "car-loan":
        "Car loans in Kolkata are competitive for salaried applicants, with bank and captive finance options across the city's dealer network. Public sector employees receive concessional rates, and the city's growing EV adoption is supported by lender EV schemes.",
    },
    nearbySlugs: ["delhi", "lucknow", "noida"],
    keywords: ["loan in Kolkata", "personal loan Kolkata", "home loan Kolkata", "business loan Kolkata", "loan against property Kolkata", "loan DSA Kolkata", "loan agent Kolkata"],
    faqs: [
      { question: "Can I get a home loan for an old building in Kolkata?", answer: "Often yes, through HFCs and some banks, provided the title is clear, the building has a completion certificate and mutation is in order. Loan-to-value may be lower for buildings older than 30 to 40 years. We match the property to a lender that funds it." },
      { question: "Are there special loan rates for government employees in Kolkata?", answer: "Yes. Several public sector banks with strong Kolkata operations offer concessional home and personal loan rates and higher eligibility to central and state government and PSU employees." },
      { question: "Do you serve Howrah and New Town?", answer: "Yes. Our Kolkata desk covers the Kolkata Metropolitan Area including Howrah, Salt Lake, New Town, Rajarhat, Barrackpore and Garia." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    region: "West",
    tier: 1,
    tagline: "IT, automotive and education: a young, salaried city with fast-moving home loans.",
    overview: [
      "Pune has one of the youngest borrower bases among large Indian cities, dominated by IT professionals in Hinjawadi, Kharadi and Magarpatta, automotive and engineering employees in Chakan and Pimpri-Chinchwad, and a large student and academic community. Personal loans and first home loans are the biggest products, and lenders compete intensely for salaried applicants.",
      "The city's property market has expanded rapidly to Wakad, Ravet, Wagholi and Hadapsar, with a large share of under-construction purchases. Our Pune desk works closely with RERA-registered projects and lender-approved lists to move sanctions quickly, and with resale flats in older societies where society NOCs and completion certificates come into play.",
    ],
    economy:
      "Pune combines a large IT and software services cluster with the Pimpri-Chinchwad and Chakan automotive and engineering belt, a strong education sector and growing biotechnology and startup activity. The result is a deep pool of salaried borrowers, supported by a large base of component manufacturers and service businesses.",
    propertyMarket:
      "Residential demand is spread across the western IT corridor of Hinjawadi, Wakad and Baner, the eastern hub of Kharadi, Viman Nagar and Wagholi, and the affordable belts of Ravet and Moshi. Stamp duty is 5% plus a 1% metro cess in Pune and Pimpri-Chinchwad, with a further local body tax in the municipal limits and a concession for women buyers; registration is 1% capped at ₹30,000. Verify the current schedule with the state before you transact. Approved, RERA-registered projects sanction quickly.",
    lenderPresence:
      "All major banks, HFCs and NBFCs operate large retail books in Pune, with several running IT employee programmes and project tie-ups across the western and eastern corridors. NBFCs are active in business loans and LAP for the Pimpri-Chinchwad manufacturing base.",
    localNotes: [
      "Most large projects in Pune are on lender-approved lists, which shortens home loan sanction times.",
      "IT and automotive employees frequently receive corporate-category personal loan pricing.",
      "Component manufacturers supplying OEMs in Chakan qualify for supplier-linked working capital programmes.",
    ],
    productNotes: {
      "personal-loan":
        "Pune's IT and engineering professionals are prime personal loan customers, with bank pricing from around 10.5% p.a. and generous amounts for employees of large firms in Hinjawadi and Kharadi. Younger applicants with shorter job histories are placed with lenders that accept six months in the current role, and we structure tenures so first-time borrowers stay comfortably within FOIR limits.",
      "home-loan":
        "Home loans in Pune are among the fastest in the country for approved projects in Wakad, Hinjawadi, Kharadi and Wagholi, where lenders have already completed legal checks. First-time buyers dominate, and we help them compare bank and HFC offers, plan the metro cess and registration outlay, and understand pre-EMI on under-construction purchases.",
      "business-loan":
        "Pune's automotive component makers, engineering workshops in Bhosari and Chakan, and service firms across the city have strong access to unsecured business loans, with lenders assessing GST turnover and banking. Suppliers with purchase orders from large OEMs qualify for larger limits and better rates through supply chain programmes.",
      "loan-against-property":
        "Loans against property are widely used by Pune's manufacturing families and by professionals with flats in appreciating corridors. Society NOCs and completion certificates are standard requirements, and industrial property in Pimpri-Chinchwad and Chakan is financed by lenders with industrial LAP programmes at attractive loan-to-value.",
      "car-loan":
        "Pune's automotive heritage means dense dealer networks and strong captive finance options for locally manufactured brands. Bank car loans for salaried IT employees are competitive, and the city's early EV adoption is supported by lender EV schemes and Maharashtra's incentives.",
    },
    nearbySlugs: ["mumbai", "surat", "hyderabad"],
    keywords: ["loan in Pune", "personal loan Pune", "home loan Pune", "business loan Pune", "loan against property Pune", "loan DSA Pune", "loan agent Pune"],
    faqs: [
      { question: "How fast can a home loan be approved in Pune?", answer: "For salaried applicants buying in lender-approved projects, sanction in 3 to 5 working days is common. Resale flats in older societies take longer because of society NOCs and completion certificate checks." },
      { question: "Can a first-time employee get a personal loan in Pune?", answer: "Yes. Several banks and NBFCs accept applicants with six months in the current job and one year of total experience, subject to income and score. We match younger applicants with lenders that have these norms." },
      { question: "Do you cover Pimpri-Chinchwad and Chakan?", answer: "Yes. Our Pune desk serves the whole Pune Metropolitan Region including Pimpri-Chinchwad, Chakan, Talegaon, Hinjawadi and Wagholi." },
    ],
    updatedAt: "2026-09-01",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    region: "West",
    tier: 1,
    tagline: "A trading and manufacturing powerhouse where business credit and loans against property lead.",
    overview: [
      "Ahmedabad's credit market is defined by business. Textiles, pharmaceuticals, chemicals, engineering and a vast trading community make business loans, working capital and loans against property the dominant products, alongside home loans in a fast-expanding city with GIFT City and the Sardar Patel Ring Road opening new corridors.",
      "Lenders here are used to family-run enterprises with modest reported profits and strong banking, and several run surrogate-income programmes designed for exactly that. Our Ahmedabad desk matches each business to the assessment method that yields the best result, and handles the state's property conventions from NA permissions to society share certificates.",
    ],
    economy:
      "Ahmedabad is western India's manufacturing and trading centre, with textiles and apparel, pharmaceuticals and chemicals in Vatva, Naroda and Sanand, engineering, and a large wholesale trade. GIFT City in Gandhinagar is developing as an international financial hub, adding a growing base of finance professionals.",
    propertyMarket:
      "Residential demand is strong in the western belt of Prahlad Nagar, Bopal, South Bopal and Shela, and in the affordable growth areas along the SP Ring Road and toward Gandhinagar. Stamp duty is 4.9% and registration 1%, with registration waived for women buyers. Lenders check NA permission for plots, AUDA or AMC approvals and society share certificates.",
    lenderPresence:
      "All major banks, HFCs and NBFCs are present, with particularly strong SME and LAP books. Several lenders run textile and pharma cluster programmes, and Gujarat's cooperative banks add local options for business borrowers.",
    localNotes: [
      "Surrogate-income and banking-based business loan programmes are widely available for trading families.",
      "NA permission and AUDA or AMC approvals are required for financing plots and independent bungalows.",
      "Textile and pharma cluster units qualify for sector-specific working capital and machinery finance.",
    ],
    productNotes: {
      "personal-loan":
        "Personal loans in Ahmedabad serve salaried employees of pharma, chemical and engineering companies as well as GIFT City finance professionals, who receive competitive bank pricing. Self-employed applicants, who form a large share of the city, are placed with lenders that assess bank statements and GST rather than reported income.",
      "home-loan":
        "Home loans in Ahmedabad benefit from low transaction costs and a large supply of approved projects in Bopal, Shela, Gota and along the SP Ring Road. Buyers of plots and bungalows need lenders comfortable with NA permission and construction-linked disbursal. We compare bank and HFC offers and handle society share transfers for resale flats.",
      "business-loan":
        "Ahmedabad is one of India's strongest markets for unsecured business loans, with lenders experienced in textiles, pharma, chemicals and trading. Businesses with solid GST turnover and banking qualify for bank pricing; younger or cash-heavy businesses are served by NBFC surrogate programmes. We structure the request to fit the lender's sector appetite.",
      "loan-against-property":
        "Loans against property are the workhorse of Ahmedabad business finance, with residential bungalows, commercial offices in Prahlad Nagar and industrial sheds in Vatva and Naroda all financed at attractive rates. Industrial property programmes are widely available, and we match the property type and income method to the lender with the best loan-to-value.",
      "car-loan":
        "Car loans in Ahmedabad are competitive across banks and captive financiers, with quick decisions for salaried applicants and business owners with clean banking. The city's large self-employed base benefits from lenders that underwrite car loans on bank statements and prior repayment history.",
    },
    nearbySlugs: ["surat", "mumbai", "indore"],
    keywords: ["loan in Ahmedabad", "personal loan Ahmedabad", "home loan Ahmedabad", "business loan Ahmedabad", "loan against property Ahmedabad", "loan DSA Ahmedabad", "loan agent Ahmedabad"],
    faqs: [
      { question: "Can a trading business with low reported profit get a loan in Ahmedabad?", answer: "Often yes. Several lenders run banking and GST-based programmes that assess repayment capacity from turnover and bank balances rather than ITR profit. Loans against property with surrogate-income assessment are another strong option." },
      { question: "Are industrial properties eligible for loan against property?", answer: "Yes. Many lenders finance industrial sheds and units in GIDC estates such as Vatva, Naroda and Sanand, typically at 50% to 60% loan-to-value with clear title and NA or GIDC allotment documents." },
      { question: "Do you cover Gandhinagar and GIFT City?", answer: "Yes. Our Ahmedabad desk serves Ahmedabad, Gandhinagar, GIFT City, Sanand and the surrounding industrial estates." },
    ],
    updatedAt: "2026-09-01",
  },
];
