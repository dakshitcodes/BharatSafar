# Evaluating Seasonal and Disruption-Aware Ranking for Sustainable Nature and Heritage Tourism Recommendation

**Authors**: BharatVerse Research Group  
**Affiliation**: Department of Computer Science & Engineering  
**Academic Context**: Final Year Academic Minor / Capstone Project  
**Target Format**: IEEE Conference Template (`IEEEtran`)

---

## Abstract

This prototype examines a limitation of static popularity ranking: it does not account for month-specific conditions or supplied disruption records, so its ordering can remain unchanged across the calendar.

This prototype study compares popularity ranking, seasonal scoring, and disruption-aware ranking on a 36-scenario benchmark covering nine Indian waterfall and trekking destinations. The destination-month inputs and relevance grades are provisional: one project annotator assigned Grades 0–3, independent review has not occurred, and complete record-level provenance is still pending (see `data_audit.md`).

We systematically evaluate three algorithms:
1. **Method A**: Popularity-Based Baseline,
2. **Method B**: Seasonal Multi-Factor Environmental Scoring, and
3. **Method C (Proposed)**: Disruption-Aware Seasonal Ranking with evidence-gated disruption handling.

In the regenerated benchmark, overall macro-average NDCG@K is **0.6143** for Method A, **0.9776** for Method B, and **0.9776** for Method C. Category-specific NDCG@3 is **0.6483**, **0.9789**, and **0.9789**, respectively. The dataset currently has zero evidence-backed disruption records, so full-closure conflict rates are **not estimable**; they must not be reported as zero. Method B and Method C consequently produce the same scores on this benchmark. These are descriptive results over provisional inputs, not evidence of real-world safety or generalization.

The implementation is integrated as an interactive module within the BharatSafar cultural discovery platform. Source traceability and independent relevance-label review remain outstanding prerequisites for stronger empirical claims.

**Keywords**—Tourism Recommendation Systems, Context-Aware Recommenders, Seasonal Travel Planning, Explainable AI, Safety Invariants, Ranking Evaluation, NDCG.

---

## I. Introduction

Tourism recommendation systems (TRSs) play an increasingly vital role in steering tourist dispersion, economic livelihood, and cultural engagement [1]. With the rapid growth of algorithmic travel aggregators, users increasingly trust automated engines to recommend sightseeing destinations, hiking trails, and heritage landmarks. However, modern commercial TRSs are almost ubiquitously optimized for engagement metrics, historical popularity, and collaborative filtering patterns [2].

While popularity-based heuristics succeed in static urban contexts (e.g., museums, city monuments), they introduce catastrophic hazards when applied to nature, adventure, and seasonal heritage tourism. In countries with extreme seasonal transitions such as India—governed by intense Southwest and Northeast monsoons, severe Himalayan winters, and blistering pre-monsoon heat waves—a destination’s appeal and safety are intrinsically time-dependent. 

### A. Problem Statement & Motivation
Consider two scenarios encoded in the supplied benchmark inputs (the disruption records are unverified):
1. **A supplied winter-closure scenario**: In the benchmark inputs, Valley of Flowers has a high popularity score and an absolute-closure record for November through May. That record is unverified in the repository, so this example illustrates the algorithm's response to an input record rather than independently established access conditions.
2. **A supplied monsoon restriction scenario**: The dataset marks Dudhsagar with an absolute-closure record in July and August. That record is marked unverified, so the benchmark does not establish the notice, its scope, or current access conditions.

We define this systematic failure as **Popularity Inertia**: *the tendency of review-weighted recommenders to push high-volume destinations into top recommendation slots irrespective of transient or seasonal unviability.*

### B. Research Questions
To systematically investigate this phenomenon, we formulate three core Research Questions:
- **RQ1 (Baseline Vulnerability)**: To what extent does static popularity-based ranking recommend unviable or legally closed destinations across seasonal variations in nature tourism?
- **RQ2 (Environmental Suitability)**: How do the methods compare in NDCG on the provisional benchmark labels?
- **RQ3 (Disruption-Aware Ranking)**: Does Method C exclude items matching absolute-closure records supplied to the benchmark, and what ranking metrics result?

---

## II. Related Work

