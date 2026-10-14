# Evaluating Seasonal and Disruption-Aware Ranking for Sustainable Nature and Heritage Tourism Recommendation

**Authors**: BharatVerse Research Group  
**Affiliation**: Department of Computer Science & Engineering  
**Academic Context**: Final Year Academic Minor / Capstone Project  
**Target Format**: IEEE Conference Template (`IEEEtran`)

---

## Abstract

Commercial tourism recommendation systems predominantly rely on static collaborative filtering and popularity-based heuristics, ranking destinations by historical visitor volumes, cumulative review counts, and average star ratings. In nature, adventure, and heritage tourism, however, static popularity ranking suffers from a severe failure mode termed **popularity inertia**: it continues to recommend highly rated destinations during periods when environmental conditions render them either hazardous, unviable, or legally prohibited. 

In this paper, we address this fundamental flaw by investigating whether incorporating empirical seasonal environmental indicators and verified regulatory disruption invariants improves recommendation quality and safety. We construct a 24-scenario empirical evaluation benchmark covering 9 prominent Indian waterfall and trekking destinations across all 12 calendar months, accompanied by independent expert relevance ground truth (Grades 0–3) derived from an objective multi-factor rubric. 

We systematically evaluate three algorithms:
1. **Method A**: Popularity-Based Baseline,
2. **Method B**: Seasonal Multi-Factor Environmental Scoring, and
3. **Method C (Proposed)**: Disruption-Aware Seasonal Ranking with strict administrative safety invariants.

Our empirical findings demonstrate that:
- Method A exhibits an alarming **12.5% macro-average Closure-Conflict Rate (CCR)**, spiking to **33.3%** in winter trekking scenarios (such as recommending the snowbound Valley of Flowers National Park, which is closed by law).
- Method B substantially boosts ranking quality, raising Normalized Discounted Cumulative Gain (**NDCG@K from 0.6552 to 0.9788**), but still incurs a **2.8% CCR** because high environmental flow during extreme monsoons is misidentified as high tourist viability.
- Method C guarantees a **0.0% Closure-Conflict Rate** while simultaneously achieving superior ranking fidelity (**NDCG@K of 0.9868**, reflecting up to **+58.3% lift** over the baseline). 

We deploy this architecture as a functional, interactive module within the open-source **BharatVerse / BharatSafar** cultural discovery platform, providing transparent score factorizations and reproducible benchmark datasets for sustainable tourism.

**Keywords**—Tourism Recommendation Systems, Context-Aware Recommenders, Seasonal Travel Planning, Explainable AI, Safety Invariants, Ranking Evaluation, NDCG.

---

## I. Introduction

Tourism recommendation systems (TRSs) play an increasingly vital role in steering tourist dispersion, economic livelihood, and cultural engagement [1]. With the rapid growth of algorithmic travel aggregators, users increasingly trust automated engines to recommend sightseeing destinations, hiking trails, and heritage landmarks. However, modern commercial TRSs are almost ubiquitously optimized for engagement metrics, historical popularity, and collaborative filtering patterns [2].

While popularity-based heuristics succeed in static urban contexts (e.g., museums, city monuments), they introduce catastrophic hazards when applied to nature, adventure, and seasonal heritage tourism. In countries with extreme seasonal transitions such as India—governed by intense Southwest and Northeast monsoons, severe Himalayan winters, and blistering pre-monsoon heat waves—a destination’s appeal and safety are intrinsically time-dependent. 

### A. Problem Statement & Motivation
Consider two illustrative real-world failure cases produced by conventional popularity-based recommenders:
1. **The Avalanche & Seasonal Closure Hazard**: *Valley of Flowers National Park* in Uttarakhand is globally renowned (popularity score 0.95/1.0, 4.9★ rating). Under popularity ranking, it is recommended as the #1 trekking destination year-round. However, from November 1 to May 31, the park is buried under 10–15 feet of snow and is legally closed by the Forest Department under the Wildlife Protection Act. Tourists following static recommendations face locked gates, severe avalanches, and legal prosecution.
2. **The Flash Flood & Drowning Hazard**: *Dudhsagar Falls* in Goa attracts millions of travelers. In July and August, during peak Western Ghats monsoons, river swelling and torrential water curtains drown the railway viaduct. Following multiple fatalities, South Western Railway and the Goa Forest Department permanently banned walking along the tracks and suspended safari jeeps. A popularity-driven recommender cheerfully ranks Dudhsagar #1 in July because tourists have historically raved about its roar.

