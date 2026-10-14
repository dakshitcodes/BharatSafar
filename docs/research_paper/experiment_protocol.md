# BharatVerse Empirical Research Experiment Protocol

**Project**: Academic Minor Project & Research Paper  
**Topic**: Seasonal and Disruption-Aware Recommendation vs Popularity Baselines  
**Corpus**: BharatVerse / BharatSafar Recommender System (`Method A`, `Method B`, `Method C`)

---

## 1. Experimental Objectives

The purpose of this protocol is to evaluate three ranking implementations on a provisional, manually assembled benchmark. The current repository does not contain enough item-level source evidence to call the environmental or disruption inputs verified.

### Hypotheses:
- **$H_1$ (Eligibility behavior)**: Method C excludes destinations marked with an absolute closure in the supplied disruption records from its actionable ranking.
- **$H_2$ (Ranking accuracy)**: Compare NDCG@K for each method against the provisional single-annotator labels; no superiority is assumed in advance.
- **$H_3$ (Seasonal-only limitation)**: Examine whether Method B ranks destinations flagged by supplied disruption records; findings are conditional on those records.

---

## 2. Benchmark Dataset Specification

### 2.1 Destinations ($\mathcal{D}$)
The evaluation set contains 9 destinations across 2 activity categories. Destination identity and the monthly numeric/qualitative values have not yet been independently audited against record-level sources:
- **Waterfalls (5)**:
  1. *Dudhsagar Falls* (`dest-wf-01`, Goa / Western Ghats)
  2. *Jog Falls* (`dest-wf-02`, Karnataka / Shivamogga)
  3. *Athirappilly Falls* (`dest-wf-03`, Kerala / Thrissur)
  4. *Nohkalikai Falls* (`dest-wf-04`, Meghalaya / Cherrapunji)
  5. *Hogenakkal Falls* (`dest-wf-05`, Tamil Nadu / Dharmapuri)
- **Trekking (4)**:
  6. *Kedarkantha Trek* (`dest-trk-01`, Uttarakhand / Sankri)
  7. *Valley of Flowers Trek* (`dest-trk-02`, Uttarakhand / Chamoli)
  8. *Triund Trek* (`dest-trk-03`, Himachal Pradesh / Dharamshala)
  9. *Chembra Peak Trek* (`dest-trk-04`, Kerala / Wayanad)

### 2.2 Data provenance status
The JS runtime datasets include broad source names and some landing-page URLs, but most entries lack a specific document/page citation, a captured evidence record, and field-level links. The JSON copies now match the JS data; the Python evaluator remains a separate, unreconciled implementation. Monthly scenic indices and review counts/normalized popularity scores have no auditable underlying records. Disruption records marked `unverified` are surfaced as unknown and do not affect Method C scores; their order-reference strings are not evidence. See `data_audit.md` for the required evidence fields and current limitations. Do not describe these inputs as verified until that audit is complete.

---

## 3. Provisional Ground-Truth Rubric (Single Annotator)

Each $(destination, month, activity)$ tuple was graded by one project annotator on an ordinal scale $g \in \{0, 1, 2, 3\}$. There is no independent review or inter-rater agreement result. These labels are provisional and should not be described as expert-validated:

| Grade | Label | Operational Definition & Criteria | Relevance Threshold |
|---|---|---|---|
| **3** | Optimal (Prime) | Peak seasonal state. Trail/curtain marked open in the provisional inputs, pleasant climate, vibrant conditions. | Relevant ($\ge 2$) |
| **2** | Good (Recommended) | Suitable for visitation with minor seasonal compromises (e.g., lower water volume, light rain). | Relevant ($\ge 2$) |
| **1** | Marginal / Poor | Substantially degraded core experience (e.g., waterfall reduced to dry trickle on bare stone, 0% visibility fog, night camping prohibited). | Non-Relevant ($< 2$) |
| **0** | Unsuitable / Closed | Official legal closure by Forest Dept or police, life-safety hazard, avalanche risk, or lethal flash floods. | Non-Relevant ($< 2$) |

---

## 4. Evaluation Metrics Formulation

1. **Precision@K (P@K)**:
   $$P@K = \frac{1}{K} \sum_{i=1}^K \mathbb{I}(g(R_i, m) \ge 2)$$

2. **Discounted Cumulative Gain (DCG@K)**:
   $$DCG@K = \sum_{i=1}^K \frac{2^{g(R_i, m)} - 1}{\log_2(i + 1)}$$

3. **Ideal DCG@K (IDCG@K)**:
   $$IDCG@K = \text{DCG@K of candidates sorted by true grade } g(d, m) \text{ descending}$$

4. **Normalized Discounted Cumulative Gain (NDCG@K)**:
   $$NDCG@K = \frac{DCG@K}{IDCG@K}$$

5. **Observed Closure-Conflict Rate (CCR@K)**:
   $$CCR@K = \frac{1}{K_{eff}} \sum_{i=1}^{K_{eff}} \mathbb{I}(R_i \text{ matches an absolute-closure record in month } m)$$

CCR is estimable only when the scenario has at least one current, evidence-backed full-closure record relevant to its candidate pool. Otherwise it is N/A with a reason code; N/A is not zero conflict and does not establish open or safe conditions. Under the supplied policy, verified closures are quarantined from Method C actionable recommendations.

## 5. Current reproducibility snapshot

The current Node benchmark produces 36 scenarios: 24 category-specific scenarios and 12 mixed-pool scenarios. Requested K is 3 for category-specific scenarios and 5 for mixed-pool scenarios. The all-scenario macro-average NDCG@K is 0.6143 (A), 0.9776 (B), and 0.9776 (C); Method B and C tie. Category-specific NDCG@3 is 0.6483 (A), 0.9789 (B), and 0.9789 (C). The current dataset has zero evidence-backed disruption records. Closure-conflict rates are therefore not estimable (N/A), not zero. Method C and B are identical on the supplied benchmark because no disruption qualifies for application. These are descriptive results on provisional labels and supplied inputs, not confirmatory evidence. Since relevance criteria use seasonal conditions consumed by the rankers, these results may measure agreement with the annotation rubric rather than user preference or independently observed outcomes. The development/holdout month split is not a substitute for independent label validation, and the current benchmark does not document a tuning process that would justify an inferential holdout claim.

---

## 6. Reproducibility Instructions

### Via Command-Line Interface (CLI):
```bash
# In project root:
npm run test:research
# or
node scripts/run_research_benchmark.js
```
The script will compute metrics across all 36 scenarios, print formatted summary tables, and export:
- `src/research/output/benchmark_results.csv`
- `src/research/output/ieee_table.tex`
- `src/research/output/benchmark_summary.json`

### Via Interactive Web Interface:
1. Start development server: `npm run dev`
2. Navigate to **Research Lab** via header or floating button.
3. Switch months, activities, and $K$ values to observe live factor decompositions and real-time metric updates.
