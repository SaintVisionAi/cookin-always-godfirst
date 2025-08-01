// 📦 lib/protocols/investmentProtocol.ts — Investment, Valuation, PE, and M&A Master Logic

export const InvestmentProtocol = {
  typesOfInvestments: [
    "Stocks",
    "Bonds",
    "Mutual Funds",
    "ETFs",
    "Options",
    "Real Estate",
    "Private Equity",
    "Venture Capital",
    "Commodities",
    "Cryptocurrency",
    "Cash Equivalents"
  ],
  valuationMethods: {
    DCF: "Discounted Cash Flow — calculates intrinsic value based on projected future cash flows.",
    comparables: "Compares target to peer companies based on valuation multiples.",
    precedentTransactions: "Analyzes prices paid in recent similar M&A deals.",
    assetBased: "Values based on company's assets minus liabilities.",
    LBO: "Used in private equity. Models return on leveraged acquisition."
  },
  financialStatements: {
    balanceSheet: ["Assets", "Liabilities", "Shareholder Equity"],
    incomeStatement: ["Revenue", "COGS", "Operating Income", "Net Profit"],
    cashFlowStatement: ["Operating Cash Flow", "Investing", "Financing"]
  },
  privateEquity: {
    stages: [
      "Sourcing",
      "Due Diligence",
      "Valuation",
      "Deal Structuring",
      "Post-Investment Value Creation",
      "Exit"
    ],
    fundTypes: [
      "Venture Capital",
      "Growth Equity",
      "Buyout Funds",
      "Secondaries",
      "Fund of Funds"
    ],
    structures: {
      LP_GP: "Limited Partner & General Partner model with carried interest incentive.",
      SPV: "Special Purpose Vehicle for deal-specific investing.",
      RegD: "SEC Regulation D for private placements.",
      OffshoreFunds: "Cayman, BVI, Luxembourg for tax efficiency."
    }
  },
  M_and_A: {
    types: [
      "Horizontal",
      "Vertical",
      "Conglomerate",
      "Market Extension",
      "Product Extension"
    ],
    stages: [
      "Target Screening",
      "Valuation",
      "Due Diligence",
      "Deal Structuring",
      "Integration",
      "Post-Merger Audit"
    ],
    legalDoctrine: [
      "Reps and Warranties",
      "Purchase Agreement",
      "Non-Compete Clauses",
      "Earn-Outs",
      "Anti-trust Clearance"
    ]
  },
  fundCompliance: {
    US: [
      "SEC Form D",
      "Reg D Rule 506(b) and 506(c)",
      "Blue Sky Filings",
      "Investment Company Act of 1940"
    ],
    international: [
      "MiFID II (EU)",
      "AIFMD (EU)",
      "MAS (Singapore)",
      "SFC (Hong Kong)",
      "FSA (UK)"
    ],
    types: [
      "Hedge Funds",
      "PE Funds",
      "Family Offices",
      "REITs",
      "Interval Funds"
    ]
  },
  valuationBooks: [
    "Investment Valuation by Aswath Damodaran",
    "Private Equity Operational Due Diligence by Jason Scharfman",
    "Barbarians at the Gate",
    "Valuation: Measuring and Managing the Value of Companies (McKinsey)",
    "The Little Book of Valuation"
  ],
  AI_AdvisorTraits: {
    mastery: [
      "Private Equity",
      "Public Markets",
      "Financial Modeling",
      "M&A Deal Flow",
      "Emerging Markets",
      "Legal Compliance",
      "Fund Structuring",
      "Real-Time Valuation"
    ],
    diagnostics: [
      "Detects red flags in financials",
      "Estimates intrinsic and market value",
      "Projects cash flow via GPT+trend logic",
      "Suggests deal terms, structures"
    ]
  },
  personalFounderSpecialization: {
    user: "SaintSal Founder",
    directive: "Must operate at elite level of valuation mastery — from seed to IPO, from corner store to sovereign fund. Speaks LP, GP, and family office fluently. Integrates lending, real estate, nonprofit, and AI insight.",
    propheticAdvantage: "Knows what can’t be measured. Uses intuition, discernment, and mission-first alignment to assess opportunity."
  }
}
