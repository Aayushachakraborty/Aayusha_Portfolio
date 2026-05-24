/**
 * Mock data layer.
 *
 * Designed for demo reliability: pre-canned answers for common questions
 * about LTV caps, KYC, co-lending, NPA classification. Any other input
 * gets a generic-but-plausible response so the UI never breaks during demos.
 */

const CHUNKS = {
  a3f1d92b8c04: {
    chunk_id: 'a3f1d92b8c04',
    doc_title: 'RBI Master Direction · Housing Finance',
    page: 14,
    text: 'For individual housing loans, the Loan-to-Value (LTV) ratio shall not exceed: 90% for loans up to ₹30 lakh; 80% for loans of ₹30–75 lakh; 75% for loans above ₹75 lakh. These limits exclude stamp duty, registration and other documentation charges, which may be added to the cost of the house/dwelling unit for the purpose of calculating the LTV ratio.',
    score: 0.91,
  },
  b91a72d4e5c6: {
    chunk_id: 'b91a72d4e5c6',
    doc_title: 'Internal Credit Policy · §3.2 Retail Mortgage',
    page: null,
    text: 'The bank applies a credit overlay on RBI minimums for retail mortgage products. Loans in the ₹30–75 lakh bracket require a minimum CIBIL score of 720 in addition to the 80% LTV cap. Loans above ₹75 lakh require a minimum CIBIL of 750. Deviations beyond two notches require Credit Committee approval per the deviation matrix.',
    score: 0.84,
  },
  '7e2c84a19f3d': {
    chunk_id: '7e2c84a19f3d',
    doc_title: 'RBI Master Direction · Housing Finance',
    page: 16,
    text: 'Risk weights for housing loans are linked to both LTV and ticket size. For loans above ₹75 lakh, the higher of the bracket-specific risk weight applies regardless of LTV. Banks shall maintain capital adequacy on a continuing basis taking into account these prescribed risk weights.',
    score: 0.79,
  },
  c4d8e2a91b50: {
    chunk_id: 'c4d8e2a91b50',
    doc_title: 'RBI Master Direction · KYC',
    page: 8,
    text: 'For Customer Due Diligence in respect of an individual customer, the Regulated Entity shall obtain one Officially Valid Document (OVD) containing details of identity and address. OVDs include passport, driving licence, proof of possession of Aadhaar, Voter ID, NREGA job card, and letter issued by the National Population Register.',
    score: 0.88,
  },
  d7f12a3c91e8: {
    chunk_id: 'd7f12a3c91e8',
    doc_title: 'RBI Master Direction · Co-Lending',
    page: 5,
    text: 'Co-lending Model (CLM) is permitted between banks and NBFCs for priority sector loans. The bank shall mandatorily take its share of individual loans on a back-to-back basis on its books, with a minimum 20% retention. The NBFC retains the balance, and both parties bear credit risk in proportion to their share.',
    score: 0.86,
  },
  e2a91b50f7d2: {
    chunk_id: 'e2a91b50f7d2',
    doc_title: 'Internal Credit Policy · §5.1 Partnerships',
    page: null,
    text: "Co-lending partnerships require pre-approval from the Bank's Co-Lending Committee. Partner NBFCs must meet minimum credit rating of A from at least two recognised agencies, demonstrate three years of profitable operations, and accept the bank's underwriting standards as the floor.",
    score: 0.81,
  },
  f3a8d92b71c4: {
    chunk_id: 'f3a8d92b71c4',
    doc_title: 'RBI Master Direction · Income Recognition & Asset Classification',
    page: 12,
    text: 'A loan shall be classified as a Non-Performing Asset (NPA) where interest and/or instalment of principal remains overdue for a period of more than 90 days. Sub-classification: substandard for up to 12 months from NPA date, doubtful thereafter up to 3 years, and loss thereafter or where the bank/auditors identify the asset as such.',
    score: 0.92,
  },
};

