/** Evaluation metrics for the seasonal tourism ranking benchmark. */
import { groundTruthData } from "../data/groundTruthData.js";
import { disruptionsData } from "../data/disruptionsData.js";
import {
  DISRUPTION_POLICY,
  getActivityApplicability,
  getApplicableVerifiedDisruptions,
  isVerifiedFullClosure,
} from "../data/disruptionPolicy.js";

export function getGroundTruthGrade(destinationId, month, labels = groundTruthData) {
  const monthly = labels?.ratings?.[destinationId]?.monthlyGrades?.[String(month)];
  return Number.isInteger(monthly?.grade) && monthly.grade >= 0 && monthly.grade <= 3
    ? monthly.grade
    : null;
}

export function getGroundTruthRationale(destinationId, month, labels = groundTruthData) {
  return labels?.ratings?.[destinationId]?.monthlyGrades?.[String(month)]?.rationale ?? "";
}

export function hasVerifiedClosure(
  destinationId,
  month,
  disruptions = disruptionsData,
  asOfDate = DISRUPTION_POLICY.asOfDate
) {
  return disruptions.some(
    (record) =>
      record.destinationId === destinationId &&
      Array.isArray(record.applicableMonths) &&
      record.applicableMonths.includes(Number(month)) &&
      isVerifiedFullClosure(record, asOfDate)
  );
}

export function calculatePrecisionAtK(
  rankedList,
  month,
  k = 3,
  threshold = 2,
  labels = groundTruthData,
  allCandidates = rankedList
) {
  if ((allCandidates ?? []).some((item) => getGroundTruthGrade(item.id, month, labels) === null)) return null;
  const effectiveK = Math.min(k, rankedList?.length ?? 0);
  if (effectiveK === 0) return null;
  const topK = rankedList.slice(0, effectiveK);
  const grades = topK.map((item) => getGroundTruthGrade(item.id, month, labels));
  if (grades.some((grade) => grade === null)) return null;
  return Number((grades.filter((grade) => grade >= threshold).length / effectiveK).toFixed(4));
}

export function calculateDCG(rankedList, month, k = 3, labels = groundTruthData) {
  const effectiveK = Math.min(k, rankedList?.length ?? 0);
  if (effectiveK === 0) return 0;
  const grades = rankedList
    .slice(0, effectiveK)
    .map((item) => getGroundTruthGrade(item.id, month, labels));
  if (grades.some((grade) => grade === null)) return null;
  return grades.reduce(
    (sum, grade, index) => sum + (Math.pow(2, grade) - 1) / Math.log2(index + 2),
    0
  );
}

export function calculateIDCG(candidates, month, k = 3, labels = groundTruthData) {
  if (!candidates?.length) return 0;
  const grades = candidates.map((item) => getGroundTruthGrade(item.id, month, labels));
  if (grades.some((grade) => grade === null)) return null;
  const ideal = [...candidates].sort(
    (a, b) => getGroundTruthGrade(b.id, month, labels) - getGroundTruthGrade(a.id, month, labels)
  );
  return calculateDCG(ideal, month, k, labels);
}

/** NDCG is undefined if any required label is missing or IDCG is zero. */
export function calculateNDCGAtK(
  rankedList,
  allCandidates,
  month,
  k = 3,
  labels = groundTruthData
) {
  // The shared original scenario pool defines IDCG for every method, including
  // candidates excluded from a method's eligible recommendation list.
  if (!rankedList?.length) return null;
  const dcg = calculateDCG(rankedList, month, k, labels);
  const idcg = calculateIDCG(allCandidates, month, k, labels);
  if (dcg === null || idcg === null || idcg === 0) return null;
  return Number((dcg / idcg).toFixed(4));
}

/** CCR counts only evidence-backed, current, full-destination closures. */
export function calculateClosureConflictRate(
  rankedList,
  month,
  k = 3,
  disruptions = disruptionsData,
  asOfDate = DISRUPTION_POLICY.asOfDate,
  allCandidates = null
) {
  const universe = allCandidates ?? [
    ...(rankedList ?? []),
    ...(rankedList?._allScored ?? []),
    ...(rankedList?._ineligible ?? []),
  ];
  return calculateClosureConflictMetric(rankedList, month, k, disruptions, asOfDate, universe).value;
}

