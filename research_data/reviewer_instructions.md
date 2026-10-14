# Independent relevance review instructions

**Status: Do not begin until the research guide has approved and versioned the annotation protocol.** This packet is intentionally blind: it omits the existing grades, their rationales, and all algorithm rankings and scores.

## Before reviewing

- Obtain the approved protocol version and use the same version for every reviewer.
- Give every reviewer an identical copy of `reviewer_blind_packet.csv`; each person must fill a separate copy.
- Do not show or discuss `relevance_annotations.csv`, the preliminary results, rankings, or any other annotator's ratings until all independent ratings are submitted and locked.
- Review each destination–activity–month case independently. Do not coordinate grade choices with another reviewer.

## For each case

- Assign an integer grade from 0 to 3 only under the approved rubric.
- Cite a direct source supporting that destination, activity, month, and seasonal-suitability judgment. Record the date you accessed/reviewed it.
- Give a short rationale that explains the source-to-grade connection and note uncertainty.
- If no adequate evidence is available, leave the grade blank, set `evidence_status` to `MISSING`, and explain why. Do not invent a source or infer a grade from the recommendation engine.
- Assess seasonal suitability only. Put closure or access restrictions in the separate disruption evidence process; a closure alone does not determine seasonal relevance.
- Fill reviewer identity only as agreed with the research lead. Do not include private personal data in a publicly shared dataset.

## Submission and lock

Return the completed copy to the research lead. Keep a dated, unmodified copy of the submitted file. The research lead should record its checksum and receipt date before revealing initial labels or comparing reviewers. The 108 blank rows represent the intended full scope; a smaller scope must be documented explicitly rather than silently omitted.