const SCRIPT = [
  {
    match: /ltv|loan[\s-]?to[\s-]?value|housing loan|home loan/i,
    response: {
      answer:
        "For housing loans up to ₹30 lakh, the LTV ratio cap is 90% of the property value <cite>a3f1d92b8c04</cite>. For loans above ₹75 lakh, the cap tightens to 75% <cite>a3f1d92b8c04</cite><cite>7e2c84a19f3d</cite>. The internal policy adds that loans in the ₹30–75 lakh bracket are capped at 80%, subject to a minimum CIBIL score of 720 <cite>b91a72d4e5c6</cite>.",
      citation_ids: ['a3f1d92b8c04', 'b91a72d4e5c6', '7e2c84a19f3d'],
      confidence: 0.87,
      latency_ms: 1740,
    },
  },
  {
    match: /kyc|know your customer|ovd|officially valid/i,
    response: {
      answer:
        "Customer Due Diligence for individual customers requires obtaining one Officially Valid Document containing both identity and address details <cite>c4d8e2a91b50</cite>. Accepted OVDs include passport, driving licence, proof of possession of Aadhaar, Voter ID, NREGA job card, and the NPR letter <cite>c4d8e2a91b50</cite>.",
      citation_ids: ['c4d8e2a91b50'],
      confidence: 0.84,
      latency_ms: 1520,
    },
  },
  {
    match: /co[\s-]?lending|clm|nbfc partner/i,
    response: {
      answer:
        "The Co-Lending Model is permitted between banks and NBFCs for priority sector loans <cite>d7f12a3c91e8</cite>. The bank must take its share on a back-to-back basis with a minimum 20% retention; both parties bear credit risk proportional to share <cite>d7f12a3c91e8</cite>. Internal policy further requires partner NBFCs to hold a minimum rating of A from two agencies and three years of profitable operations <cite>e2a91b50f7d2</cite>.",
      citation_ids: ['d7f12a3c91e8', 'e2a91b50f7d2'],
      confidence: 0.81,
      latency_ms: 1880,
    },
  },
  {
    match: /npa|non[\s-]?performing|overdue|asset classification/i,
    response: {
      answer:
        "A loan is classified as a Non-Performing Asset when interest or instalment principal remains overdue for more than 90 days <cite>f3a8d92b71c4</cite>. Sub-classification proceeds as substandard for up to 12 months from the NPA date, doubtful thereafter up to 3 years, and loss thereafter or when identified as such by the bank or auditors <cite>f3a8d92b71c4</cite>.",
      citation_ids: ['f3a8d92b71c4'],
      confidence: 0.91,
      latency_ms: 1410,
    },
  },
];

const DEFAULT_RESPONSE = {
  answer:
    "I can find some relevant context but the documents don't contain a precise answer to this question. Closest references are shown below; consider rephrasing with specific regulation or product names for a more grounded answer.",
  citation_ids: ['c4d8e2a91b50', 'd7f12a3c91e8'],
  confidence: 0.42,
  latency_ms: 1620,
};

export function mockAsk(question) {
  const hit = SCRIPT.find((s) => s.match.test(question));
  const r = hit ? hit.response : DEFAULT_RESPONSE;

  // The retrieved set always returns 5 chunks; cited ones are a subset.
  const allChunkIds = Object.keys(CHUNKS);
  const cited = new Set(r.citation_ids);
  const others = allChunkIds.filter((id) => !cited.has(id));
  const retrieved = [
    ...r.citation_ids.map((id) => CHUNKS[id]),
    ...others.slice(0, Math.max(0, 5 - r.citation_ids.length)).map((id) => CHUNKS[id]),
  ];

  return {
    question,
    answer: r.answer,
    citations: retrieved,
    confidence: r.confidence,
    latency_ms: r.latency_ms,
    blocked: false,
  };
}

// ---- Credit decisions --------------------------------------------------------

export function mockSampleApplicants() {
  return [
    {
      label: 'Approve',
      profile: {
        AMT_INCOME_TOTAL: 480000,
        AMT_CREDIT: 1200000,
        AMT_ANNUITY: 38400,
        AMT_GOODS_PRICE: 1100000,
        DAYS_BIRTH: -12775,
        DAYS_EMPLOYED: -2920,
        CNT_FAM_MEMBERS: 3,
        CNT_CHILDREN: 1,
        EXT_SOURCE_1: 0.68,
        EXT_SOURCE_2: 0.72,
        EXT_SOURCE_3: 0.61,
        REGION_POPULATION_RELATIVE: 0.025,
        DAYS_REGISTRATION: -4200,
        FLAG_OWN_CAR: 1,
        FLAG_OWN_REALTY: 1,
      },
    },
    {
      label: 'Review',
      profile: {
        AMT_INCOME_TOTAL: 220000,
        AMT_CREDIT: 950000,
        AMT_ANNUITY: 41800,
        AMT_GOODS_PRICE: 900000,
        DAYS_BIRTH: -9800,
        DAYS_EMPLOYED: -460,
        CNT_FAM_MEMBERS: 4,
        CNT_CHILDREN: 2,
        EXT_SOURCE_1: 0.42,
        EXT_SOURCE_2: 0.51,
        EXT_SOURCE_3: 0.38,
        REGION_POPULATION_RELATIVE: 0.018,
        DAYS_REGISTRATION: -1800,
        FLAG_OWN_CAR: 0,
        FLAG_OWN_REALTY: 0,
      },
    },
    {
      label: 'Reject',
      profile: {
        AMT_INCOME_TOTAL: 150000,
        AMT_CREDIT: 1100000,
        AMT_ANNUITY: 52800,
        AMT_GOODS_PRICE: 1050000,
        DAYS_BIRTH: -8200,
        DAYS_EMPLOYED: -180,
        CNT_FAM_MEMBERS: 5,
        CNT_CHILDREN: 3,
        EXT_SOURCE_1: 0.18,
        EXT_SOURCE_2: 0.22,
        EXT_SOURCE_3: 0.14,
        REGION_POPULATION_RELATIVE: 0.012,
        DAYS_REGISTRATION: -800,
        FLAG_OWN_CAR: 0,
        FLAG_OWN_REALTY: 0,
      },
    },
  ];
}