export function calculateClosureConflictMetric(
  rankedList,
  month,
  k = 3,
  disruptions = disruptionsData,
  asOfDate = DISRUPTION_POLICY.asOfDate,
  allCandidates = null
) {
  const universe = allCandidates ?? [
    ...(rankedList ?? []), ...(rankedList?._allScored ?? []), ...(rankedList?._ineligible ?? []),
  ];
  const candidateIds = new Set(universe.map((item) => item.id));
  const suppliedClosures = disruptions.filter((record) =>
    candidateIds.has(record.destinationId) && record.applicableMonths?.includes(Number(month)) &&
    record.isAbsoluteClosure === true && record.restrictionScope === DISRUPTION_POLICY.fullClosureScope
  );
  const qualifyingClosures = suppliedClosures.filter((record) => isVerifiedFullClosure(record, asOfDate));
  const effectiveK = Math.min(k, rankedList?.length ?? 0);
  const reasonCode = !effectiveK ? "NO_ELIGIBLE_RECOMMENDATIONS"
    : !suppliedClosures.length ? "NO_QUALIFYING_CLOSURE_RECORD"
    : !qualifyingClosures.length ? "INSUFFICIENT_EVIDENCE" : null;
  if (reasonCode) return {
    value: null, status: "NOT_ESTIMABLE", reasonCode,
    numerator: null, denominator: effectiveK,
    qualifyingClosureRecordCount: qualifyingClosures.length,
    insufficientEvidenceRecordCount: suppliedClosures.length - qualifyingClosures.length,
  };
  const conflicts = rankedList
    .slice(0, effectiveK)
    .filter((item) => qualifyingClosures.some((record) => record.destinationId === item.id)).length;
  return {
    value: Number((conflicts / effectiveK).toFixed(4)), status: "ESTIMABLE", reasonCode: null,
    numerator: conflicts, denominator: effectiveK,
    qualifyingClosureRecordCount: qualifyingClosures.length,
    insufficientEvidenceRecordCount: suppliedClosures.length - qualifyingClosures.length,
  };
}

export function calculatePartialRestrictionRate(
  rankedList,
  month,
  k = 3,
  disruptions = disruptionsData,
  asOfDate = DISRUPTION_POLICY.asOfDate,
  allCandidates = null
) {
  const universe = allCandidates ?? [
    ...(rankedList ?? []),
    ...(rankedList?._allScored ?? []),
    ...(rankedList?._ineligible ?? []),
  ];
  const candidateIds = new Set(universe.map((item) => item.id));
  const partialRecords = disruptions.filter((record) => record.isAbsoluteClosure !== true);
  const appliesToCandidate = (record, item) =>
    record.destinationId === item.id &&
    getApplicableVerifiedDisruptions(item.id, month, [record], asOfDate, item.category).length > 0;
  const hasPartialEvidenceForMonth = partialRecords.some((record) =>
    candidateIds.has(record.destinationId) && universe.some((item) => appliesToCandidate(record, item))
  );
  if (!hasPartialEvidenceForMonth) return null;
  const effectiveK = Math.min(k, rankedList?.length ?? 0);
  if (effectiveK === 0) return null;
  const restricted = rankedList.slice(0, effectiveK).filter((item) =>
    partialRecords.some((record) => appliesToCandidate(record, item))
  ).length;
  return Number((restricted / effectiveK).toFixed(4));
}

export function calculateScenarioCoverage(
  candidates,
  month,
  { labels = groundTruthData, disruptions = disruptionsData, asOfDate = DISRUPTION_POLICY.asOfDate } = {}
) {
  const seasonalComplete = candidates.filter((destination) => {
    const monthly = destination.monthlyData?.[String(month)];
    return (
      Number.isFinite(destination.popularityScore) &&
      Number.isFinite(monthly?.avgTempC) &&
      Number.isFinite(monthly?.rainfallMm) &&
      Number.isFinite(monthly?.scenicIndex) &&
      monthly.scenicIndex >= 0 &&
      monthly.scenicIndex <= 1 &&
      ["trekking", "waterfalls"].includes(destination.category)
    );
  }).length;
  const labeledCount = candidates.filter(
    (destination) => getGroundTruthGrade(destination.id, month, labels) !== null
  ).length;
  const candidateIds = new Set(candidates.map((destination) => destination.id));
  const activeRecords = disruptions.filter((record) =>
    candidateIds.has(record.destinationId) &&
    record.applicableMonths?.includes(Number(month))
  );
  const scopedRecords = activeRecords.flatMap((record) => {
    const destination = candidates.find((item) => item.id === record.destinationId);
    const applicability = getActivityApplicability(record, destination?.category);
    return applicability.known && applicability.applies ? [record] :
      applicability.known ? [] : [{ ...record, _unknownActivityScope: true }];
  });
  const verifiedActiveRecords = scopedRecords.filter((record) => {
    if (record._unknownActivityScope) return false;
    const destination = candidates.find((item) => item.id === record.destinationId);
    return destination && getApplicableVerifiedDisruptions(
      destination.id, month, [record], asOfDate, destination.category
    ).length > 0;
  }).length;

  return {
    seasonalDataCoverage: candidates.length ? seasonalComplete / candidates.length : null,
    popularityDataCoverage: candidates.length
      ? candidates.filter((destination) => Number.isFinite(destination.popularityScore)).length / candidates.length
      : null,
    relevanceLabelCoverage: candidates.length ? labeledCount / candidates.length : null,
    labeledCandidateCount: labeledCount,
    unlabeledCandidateCount: candidates.length - labeledCount,
    activeDisruptionRecordCount: scopedRecords.length,
    evidenceBackedDisruptionRecordCount: verifiedActiveRecords,
    unknownActivityScopeRecordCount: scopedRecords.filter((record) => record._unknownActivityScope).length,
    disruptionEvidenceCoverage: scopedRecords.length
      ? verifiedActiveRecords / scopedRecords.length
      : null,
  };
}