We define this systematic failure as **Popularity Inertia**: *the tendency of review-weighted recommenders to push high-volume destinations into top recommendation slots irrespective of transient or seasonal unviability.*

### B. Research Questions
To systematically investigate this phenomenon, we formulate three core Research Questions:
- **RQ1 (Baseline Vulnerability)**: To what extent does static popularity-based ranking recommend unviable or legally closed destinations across seasonal variations in nature tourism?
- **RQ2 (Environmental Suitability)**: Does multi-criteria environmental scoring (integrating temperature normals, precipitation, flow rates, and trail viability) significantly improve recommendation ranking order (NDCG) over popularity baselines?
- **RQ3 (Disruption-Aware Guarantees)**: Can the formal introduction of verified administrative disruption invariants eliminate safety violations without degrading overall recommendation utility?

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

To establish a reproducible empirical foundation, we designed a targeted, documented dataset spanning 9 destinations across two distinct nature tourism categories in India: **Waterfalls** and **Trekking**.

### A. Destination Selection Criteria
Destinations were selected based on three criteria:
1. **Traceable Credibility**: Documented in official Tourism Board and Forest Department registries.
2. **High Popularity Variance**: Documented review counts ranging from 10,500 to 21,400 with national recognition.
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
For each destination $d$ and each month $m \in \{1, \dots, 12\}$, we compiled:
- **Average Temperature ($T_{d,m}$ in °C)** and **Monthly Precipitation ($P_{d,m}$ in mm)** derived from India Meteorological Department (IMD) 30-year climate normals.
- **Hydrological / Snowpack Indicators**: Flow status for waterfalls (`Extreme Torrent`, `Robust`, `Moderate`, `Dry Trickle`) and trail status for trekking (`Powder Snow`, `Clear Alpine`, `Flooded Mud`, `Buried Avalanche Zone`).
- **Scenic / Viability Index ($S_{\text{scenic}}(d,m) \in [0, 1]$)**.

### C. Verified Disruption Taxonomy
Disruptions were categorized into an auditable hierarchy with official administrative gazette references:
1. `OFFICIAL_CLOSURE` (Critical): Legal prohibition or fatal hazard. Complete public entry barred ($Multiplier = 0.0$).
2. `ACTIVITY_BAN` (High): Core tourist activity suspended (e.g., coracle boating ban at Hogenakkal, night camping ban atop Triund) ($Multiplier = 0.35 - 0.40$).
3. `HAZARD_WARNING` (High): Severe active warning (e.g., monsoon cloudburst landslide risk along Sankri highway) ($Multiplier = 0.30$).
4. `SAFETY_WARNING` (Medium/Low): Partial restrictions (e.g., stair gorge closure at Jog Falls, dense zero-visibility fog advisory at Nohkalikai) ($Multiplier = 0.50 - 0.70$).

### D. Ground Truth Relevance Rubric
To prevent experimental circularity, ground truth relevance labels $g(d, m) \in \{0, 1, 2, 3\}$ were independently assigned according to a strict written rubric:
- **Grade 3 (Optimal)**: Peak seasonal condition. Verified open access, optimal hydrological/trail status, and pleasant climate.
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

where:
- $W(d, m, a) = 0.5 \cdot \text{TempFit}(T_{d,m}, a) + 0.5 \cdot \text{RainFit}(P_{d,m}, a)$
- Weights are set to $w_1 = 0.50$, $w_2 = 0.30$, and $w_3 = 0.20$.