### A. Tourism Recommender Systems (TRSs)
Early TRSs categorized points of interest (POIs) using collaborative filtering (CF) and matrix factorization [3]. While CF captures latent user preferences, it notoriously suffers from cold-start problems and popularity bias, disproportionately favoring hyper-frequent items [4]. In tourism, popularity bias is not merely a diversity issue; it is a direct driver of overtourism, environmental strain, and traveler dissatisfaction.

### B. Context-Aware Recommender Systems (CARS)
Context-Aware Recommender Systems incorporate contextual variables such as time, location, companion type, and weather [5], [6]. Baltrunas et al. explored weather-aware mobile recommendations, demonstrating that rain significantly alters dining and indoor museum preferences [7]. However, prior context-aware tourism models typically treat weather as a continuous soft preference penalty (e.g., reducing likelihood of outdoor dining when raining) rather than treating official warnings and legal closures as hard safety invariants.

### C. Safety and Disruption in Travel Systems
Recent transportation literature models disruptions in flight networks and urban transit [8]. Yet, in decentralized nature and heritage tourism, administrative closures (issued by district disaster authorities, forest departments, and railways) remain siloed in administrative gazettes and news bulletins. TRSs have historically lacked a decoupled, auditable verification layer that can override recommendation algorithms.

---

## III. Benchmark Dataset & Ground Truth Methodology

We designed a prototype dataset spanning 9 destinations across two nature tourism categories in India: **Waterfalls** and **Trekking**. Provenance is incomplete; see `data_audit.md`.

### A. Destination Selection Criteria
Destinations were selected based on three criteria:
1. Destinations are represented in the project dataset and span two activity categories.
2. The supplied popularity fields vary across destinations; their external sources remain unaudited.
3. **Severe Seasonal Dynamics**: Pronounced contrasts between peak viability, extreme monsoons, or winter closures.

| ID | Name | Category | State / Region | Elevation | Popularity | Regulatory Authority |
|---|---|---|---|---|---|---|
| `dest-wf-01` | Dudhsagar Falls | Waterfalls | Goa / Western Ghats | 310 m | 0.94 (18.4k reviews) | Goa Forest Dept / SWR |
| `dest-wf-02` | Jog Falls | Waterfalls | Karnataka (Shivamogga) | 464 m | 0.92 (16.2k reviews) | Jog Management Authority |
| `dest-wf-03` | Athirappilly Falls | Waterfalls | Kerala (Thrissur) | 120 m | 0.88 (14.1k reviews) | Kerala Forest Dept / KSDMA |
| `dest-wf-04` | Nohkalikai Falls | Waterfalls | Meghalaya (Cherrapunji) | 1250 m | 0.86 (11.9k reviews) | Meghalaya Tourism / MTDC |
| `dest-wf-05` | Hogenakkal Falls | Waterfalls | Tamil Nadu (Dharmapuri) | 230 m | 0.82 (10.5k reviews) | Dharmapuri District Admin |
| `dest-trk-01` | Kedarkantha Trek | Trekking | Uttarakhand (Sankri) | 3810 m | 0.90 (15.3k reviews) | Uttarakhand Forest Dept / SDRF |
| `dest-trk-02` | Valley of Flowers | Trekking | Uttarakhand (Chamoli) | 3658 m | 0.95 (21.4k reviews) | Nanda Devi Biosphere Directorate |
| `dest-trk-03` | Triund Trek | Trekking | Himachal (Dharamshala) | 2828 m | 0.91 (17.8k reviews) | Kangra Police / HP Forest Dept |
| `dest-trk-04` | Chembra Peak | Trekking | Kerala (Wayanad) | 2100 m | 0.85 (12.4k reviews) | South Wayanad FDA (VSS) |

### B. Monthly Environmental & Operational Data
For each destination $d$ and month $m$, the prototype stores:
- **Average Temperature ($T_{d,m}$ in °C)** and **Monthly Precipitation ($P_{d,m}$ in mm)**, attributed in the data fields to IMD climatological normals; station mapping and extraction evidence are not documented.
- **Hydrological / Snowpack Indicators**: Flow status for waterfalls (`Extreme Torrent`, `Robust`, `Moderate`, `Dry Trickle`) and trail status for trekking (`Powder Snow`, `Clear Alpine`, `Flooded Mud`, `Buried Avalanche Zone`).
- **Scenic / Viability Index ($S_{\text{scenic}}(d,m) \in [0, 1]$)**.

