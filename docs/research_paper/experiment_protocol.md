# BharatVerse Empirical Research Experiment Protocol

**Project**: Academic Minor Project & Research Paper  
**Topic**: Seasonal and Disruption-Aware Recommendation vs Popularity Baselines  
**Corpus**: BharatVerse / BharatSafar Recommender System (`Method A`, `Method B`, `Method C`)

---

## 1. Experimental Objectives

The purpose of this experimental protocol is to evaluate whether integrating empirical seasonal environmental fitness and verified administrative disruption invariants improves tourism recommendation quality over popularity-based ranking.

### Hypotheses:
- **$H_1$ (Safety Guarantee)**: Method C achieves a 0.0% Closure-Conflict Rate across all test scenarios, whereas Method A and Method B produce non-zero closure conflicts.
- **$H_2$ (Ranking Accuracy)**: Method C yields statistically superior Normalized Discounted Cumulative Gain (NDCG@K) compared to Method A by preventing popularity bias from ranking unviable destinations.
- **$H_3$ (Environmental Fallacy)**: Method B alone is insufficient because high environmental flow during extreme monsoons or snow precipitation correlates with severe hazard orders.

---

## 2. Benchmark Dataset Specification

### 2.1 Destinations ($\mathcal{D}$)
The evaluation set contains 9 verified destinations across 2 activity categories:
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

### 2.2 Operational Data Sources
- **Climate Normals**: India Meteorological Department (IMD) 30-year climatological tables (monthly temperature and rainfall).
- **Popularity Data**: Normalized review frequency and ratings aggregated across major travel listings (10,500 to 21,400 reviews).
- **Disruption Records**: Official administrative orders issued by Forest Departments, District Disaster Management Authorities, and South Western Railway.

---

## 3. Written Ground-Truth Rubric (Independent Answer Key)

Each $(destination, month, activity)$ tuple is graded on an ordinal scale $g \in \{0, 1, 2, 3\}$:

| Grade | Label | Operational Definition & Criteria | Relevance Threshold |
|---|---|---|---|
| **3** | Optimal (Prime) | Peak seasonal state. Open trail/curtain, pleasant climate, vibrant conditions, verified permits. | Relevant ($\ge 2$) |
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

5. **Closure-Conflict Rate (CCR@K)**:
   $$CCR@K = \frac{1}{K} \sum_{i=1}^K \mathbb{I}(R_i \text{ has active verified closure in month } m)$$

---

## 5. Reproducibility Instructions

### Via Command-Line Interface (CLI):
```bash
# In project root:
npm run test:research
# or
node scripts/run_research_benchmark.js
```
The script will compute metrics across all 24 scenarios, print formatted summary tables, and export:
- `src/research/output/benchmark_results.csv`
- `src/research/output/ieee_table.tex`
- `src/research/output/benchmark_summary.json`

### Via Interactive Web Interface:
1. Start development server: `npm run dev`
2. Navigate to **Research Lab** via header or floating button.
3. Switch months, activities, and $K$ values to observe live factor decompositions and real-time metric updates.