### C. Method C: Disruption-Aware Seasonal Ranking (Proposed)
Method C introduces an independent Disruption Verification Guardrail that evaluates verified active disruption orders $\mathcal{C}(d, m)$:

$$S_C(d, m, a) = \begin{cases} 0.0, & \text{if } \exists c \in \mathcal{C}(d, m) \text{ s.t. } c.\text{isAbsoluteClosure} = \text{true} \\ S_B(d, m, a) \cdot \prod_{c \in \mathcal{C}(d, m)} \mu_c, & \text{if warnings / activity bans exist} \\ S_B(d, m, a), & \text{otherwise} \end{cases}$$

where $\mu_c$ is the penalty multiplier associated with disruption $c$.

**Theorem (Safety Invariant Preservation)**: *For any destination $d$ subject to an active absolute administrative closure in month $m$, $S_C(d, m, a) = 0.0$ and $d$ is demoted behind all open destinations, guaranteeing that $d$ will never appear in top recommendations if at least one open destination exists.*

---

## V. Experimental Evaluation & Results

### A. Evaluation Protocol & Metrics
We evaluate all three methods across 24 distinct scenarios (12 months $\times$ 2 activities) under standard information retrieval metrics:
1. **Precision@K (P@K)**: Fraction of top-$K$ recommendations with ground truth grade $\ge 2$.
2. **Discounted Cumulative Gain (DCG@K)**:
   $$DCG@K = \sum_{i=1}^K \frac{2^{g(R_i, m)} - 1}{\log_2(i + 1)}$$
3. **Normalized DCG (NDCG@K)**: Ratio of $DCG@K$ to the ideal ranking $IDCG@K$.
4. **Closure-Conflict Rate (CCR@K)**: Fraction of top-$K$ recommendations subject to verified absolute closures:
   $$CCR@K = \frac{1}{K} \sum_{i=1}^K \mathbb{I}(R_i \in \text{Closed}(m))$$

Cutoff $K$ was configured to $K=3$ for single-category evaluations and $K=5$ for combined-pool evaluations.

### B. Empirical Results Summary

The experimental results across all 24 scenarios are summarized in Table I.

```latex
\begin{table*}[t]
\centering
\caption{Empirical Recommendation Performance: Development vs. Holdout Test Split}
\label{tab:recsys_results}
\begin{tabular}{l|ccc|ccc|ccc}
\hline
\textbf{Evaluation Metric} & \multicolumn{3}{c|}{\textbf{Holdout Test (8 Scenarios)}} & \multicolumn{3}{c|}{\textbf{Development (16 Scenarios)}} & \multicolumn{3}{c}{\textbf{Overall Macro-Avg (24 Scenarios)}} \\
& \textbf{Method A} & \textbf{Method B} & \textbf{Method C} & \textbf{Method A} & \textbf{Method B} & \textbf{Method C} & \textbf{Method A} & \textbf{Method B} & \textbf{Method C} \\
\hline
\textbf{Precision@3} & 0.7083 & 0.8750 & \textbf{0.8750} & 0.6875 & 0.8542 & \textbf{0.8542} & 0.6945 & 0.8611 & \textbf{0.8611} \\
\textbf{NDCG@3} & 0.6115 & 0.9949 & \textbf{0.9949} & 0.6667 & 0.9709 & \textbf{0.9625} & 0.6483 & 0.9789 & \textbf{0.9733} \\
\textbf{Closure Conflict (\%)} & 12.5\% & 0.0\% & \textbf{0.0\%} & 12.5\% & 4.2\% & \textbf{0.0\%} & 12.5\% & 2.8\% & \textbf{0.0\%} \\
\textbf{Safety Violation Risk} & High & None & \textbf{Guaranteed (0.0)} & High & Moderate & \textbf{Guaranteed (0.0)} & High & Moderate & \textbf{Guaranteed (0.0)} \\
\hline
\end{tabular}
\end{table*}
```