### C. Supplied Disruption Records
The supplied disruption records use the following categories. Most have not been verified against an order or advisory document:
1. `OFFICIAL_CLOSURE` (Critical): Legal prohibition or fatal hazard. Complete public entry barred ($Multiplier = 0.0$).
2. `ACTIVITY_BAN` (High): Core tourist activity suspended (e.g., coracle boating ban at Hogenakkal, night camping ban atop Triund) ($Multiplier = 0.35 - 0.40$).
3. `HAZARD_WARNING` (High): Severe active warning (e.g., monsoon cloudburst landslide risk along Sankri highway) ($Multiplier = 0.30$).
4. `SAFETY_WARNING` (Medium/Low): Partial restrictions (e.g., stair gorge closure at Jog Falls, dense zero-visibility fog advisory at Nohkalikai) ($Multiplier = 0.50 - 0.70$).

### D. Ground Truth Relevance Rubric
Provisional relevance labels $g(d, m) \in \{0, 1, 2, 3\}$ were assigned by one project annotator using a written rubric. The labels have not been independently reviewed, and the repository does not contain supporting evidence for every destination-month rationale:
- **Grade 3 (Optimal)**: Peak seasonal condition marked open in the provisional inputs, with optimal hydrological/trail status and pleasant climate.
- **Grade 2 (Good)**: Safe, enjoyable visitation with minor compromises (e.g., slight pre-monsoon flow reduction, light rain requiring poncho).
- **Grade 1 (Marginal / Poor)**: Substantially degraded experience (e.g., waterfall reduced to a thin dry trickle on bare rock, dense fog with 0% visibility, night camping banned).
- **Grade 0 (Unsuitable / Hazardous / Closed)**: Official administrative ban, life-safety hazard, avalanche risk, or lethal flash floods.

---

## IV. Recommendation Algorithms

We formulate and implement three distinct recommendation methods over the identical candidate set $\mathcal{D}_a$ for a given activity category $a$ and query month $m$.

### A. Method A: Popularity-Based Baseline
Method A mirrors commercial aggregators by ranking solely on historical normalized popularity $Pop(d) \in [0, 1]$:

$$S_A(d) = Pop(d)$$

The ranking is completely time-invariant across all 12 months.

### B. Method B: Seasonal Multi-Factor Scoring
Method B calculates an environmental fitness score combining weather comfort, scenic/flow viability, and popularity:

$$S_B(d, m, a) = w_1 \cdot S_{\text{scenic}}(d, m) + w_2 \cdot W(d, m, a) + w_3 \cdot Pop(d)$$

where $W=0.5 TempFit+0.5 RainFit$ for trekking and $W=0.4 TempFit+0.6 RainFit$ for waterfalls. The fit functions use the piecewise thresholds in the ranking engine. Design weights are $w_1=0.50$, $w_2=0.30$, and $w_3=0.20$; they are not empirically optimized.

### C. Method C: Disruption-Aware Seasonal Ranking (Proposed)
Method C applies only disruptions that pass the configured evidence, event-date, destination, month, scope, and activity checks. A qualifying full-destination closure is removed from the actionable list and retained in a separate quarantine list. Applicable partial restrictions multiply the seasonal score by their configured penalties; absent qualifying records, Method C returns the seasonal score. This is conditional algorithm behavior: unverified records do not establish that a destination is open or safe.

---

## V. Experimental Evaluation & Results

### A. Evaluation Protocol & Metrics
The benchmark contains 36 scenarios: 12 waterfall, 12 trekking, and 12 mixed-pool month scenarios. Single-activity scenarios request K=3 and mixed-pool scenarios request K=5. Precision@K divides relevant returned items by effective returned K. NDCG@K uses a common ideal ranking from the original scenario candidate pool; relevance metrics are undefined if any candidate label is missing or IDCG is zero. Eligible pools and exclusions are reported separately. Closure conflict is evaluated only against current, evidence-backed full-closure records and is N/A when the reference is not estimable.

