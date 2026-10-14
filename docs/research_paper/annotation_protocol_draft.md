# Relevance annotation protocol (draft for supervisor approval)

**Status:** Draft only. Do not replace benchmark labels or begin the blind review until the supervisor/research guide approves and freezes this rubric.

## Annotation target

Rate **seasonal suitability** for the destination's listed activity and calendar month. Do not use current closure status, legal access, the ranking method's score, or the method's output to assign the relevance grade. Record access restrictions independently in the disruption register. This keeps the quality-ranking question separate from the closure-eligibility question.

## Ordinal scale

| Grade | Meaning |
|---|---|
| 0 | Seasonal conditions make the specified activity unsuitable under the documented criteria. A closure by itself is not a grade-0 reason; record that in the separate disruption field. |
| 1 | Poor seasonal fit with substantial limitations to the specified activity or visitor experience. |
| 2 | Suitable seasonal fit with manageable limitations. |
| 3 | Strong seasonal fit supported by destination- and month-relevant evidence. |

The rubric is provisional and requires supervisor approval. Annotators must cite a direct source or mark evidence `MISSING`; a generic agency homepage is not evidence for an individual grade. Each rationale should explain how the source supports the specified activity and month and note uncertainty.

## Independent review procedure

1. Freeze and version this rubric before annotation begins.
2. Give each reviewer the destination, activity, month, rubric, and source evidence, but hide initial grades, algorithm scores, and rankings.
3. Have reviewers enter grades independently in separate reviewer columns in `research_data/relevance_annotations.csv`.
4. Preserve both original grades. Calculate exact agreement and a weighted ordinal agreement statistic only after review; document assumptions and missing cases.
5. Record disagreements and an adjudicated grade with its rationale. Do not average ordinal grades without a predeclared rule.
6. Leave records unadjudicated when evidence is insufficient; report resulting metric coverage rather than fabricating a grade.

## Current-data warning

The `initial_grade` column is copied unchanged from the provisional single-annotator benchmark. Existing rationales often describe the same monthly conditions used by the seasonal ranking features. The resulting benchmark can therefore reward agreement with the original rubric and inputs rather than independently observed tourist preference or outcomes. This annotation sheet does not constitute independent validation.