export function mockDecide(applicant) {
  // Toy logic that mimics what the real XGBoost would do — heavily driven by EXT_SOURCE scores.
  const ext = (applicant.EXT_SOURCE_1 + applicant.EXT_SOURCE_2 + applicant.EXT_SOURCE_3) / 3;
  const employmentStability = Math.min(1, Math.abs(applicant.DAYS_EMPLOYED) / 3000);
  const debtBurden = applicant.AMT_ANNUITY / applicant.AMT_INCOME_TOTAL;

  // Synthetic probability of default
  let prob = 0.6 - ext * 0.55 - employmentStability * 0.12 + debtBurden * 0.4;
  prob = Math.max(0.03, Math.min(0.92, prob));

  let decision, threshold;
  if (prob < 0.3) {
    decision = 'APPROVED';
    threshold = 0.3;
  } else if (prob > 0.6) {
    decision = 'REJECTED';
    threshold = 0.6;
  } else {
    decision = 'REVIEW';
    threshold = 0.6;
  }

  const factors = [
    {
      feature: 'EXT_SOURCE_2',
      value: applicant.EXT_SOURCE_2,
      shap_value: (0.5 - applicant.EXT_SOURCE_2) * 0.9,
    },
    {
      feature: 'EXT_SOURCE_1',
      value: applicant.EXT_SOURCE_1,
      shap_value: (0.5 - applicant.EXT_SOURCE_1) * 0.7,
    },
    {
      feature: 'EXT_SOURCE_3',
      value: applicant.EXT_SOURCE_3,
      shap_value: (0.5 - applicant.EXT_SOURCE_3) * 0.6,
    },
    {
      feature: 'DAYS_EMPLOYED',
      value: applicant.DAYS_EMPLOYED,
      shap_value: -employmentStability * 0.35,
    },
    {
      feature: 'AMT_CREDIT',
      value: applicant.AMT_CREDIT,
      shap_value: debtBurden > 0.15 ? 0.18 : -0.05,
    },
    {
      feature: 'CNT_FAM_MEMBERS',
      value: applicant.CNT_FAM_MEMBERS,
      shap_value: applicant.CNT_FAM_MEMBERS > 3 ? 0.09 : -0.04,
    },
  ];
  factors.sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

  const explanations = {
    APPROVED:
      "We've approved your home loan application. Your strong external credit history and steady employment record were the two biggest factors in your favour, comfortably outweighing the size of the loan relative to income. We'll be in touch within 48 hours with the sanction letter.",
    REVIEW:
      "Your application is being reviewed manually because the model's confidence falls in our review band. The biggest concern is your relatively short employment history at the current employer alongside a moderate external credit score. A senior credit officer will reach out within 3 business days; providing 2 additional years of bank statements can help.",
    REJECTED:
      "Unfortunately we are unable to approve your application at this time. The two biggest factors were your external credit scores being below our acceptance threshold and a high requested loan amount relative to your income. Improving your CIBIL score and reducing the requested loan amount would strengthen a future application.",
  };

  return {
    probability: prob,
    decision,
    threshold,
    top_factors: factors.slice(0, 5).map((f) => ({
      ...f,
      direction: f.shap_value > 0 ? 'increased risk' : 'decreased risk',
    })),
    explanation: explanations[decision],
  };
}

// ---- Evals -------------------------------------------------------------------

export function mockEvals() {
  return {
    last_run: '2026-05-18T14:23:00+05:30',
    n_test_cases: 25,
    metrics: {
      faithfulness: 0.87,
      context_precision: 0.83,
      answer_relevancy: 0.89,
    },
    deltas: {
      faithfulness: 0.04,
      context_precision: 0.02,
      answer_relevancy: 0.01,
    },
    history: [
      { run: 'v1', faithfulness: 0.76, context_precision: 0.74, answer_relevancy: 0.78 },
      { run: 'v2', faithfulness: 0.83, context_precision: 0.81, answer_relevancy: 0.88 },
      { run: 'v3', faithfulness: 0.87, context_precision: 0.83, answer_relevancy: 0.89 },
    ],
    test_cases: [
      {
        question: 'What is the LTV cap for housing loans up to ₹30 lakh?',
        scores: { f: 0.95, cp: 0.91, ar: 0.93 },
      },
      {
        question: 'Can NBFCs participate in co-lending with private banks?',
        scores: { f: 0.88, cp: 0.84, ar: 0.91 },
      },
      {
        question: 'What KYC documents are accepted for opening a credit card?',
        scores: { f: 0.92, cp: 0.86, ar: 0.94 },
      },
      {
        question: 'How is NPA classified for a personal loan with 95 days overdue?',
        scores: { f: 0.61, cp: 0.75, ar: 0.68 },
      },
      {
        question: 'What is the deviation matrix for credit policy exceptions?',
        scores: { f: 0.84, cp: 0.79, ar: 0.86 },
      },
      {
        question: 'Priority sector lending targets for foreign banks?',
        scores: { f: 0.90, cp: 0.85, ar: 0.92 },
      },
      {
        question: 'Fair Practices Code disclosure requirements?',
        scores: { f: 0.86, cp: 0.82, ar: 0.88 },
      },
    ],
  };
}