### B. Empirical Results Summary

The regenerated descriptive results are summarized below. No full-closure rate is estimable because none of the supplied disruption records is evidence-backed.

| Evaluation Metric | Category-specific A | B | C | Mixed pool A | B | C | Overall A | B | C |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Precision@K | 0.6945 | 0.8611 | 0.8611 | 0.6667 | 0.9333 | 0.9333 | 0.6852 | 0.8852 | 0.8852 |
| NDCG@K | 0.6483 | 0.9789 | 0.9789 | 0.5462 | 0.9749 | 0.9749 | 0.6143 | 0.9776 | 0.9776 |
| Full-closure conflict | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A |

Category-specific columns aggregate 24 scenarios with K=3; mixed-pool columns aggregate 12 scenarios with K=5. Overall values aggregate all 36 scenarios and therefore use variable K. The month split is exploratory: the holdout selection rationale and independence from prior tuning are undocumented.

### C. Analysis of Results
Method B has a higher overall NDCG@K than Method A on the provisional labels (0.9776 vs. 0.6143). Method C ties Method B because zero of the supplied disruption records pass the current evidence policy. Thus, this run does not evaluate Method C under an active verified disruption and provides no empirical estimate of closure-conflict reduction.

---

## VI. Discussion & Limitations

The observed ranking differences are descriptive, conditional on supplied values and one annotator's provisional grades. Because the rubric uses the same seasonal conditions consumed by Methods B and C, the evaluation may reward agreement with the rubric's inputs rather than user preference or independently observed travel outcomes. The nine-destination corpus is too small to establish generalization. Monthly environmental, popularity, scenic, and disruption inputs lack complete record-level evidence. The 108 relevance labels have not received independent review or per-label supporting evidence. The chosen seasonal weights and disruption penalties are design choices, not empirically optimal parameters. The development/holdout month split is exploratory, not confirmatory.

## VII. Conclusion & Future Work

Across 36 scenarios, overall macro-average NDCG@K is 0.6143 for Method A and 0.9776 for Methods B and C. These numbers describe agreement with provisional labels only. No closure-conflict rate is estimable because there is no evidence-backed closure record in the current dataset. The benchmark therefore does not demonstrate real-world safety or disruption-aware effectiveness. Next steps are to complete source verification, obtain independent relevance judgments with adjudication, and evaluate against an evidence-backed disruption set using a predeclared protocol.

The ranking engine and Research Lab are integrated in BharatSafar. Further empirical or deployment claims should wait until those validation steps are complete.

---

## References

[1] D. Gavalas, C. Konstantopoulos, K. Mastakas, and G. Pantziou, "Mobile recommender systems in tourism," *Journal of Network and Computer Applications*, vol. 39, pp. 319–333, 2014.
[2] H. Werthner and F. Ricci, "E-commerce and tourism," *Communications of the ACM*, vol. 47, no. 12, pp. 101–105, 2004.
[3] Y. Koren, R. Bell, and C. Volinsky, "Matrix factorization techniques for recommender systems," *Computer*, vol. 42, no. 8, pp. 30–37, 2009.
[4] H. Abdollahpouri, R. Burke, and B. Mobasher, "Controlling popularity bias in learning-to-rank recommendation," in *Proc. 11th ACM Conf. Recommender Systems*, 2017, pp. 42–46.
[5] G. Adomavicius and A. Tuzhilin, "Context-aware recommender systems," in *Recommender Systems Handbook*, Springer, 2011, pp. 217–253.
[6] M. Braunhofer, M. Elahi, and F. Ricci, "Techniques for cold-starting context-aware mobile recommender systems for tourism," in *Int. Conf. on Intelligent Technologies for Interactive Entertainment*, 2014, pp. 106–115.
[7] L. Baltrunas, B. Ludwig, S. Peer, and F. Ricci, "Context relevance assessment and exploitation in mobile recommender systems," *Personal and Ubiquitous Computing*, vol. 16, no. 5, pp. 507–526, 2012.
[8] C. G. Chorus, T. A. Arentze, and H. J. Timmermans, "A review of recent advances in travel information search and choice," *Transport Reviews*, vol. 26, no. 4, pp. 487–509, 2006.
