# Preliminary benchmark analysis

**Status:** Exploratory analysis of provisional labels and unverified disruption data. This is not a final validated results report.

## Main comparison

Across 36 paired scenarios, macro-average NDCG@K was 0.6143 for A and 0.9776 for B and C. Since every scenario has defined relevance metrics, the rounded aggregate difference equals a paired mean difference of approximately **+0.3633 NDCG@K for B−A** and **0 for C−B**. B exceeds A in 30 scenarios, ties in 6, and is lower in none. K varies by pool (3 for single activities, 5 for mixed), so the overall figure is a macro-average across different cutoffs.

Across the 24 category-specific scenarios, NDCG@3 is 0.6483 (A) and 0.9789 (B and C). In all 36 scenarios, B and C return identical rankings. No Method C disruption effect is observed because the benchmark has zero evidence-backed records. Closure conflict is N/A for every aggregate: 16 scenario evaluations have no candidate-matching closure claim; 20 have claims without qualifying evidence.

## Examples from this run

- **July waterfalls (`waterfalls-m7`, K=3):** A and B both have NDCG@3=1.00 against the supplied labels; their top-three order differs, but all three listed items have grade 3. C matches B. The supplied Dudhsagar closure claim is unverified and does not enter ranking eligibility.
- **April waterfalls (`waterfalls-m4`, K=3):** A has NDCG@3=0.1845; B and C have 1.00. The supplied labels favor the B ordering. This example explains the metric difference only relative to those provisional labels; it does not establish real visitor preference or factual suitability.
- **February mixed pool (`all-m2`, K=5):** A has NDCG@5=0.3681; B and C have 0.9840. The supplied Valley of Flowers grade is 0 and it appears first under A. That label and winter-closure rationale need independent evidence review; do not interpret this as confirmed current closure behavior.

No scenario has B and C ranking differences, and Method A does not beat B on NDCG in this run. There are therefore no observed C-versus-B error cases or verified-closure cases to analyze.

## Sensitivity

| Seasonal weights (scenic/weather/popularity) | Mean top-K Jaccard vs. configured weights | Mean NDCG@K |
|---|---:|---:|
| 0.40 / 0.40 / 0.20 | 0.9398 | 0.9616 |
| 0.60 / 0.20 / 0.20 | 0.9861 | 0.9806 |
| 0.50 / 0.20 / 0.30 | 0.9722 | 0.9806 |

These alternatives are descriptive and were not selected as optimal. Partial-penalty sensitivity is not estimable: zero evidence-backed partial records are applicable, so all 36 scenarios are excluded from that comparison.

## Interpretation limit

The large B−A difference is alignment with the supplied grades, not a user study. The rubric uses seasonal properties also used by the ranking functions, so label/feature coupling may inflate agreement. The month split is exploratory, destinations and months are not independent samples, and no statistical significance claim is made.
