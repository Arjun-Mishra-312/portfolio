/** Facts and trace interpretation from the public v2 preprint and its ancillary files. */
export const accessibilityPublication = {
  title: "Agentic Web Accessibility Auditing: A Criterion-Specific Framework for Translating WCAG Requirements into Assessments",
  shortTitle: "Accessibility audits that show their work.",
  authors: ["Arjun Mishra", "Pranav Karthik", "Byungjun Bae", "Dongwook Yoon"],
  status: "Public preprint · September 2026",
  authorship: "First author",
  submission: "Submitted to ACM CHI 2027",
  url: "https://arxiv.org/abs/2609.09379v2",
  pdf: "https://arxiv.org/pdf/2609.09379v2",
  traceUrl: "https://arxiv.org/src/2609.09379v2/anc/worked_trace.json",
  summary: "Each accessibility requirement gets an agent with tailored instructions. It inspects the page, operates controls, and records the evidence behind its assessment.",
  metrics: [
    { value: "86%", label: "Recall", detail: "67 of 78 reported positive cases" },
    { value: "56%", label: "Precision", detail: "A tradeoff that calls for human review" },
    { value: "250", label: "Records", detail: "Across 11 scholarly platforms" },
    { value: "40", label: "Requirements", detail: "WCAG requirements implemented" },
  ],
  limitation: "Results describe the evaluated dataset, not a guarantee for every website. Higher detection came with lower precision; the system supports human auditing.",
  trace: [
    { id: "requirement", label: "Requirement", title: "WCAG 1.1.1 · Non-text Content", body: "The public worked example examines text alternatives in an OpenStax snapshot.", code: "row: laa_000_1_1_1" },
    { id: "inspect", label: "Inspect", title: "Start with the rules. Then look closer.", body: "The initial selected-rule frame audit returned zero violations. The worker continued by querying image elements and extracting the DOM.", code: 'img:not([alt]), img[alt=""]' },
    { id: "evidence", label: "Evidence", title: "Collect context for the assessment.", body: "The trace records targeted element queries, DOM extraction, and a screenshot. Intermediate result payloads are not included in this public trace.", code: "a11y_query_elements → a11y_dom_extract → a11y_screenshot" },
    { id: "finding", label: "Finding", title: "A criterion-level positive result.", body: "The worker finished with a positive result and a High (Major) impact label. This agrees at the criterion level; individual image correctness was not independently adjudicated.", code: "DONE · result: true · impact: High (Major)" },
  ],
};

/** Submission status and authorship from Arjun's September 2026 resume. */
export const researchSubmissions = [
  { id: "agentic-auditing", title: "Agentic Web Accessibility Auditing", authorship: "First author", status: "Submitted to ACM CHI 2027", summary: "40 WCAG-specific agents, a shared 31-tool library, and inspectable evidence for accessibility assessments.", url: accessibilityPublication.url },
  { id: "wrap", title: "WRAP", authorship: "Second author", status: "Submitted to ACM CHI 2027", summary: "Optimizes WCAG task allocation across automated and human audit modalities.", url: null },
];