export function evaluateRanking(
  rankedList,
  allCandidates,
  month,
  k = 3,
  options = {}
) {
  const {
    labels = groundTruthData,
    disruptions = disruptionsData,
    asOfDate = DISRUPTION_POLICY.asOfDate,
  } = options;
  const effectiveK = Math.min(k, rankedList?.length ?? 0);
  const topK = rankedList?.slice(0, effectiveK) ?? [];
  const labeledTopK = topK.filter(
    (item) => getGroundTruthGrade(item.id, month, labels) !== null
  ).length;
  const ndcg = calculateNDCGAtK(rankedList, allCandidates, month, k, labels);
  const closureMetric = calculateClosureConflictMetric(rankedList, month, k, disruptions, asOfDate, allCandidates);
  const candidateGrades = (allCandidates ?? []).map((item) => getGroundTruthGrade(item.id, month, labels));
  const missingCandidateLabels = candidateGrades.filter((grade) => grade === null).length;
  const idcg = calculateIDCG(allCandidates, month, k, labels);
  const precision = calculatePrecisionAtK(rankedList, month, k, 2, labels, allCandidates);
  const partialRestrictionRate = calculatePartialRestrictionRate(
    rankedList,
    month,
    k,
    disruptions,
    asOfDate,
    allCandidates
  );

  return {
    requestedK: k,
    k: effectiveK,
    eligiblePoolCount: rankedList?.length ?? 0,
    candidateCount: allCandidates?.length ?? 0,
    precisionAtK: precision,
    precisionAtKStatus: precision === null ? "NOT_ESTIMABLE" : "ESTIMABLE",
    precisionAtKReasonCode: precision !== null ? null : effectiveK === 0
      ? "NO_ELIGIBLE_RECOMMENDATIONS" : missingCandidateLabels ? "MISSING_RELEVANCE_LABELS" : "NO_VALID_DENOMINATOR",
    precisionDenominator: effectiveK,
    ndcgAtK: ndcg,
    ndcgExcluded: ndcg === null,
    ndcgAtKStatus: ndcg === null ? "NOT_ESTIMABLE" : "ESTIMABLE",
    ndcgAtKReasonCode: ndcg !== null ? null : effectiveK === 0 ? "NO_ELIGIBLE_RECOMMENDATIONS"
      : missingCandidateLabels ? "MISSING_RELEVANCE_LABELS" : idcg === 0 ? "ZERO_IDCG" : "UNDEFINED_NDCG",
    ndcgDenominator: idcg,
    ndcgIdealPoolCount: allCandidates?.length ?? 0,
    closureConflictRate: closureMetric.value,
    closureConflictStatus: closureMetric.status,
    closureConflictReasonCode: closureMetric.reasonCode,
    closureConflictNumerator: closureMetric.numerator,
    closureConflictDenominator: closureMetric.denominator,
    qualifyingClosureRecordCount: closureMetric.qualifyingClosureRecordCount,
    insufficientEvidenceClosureRecordCount: closureMetric.insufficientEvidenceRecordCount,
    partialRestrictionRate,
    labeledTopKCount: labeledTopK,
    unlabeledTopKCount: effectiveK - labeledTopK,
    labeledCandidateCount: candidateGrades.length - missingCandidateLabels,
    unlabeledCandidateCount: missingCandidateLabels,
    candidateLabelCoverage: allCandidates?.length
      ? allCandidates.filter((item) => getGroundTruthGrade(item.id, month, labels) !== null).length /
        allCandidates.length
      : null,
  };
}
