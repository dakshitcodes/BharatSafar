# Research dataset provenance audit

**Audit status: incomplete; inputs are not independently verified.** This document distinguishes source pointers from evidence. A source name or agency landing page does not establish that a particular value or closure claim came from that source.

## Dataset inventory

| Data | Runtime source | Current traceability | Evidence still required |
|---|---|---|---|
| Destination identity, coordinates, elevation, attraction | `src/research/data/destinationsData.js` | Some broad agency names and URLs; no captured page/document evidence per destination | Stable source URL, page title, retrieval date, archived copy or excerpt, and field(s) supported |
| Monthly temperature and rainfall | `destinationsData.js` | Generic IMD normals PDF pointer; station mapping and value extraction are not documented per destination-month | Station, normal period, table/page, extraction method, and evidence per destination-month |
| Flow, trail, and scenic indices | `destinationsData.js` | Descriptive values; scenic index has no reproducible definition or source | Operational definition, source record, and derivation for each destination-month value |
| Popularity, rating, review count | `destinationsData.js` | Attributed generally to tourism listings/review platforms; no dated snapshots or URLs | Platform/place identifier, retrieval date, raw counts/ratings, aggregation and normalization method |
| Disruption and closure claims | `src/research/data/disruptionsData.js` | Evidence blocks exist; current records are marked unverified, and several URLs are generic landing pages | Actual order/advisory URL or archived source, issuing authority, dates, exact scope, and verified status |
| Relevance grades | `src/research/data/groundTruthData.js` | Single project annotator; rationale text but no supporting evidence per item-month | Independent annotators, blinded protocol, adjudication, agreement statistic, and evidence per grade |

The parallel JSON files (`destinations.json`, `disruptions.json`, `groundTruth.json`) are consumed by `scripts/evaluate_benchmark.py`. They have been refreshed from the JS runtime files so their current data and annotation metadata match. The Python and Node ranking/evaluation implementations remain separate; only the Node benchmark is used for the reported results here. The Python implementation should not be treated as a second reproduction until its scoring and eligibility behavior are reconciled with Node.

## Record-level schema needed before a source audit can be considered complete

Each evidence record should include `sourceUrl`, `sourceTitle`, `issuingAuthority`, `retrievedAt`, a stable archived copy or evidence-file reference, `supports` (field names or destination-month), and a short extraction note. Null or absent evidence must remain explicitly unverified; do not infer evidence from a plausible agency name or order-reference string.

For relevance labels, store the annotator protocol and per-label evidence separately from algorithm outputs. Until at least independent review and adjudication are complete, report labels as provisional single-annotator judgments.

## Findings

The repository supports reproducible computation over the values currently supplied, but it does not establish that all source values are accurate. We have not concluded that values are false; they are simply not independently traceable in their current form. No source URL or evidence record should be added unless it has actually been checked and supports the associated claim.

## Validation work log (2026-10-14)

- Created `research_data/relevance_annotations.csv` with one row for each of the 108 existing destination-month labels. Existing grades are copied unchanged; reviewer fields remain blank and every row is pending with evidence status `MISSING`.
- Created `docs/research_paper/annotation_protocol_draft.md`. It separates seasonal relevance from closure eligibility, but remains a draft pending supervisor approval and independent review.
- Created `research_data/disruption_evidence_register.csv` and `docs/research_paper/source_review_2026-10-14.md`. An initial search of official pages found general destination/seasonality information and some narrower/historical notices, but not current record-matching evidence for the supplied closure claims. All 11 supplied disruptions remain `unverified`; do not promote them based on this search.
- The targeted review found that the Dudhsagar July–August **full-destination closure** record is overbroad relative to located official notices: one 2024 source concerns vehicle movement in a circuit, while a June 2026 source prohibited specific water-entry activities for 60 days and explicitly did not prohibit waterfall visits. The latter interval had elapsed by the benchmark as-of date. It is a candidate for a distinct historical, activity-scoped audit, not evidence for a current full closure.
- Baseline outputs are preserved under `research_archive/pre_validation/`. `docs/research_paper/final_validation_log.md` records the commit base, configuration, run results, and data flow. `docs/research_paper/preliminary_results_analysis.md` reports paired exploratory results and sensitivity without treating them as confirmatory.

The annotation and evidence files are review instruments, not completed reviews. Independent graders and supervisor approval remain external dependencies.

- Prepared `docs/research_paper/supervisor_approval_request.md` for forwarding; it records the exact rubric, separation, evidence, and blind-review decisions requiring approval. No message was sent and no approval is recorded.
- Prepared `research_data/reviewer_blind_packet.csv` with 108 cases. It omits initial grades, rationales, method rankings, and scores; all grade fields are blank and review states are pending approval. `research_data/reviewer_instructions.md` requires a separate copy per reviewer and locked blind submissions.
- Added `docs/research_paper/independent_review_status.md`; status remains 0/108, with supervisor approval and reviewer arrangement pending. Added an additional targeted-source-search section to `source_review_2026-10-14.md`; no disruption status changed.