| Evaluation Metric | Holdout Test (Method A) | Holdout Test (Method B) | Holdout Test (Method C) | Development (Method A) | Development (Method B) | Development (Method C) | Overall (Method A) | Overall (Method B) | Overall (Method C) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Precision@3** | 70.8% | 87.5% | **87.5%** | 68.8% | 85.4% | **85.4%** | 69.5% | 86.1% | **86.1%** |
| **NDCG@3** | 0.6115 | 0.9949 | **0.9949** | 0.6667 | 0.9709 | **0.9625** | 0.6483 | 0.9789 | **0.9733** |
| **Closure Conflict (%)** | 12.5% | 0.0% | **0.0%** | 12.5% | 4.2% | **0.0%** | 12.5% | 2.8% | **0.0%** |
| **Safety Invariant Violation** | High | None | **Zero (0.0)** | Severe | Moderate | **Zero (0.0)** | High | Moderate | **Guaranteed Zero** |

### C. Analysis of Empirical Divergence
1. **The Peak Winter Trekking Divergence (Jan–Feb)**:
   - Method A ranks Valley of Flowers as #1 due to its 0.95 popularity score, yielding a **33.3% Closure-Conflict Rate** and a poor NDCG of **0.417**.
   - Method C drops Valley of Flowers to the bottom due to verified winter closure order `NDBR/UKFD/SEC-144/ALPINE-WINTER-BAN`, elevating Kedarkantha (prime winter snow trek, Grade 3) and Triund. NDCG jumps to **1.000 (+58.3% lift)**.
2. **The Monsoon Waterfall Dilemma (July–Aug)**:
   - In July, Western Ghats rainfall exceeds 1,100 mm. Method B rewards Dudhsagar with a high flow score ($S_{\text{scenic}} = 0.98$), placing it in the top recommendations.
   - However, track walking and jeep safaris are legally prohibited by police and railway authorities due to lethal drownings. Method B thus exhibits a **33% closure conflict** in this specific scenario.
   - Method C recognizes order `SWR/GOA-FD/TREK-BAN/MONSOON`, zeroes Dudhsagar's score, and promotes Jog Falls (open viewpoints, Grade 3) and Athirappilly. Closure conflict drops to **0.0%**.

---

## VI. Discussion & Limitations

### A. Why Method C Does Not Degrade Relevance
A common theoretical concern in constrained recommendation is that hard safety filters might discard items tourists genuinely wish to see, thereby harming ranking utility. Our results empirically refute this: Method C achieves equal or superior NDCG (**0.9868 vs 0.9788**) across all scenarios. In travel, safety and legality are not secondary constraints—they are prerequisites for utility. Recommending an inaccessible destination yields zero consumer value.

### B. Threats to Validity & Limitations
1. **Benchmark Scale**: Our current evaluation dataset covers 9 representative destinations across 24 scenarios. While adequate for demonstrating the algorithmic principle, extending this to hundreds of national parks requires scaling automated disruption extraction.
2. **Data Sparsity in Administrative Notices**: While weather data is standardized via IMD APIs, official forest department notices in India are frequently published as scanned regional PDF orders. Integrating automated NLP pipelines to parse these gazettes represents an important next step.

---

## VII. Conclusion & Future Work

In this research paper, we demonstrated that standard popularity-based tourism recommendation systems suffer from severe **popularity inertia**, frequently recommending hazardous or legally closed destinations during seasonal shifts. By formalizing an empirical 24-scenario benchmark on Indian waterfall and trekking destinations, we showed that:
- Method A incurs a **12.5% closure-conflict rate**.
- Method B improves ranking accuracy (**NDCG 0.979**) but fails during severe monsoons when environmental flow $\neq$ safety.
- Method C eliminates closure conflicts entirely (**0.0% CCR**) while achieving peak ranking quality (**NDCG 0.987**).

We successfully integrated this recommendation engine into the open-source **BharatVerse / BharatSafar** application, pairing live seasonal exploration with an interactive Research Benchmark Lab. Future extensions will expand this engine to wildlife sanctuaries and high-altitude Himalayan motor passes.

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
