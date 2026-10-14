/** Reproducible 36-scenario benchmark over two single-activity pools and their mix. */
import { destinationsData } from "../data/destinationsData.js";
import { disruptionsData } from "../data/disruptionsData.js";
import { groundTruthData } from "../data/groundTruthData.js";
import {
  DISRUPTION_POLICY,
  getApplicableVerifiedDisruptions,
  getDisruptionEvidenceStatus,
} from "../data/disruptionPolicy.js";
import {
  rankMethodAPopularity,
  rankMethodBSeasonal,
  rankMethodCDisruptionAware,
  DEFAULT_SEASONAL_WEIGHTS,
} from "../algorithms/rankingEngine.js";
import { calculateNDCGAtK, calculateScenarioCoverage, evaluateRanking } from "./metrics.js";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DEFAULT_HOLDOUT_MONTHS = [2, 4, 9, 11];

function safeAverage(values) {
  const defined = values.filter((value) => Number.isFinite(value));
  return {
    value: defined.length
      ? Number((defined.reduce((sum, value) => sum + value, 0) / defined.length).toFixed(4))
      : null,
    excludedCount: values.length - defined.length,
  };
}

function aggregateMethod(subset, method) {
  const metrics = subset.map((scenario) => scenario[method].metrics);
  const precision = safeAverage(metrics.map((item) => item.precisionAtK));
  const ndcg = safeAverage(metrics.map((item) => item.ndcgAtK));
  const ccr = safeAverage(metrics.map((item) => item.closureConflictRate));
  const partial = safeAverage(metrics.map((item) => item.partialRestrictionRate));
  const eligible = safeAverage(metrics.map((item) => item.eligiblePoolCount));
  const closureReasonCounts = metrics.reduce((counts, item) => {
    if (item.closureConflictReasonCode) {
      counts[item.closureConflictReasonCode] = (counts[item.closureConflictReasonCode] ?? 0) + 1;
    }
    return counts;
  }, {});
  const precisionReasonCounts = metrics.reduce((counts, item) => {
    if (item.precisionAtKReasonCode) {
      counts[item.precisionAtKReasonCode] = (counts[item.precisionAtKReasonCode] ?? 0) + 1;
    }
    return counts;
  }, {});
  return {
    precisionAtK: precision.value,
    precisionExcludedScenarios: precision.excludedCount,
    precisionReasonCounts,
    ndcgAtK: ndcg.value,
    ndcgExcludedScenarios: ndcg.excludedCount,
    closureConflictRate: ccr.value,
    closureConflictPercent: ccr.value === null ? null : Number((ccr.value * 100).toFixed(1)),
    closureConflictExcludedScenarios: ccr.excludedCount,
    closureConflictReasonCounts: closureReasonCounts,
    partialRestrictionRate: partial.value,
    eligiblePoolCountMean: eligible.value,
    meanEffectiveK: safeAverage(metrics.map((item) => item.k)).value,
  };
}

function aggregateCoverage(subset) {
  const ndcgExcludedScenarios = Object.fromEntries(
    ["methodA", "methodB", "methodC"].map((method) => [
      method,
      subset.filter((scenario) => scenario[method].metrics.ndcgExcluded).length,
    ])
  );
  return {
    seasonalDataCoverage: safeAverage(subset.map((item) => item.coverage.seasonalDataCoverage)).value,
    relevanceLabelCoverage: safeAverage(subset.map((item) => item.coverage.relevanceLabelCoverage)).value,
    disruptionEvidenceCoverage: safeAverage(subset.map((item) => item.coverage.disruptionEvidenceCoverage)).value,
    ndcgExcludedScenarios,
    seasonalDataMissingScenarios: subset.filter((item) => item.coverage.seasonalDataCoverage < 1).length,
    relevanceLabelMissingScenarios: subset.filter((item) => item.coverage.relevanceLabelCoverage < 1).length,
    verifiedActiveDisruptionRecords: subset.reduce(
      (sum, item) => sum + item.coverage.evidenceBackedDisruptionRecordCount,
      0
    ),
    suppliedActiveDisruptionRecords: subset.reduce(
      (sum, item) => sum + item.coverage.activeDisruptionRecordCount,
      0
    ),
  };
}

function aggregateSubset(subset) {
  return {
    scenarioCount: subset.length,
    methodA: aggregateMethod(subset, "methodA"),
    methodB: aggregateMethod(subset, "methodB"),
    methodC: aggregateMethod(subset, "methodC"),
    coverage: aggregateCoverage(subset),
  };
}

function topKOverlap(reference, other, k) {
  // Inputs are already method-eligible lists: closures and missing-score items
  // are excluded before this comparison. Jaccard uses each eligible top-K set.
  const first = new Set(reference.slice(0, k).map((item) => item.id));
  const second = new Set(other.slice(0, k).map((item) => item.id));
  const union = new Set([...first, ...second]);
  if (!union.size) return null;
  const intersection = [...first].filter((id) => second.has(id)).length;
  return intersection / union.size;
}

function seasonalWeightSensitivity(scenarios, candidatesByActivity, labels, asOfDate) {
  const alternatives = [
    { scenic: 0.4, weather: 0.4, popularity: 0.2 },
    { scenic: 0.6, weather: 0.2, popularity: 0.2 },
    { scenic: 0.5, weather: 0.2, popularity: 0.3 },
  ];
  return alternatives.map((weights) => {
    const overlaps = [];
    const ndcgValues = [];
    for (const scenario of scenarios) {
      const candidates = candidatesByActivity[scenario.activity];
      const ranking = rankMethodCDisruptionAware(candidates, scenario.month, scenario.activity, {
        asOfDate, weights,
      });
      const overlap = topKOverlap(scenario.methodC.ranking, ranking, scenario.k);
      if (overlap !== null) overlaps.push(overlap);
      const ndcg = calculateNDCGAtK(ranking, candidates, scenario.month, scenario.k, labels);
      if (Number.isFinite(ndcg)) ndcgValues.push(ndcg);
    }
    return {
      weights,
      comparedScenarioCount: overlaps.length,
      meanTopKJaccardVsConfigured: safeAverage(overlaps).value,
      meanNDCGAtK: safeAverage(ndcgValues).value,
      ndcgScenarioCount: ndcgValues.length,
      interpretation: "Descriptive sensitivity analysis of design weights; alternatives are not optimized or claimed to be superior.",
    };
  });
}

function validateBenchmarkOptions({ kSingleActivity, kCombined, holdoutMonths, asOfDate }) {
  for (const [name, value] of [["kSingleActivity", kSingleActivity], ["kCombined", kCombined]]) {
    if (!Number.isInteger(value) || value < 1) {
      throw new RangeError(`${name} must be a positive integer.`);
    }
  }
  if (
    !Array.isArray(holdoutMonths) ||
    holdoutMonths.some((month) => !Number.isInteger(month) || month < 1 || month > 12) ||
    new Set(holdoutMonths).size !== holdoutMonths.length
  ) {
    throw new RangeError("holdoutMonths must contain unique integers from 1 to 12.");
  }
  if (typeof asOfDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(asOfDate) ||
      new Date(`${asOfDate}T00:00:00Z`).toISOString().slice(0, 10) !== asOfDate) {
    throw new RangeError("asOfDate must be a valid date in YYYY-MM-DD format.");
  }
}

function fingerprintDatasets() {
  const serialized = JSON.stringify({ destinationsData, disruptionsData, groundTruthData });
  let hash = 0x811c9dc5;
  for (let index = 0; index < serialized.length; index += 1) {
    hash ^= serialized.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32-${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function runFullBenchmark(options = {}) {
  const kCombined = options.kCombined ?? options.k ?? 5;
  const kSingleActivity = options.kSingleActivity ?? 3;
  const asOfDate = options.asOfDate ?? DISRUPTION_POLICY.asOfDate;
  const holdoutMonths = options.holdoutMonths ?? [...DEFAULT_HOLDOUT_MONTHS];
  validateBenchmarkOptions({ kSingleActivity, kCombined, holdoutMonths, asOfDate });
  const normalizedHoldoutMonths = [...holdoutMonths].sort((a, b) => a - b);
  const candidatesByActivity = {
    waterfalls: destinationsData.filter((item) => item.category === "waterfalls"),
    trekking: destinationsData.filter((item) => item.category === "trekking"),
    all: destinationsData,
  };
  const scenarios = [];

  for (const activity of Object.keys(candidatesByActivity)) {
    const candidates = candidatesByActivity[activity];
    const k = Math.min(activity === "all" ? kCombined : kSingleActivity, candidates.length);
    for (let month = 1; month <= 12; month++) {
      const methodA = rankMethodAPopularity(candidates);
      const methodB = rankMethodBSeasonal(candidates, month, activity);
      const methodC = rankMethodCDisruptionAware(candidates, month, activity, { asOfDate });
      const coverage = calculateScenarioCoverage(candidates, month, { asOfDate });
      const split = normalizedHoldoutMonths.includes(month) ? "HOLDOUT" : "DEVELOPMENT";

      scenarios.push({
        id: `${activity}-m${month}`,
        activity,
        scope: activity === "all" ? "MIXED_ACTIVITY_POOL" : "CATEGORY_SPECIFIC_POOL",
        month,
        monthName: MONTH_NAMES[month - 1],
        split,
        candidateCount: candidates.length,
        k,
        coverage,
        methodA: { ranking: methodA, metrics: evaluateRanking(methodA, candidates, month, k, { asOfDate }) },
        methodB: { ranking: methodB, metrics: evaluateRanking(methodB, candidates, month, k, { asOfDate }) },
        methodC: {
          ranking: methodC,
          quarantined: methodC._quarantined ?? [],
          ignoredDisruptions: (methodC._allScored ?? methodC).flatMap((item) => item.ignoredDisruptions ?? []),
          metrics: evaluateRanking(methodC, candidates, month, k, { asOfDate }),
        },
      });
    }
  }

  const categorySpecific = scenarios.filter((item) => item.activity !== "all");
  const development = scenarios.filter((item) => item.split === "DEVELOPMENT");
  const holdout = scenarios.filter((item) => item.split === "HOLDOUT");
  const categorySpecificDevelopment = categorySpecific.filter((item) => item.split === "DEVELOPMENT");
  const categorySpecificHoldout = categorySpecific.filter((item) => item.split === "HOLDOUT");
  const aggregateResults = {
    waterfalls: aggregateSubset(scenarios.filter((item) => item.activity === "waterfalls")),
    trekking: aggregateSubset(scenarios.filter((item) => item.activity === "trekking")),
    all: aggregateSubset(scenarios.filter((item) => item.activity === "all")),
    overall: aggregateSubset(scenarios),
    categorySpecific: aggregateSubset(categorySpecific),
    development: aggregateSubset(development),
    holdout: aggregateSubset(holdout),
    categorySpecificDevelopment: aggregateSubset(categorySpecificDevelopment),
    categorySpecificHoldout: aggregateSubset(categorySpecificHoldout),
  };

  const recordAppliesToScenario = (record, scenario) => {
    const candidate = candidatesByActivity[scenario.activity]
      .find((item) => item.id === record.destinationId);
    return candidate && getApplicableVerifiedDisruptions(
      candidate.id, scenario.month, [record], asOfDate, candidate.category
    ).length > 0;
  };
  const partialRecords = [...new Map(disruptionsData
    .filter((record) => record.isAbsoluteClosure !== true &&
      scenarios.some((scenario) => recordAppliesToScenario(record, scenario)))
    .map((record) => [record.id, record])).values()];
  const applicablePartialScenarios = scenarios.filter((scenario) =>
    partialRecords.some((record) => recordAppliesToScenario(record, scenario))
  );
  const penaltySensitivity = [0.25, 0.5, 0.75].map((penaltyMultiplier) => {
    const overlaps = applicablePartialScenarios.flatMap((scenario) => {
      const scenarioCandidates = candidatesByActivity[scenario.activity];
      const variantRanking = rankMethodCDisruptionAware(
        scenarioCandidates,
        scenario.month,
        scenario.activity,
        { asOfDate, partialPenaltyOverride: penaltyMultiplier }
      );
      const overlap = topKOverlap(scenario.methodC.ranking, variantRanking, scenario.k);
      return overlap === null ? [] : [{ scenarioId: scenario.id, overlap }];
    });
    const overlapSummary = safeAverage(overlaps.map((item) => item.overlap));
    return {
      penaltyMultiplier,
      uniqueEvidenceBackedPartialRestrictionRecordCount: partialRecords.length,
      applicableScenarioCount: applicablePartialScenarios.length,
      meanTopKJaccardVsConfigured: overlapSummary.value,
      comparedScenarioCount: overlaps.length,
      excludedScenarioCount: scenarios.length - overlaps.length,
      interpretation: "Top-K ranking stability only; this is not a measure or guarantee of real-world safety.",
      status: partialRecords.length
        ? "Computed against configured Method C eligible top-K rankings"
        : "Not estimable: no active evidence-backed partial restrictions in the current data",
    };
  });
  const weightSensitivity = seasonalWeightSensitivity(
    scenarios, candidatesByActivity, groundTruthData, asOfDate
  );

  const notableDivergences = categorySpecific
    .map((scenario) => {
      const ccrA = scenario.methodA.metrics.closureConflictRate;
      const ccrC = scenario.methodC.metrics.closureConflictRate;
      const ndcgA = scenario.methodA.metrics.ndcgAtK;
      const ndcgB = scenario.methodB.metrics.ndcgAtK;
      const ndcgC = scenario.methodC.metrics.ndcgAtK;
      return {
        scenarioId: scenario.id,
        activity: scenario.activity,
        month: scenario.month,
        monthName: scenario.monthName,
        split: scenario.split,
        k: scenario.k,
        ccrMethodA: ccrA,
        ccrMethodC: ccrC,
        ndcgMethodA: ndcgA,
        ndcgMethodB: ndcgB,
        ndcgMethodC: ndcgC,
        ccrDiff: ccrA === null || ccrC === null ? null : ccrA - ccrC,
        ndcgLift: ndcgA === null || ndcgC === null ? null : ndcgC - ndcgA,
        topPicksA: scenario.methodA.ranking.slice(0, scenario.k).map((item) => item.name),
        topPicksB: scenario.methodB.ranking.slice(0, scenario.k).map((item) => item.name),
        topPicksC: scenario.methodC.ranking.slice(0, scenario.k).map((item) => item.name),
        quarantinedC: scenario.methodC.quarantined.map((item) => item.name),
      };
    })
    .sort((a, b) => (b.ccrDiff ?? -Infinity) - (a.ccrDiff ?? -Infinity) ||
      (b.ndcgLift ?? -Infinity) - (a.ndcgLift ?? -Infinity));

  const dataVersion = {
    destinationDatasetVersion: "destinations-provenance-review-pending-v1",
    relevanceRubricVersion: groundTruthData.rubric?.version ?? "unspecified",
    disruptionPolicyVersion: "evidence-event-trigger-activity-policy-v2",
    fingerprint: fingerprintDatasets(),
  };

  return {
    timestamp: new Date().toISOString(),
    protocol: {
      version: "benchmark-protocol-2026-10-14-v3",
      asOfDate,
      dataVersion,
      algorithmVersion: "ranking-engine-v3-scoped-penalties-and-configurable-weights",
      metricVersion: "ranking-metrics-v3-event-aware-disruption-coverage",
      kSingleActivity,
      kCombined,
      holdoutMonths: normalizedHoldoutMonths,
      seasonalWeights: DEFAULT_SEASONAL_WEIGHTS,
      holdoutStatus: "Exploratory only; selection rationale, timestamp, and whether past changes used holdout results are undocumented.",
      holdoutMonthRationale: "No contemporaneous rationale for February, April, September, and November was recorded; do not treat these scenarios as an untouched confirmatory holdout.",
      holdoutInfluenceHistory: "Unknown; no auditable record establishes whether holdout information influenced labels, weights, penalties, or code changes.",
      parameterSelection: "Weights and disruption penalties are design values; no independent tuning record is available.",
      relevanceThreshold: 2,
      scenarioCounts: {
        categorySpecific: categorySpecific.length,
        combined: scenarios.length - categorySpecific.length,
        total: scenarios.length,
      },
      aggregateScopes: {
        overall: `All ${scenarios.length} scenarios, including ${scenarios.length - categorySpecific.length} mixed-pool scenarios; scenario-level K varies by pool.`,
        categorySpecific: `${categorySpecific.length} waterfall and trekking scenarios only; excludes the mixed pool.`,
        development: `${development.length} scenarios across all three pools in months outside the designated holdout months.`,
        holdout: `${holdout.length} scenarios across all three pools in the designated holdout months; exploratory only.`,
      },
      disruptionPolicy: DISRUPTION_POLICY,
    },
    evaluationConfig: {
      kSingleActivity,
      kCombinedPool: kCombined,
      relevanceThreshold: 2,
      holdoutMonths: normalizedHoldoutMonths,
      undefinedNDCGPolicy: "NDCG is null if there are no eligible recommendations, any original scenario candidate lacks a relevance label, or shared-pool IDCG is zero; the original candidate pool defines IDCG for every method.",
      precisionDenominatorPolicy: "P@K is undefined if any original scenario candidate lacks a relevance label; otherwise divide relevant returned recommendations by effective K. Requested and effective K plus label coverage are reported.",
      closureConflictDefinition: "Top-K destinations matching current evidence-backed full-destination closure records only. N/A includes a reason code distinguishing no eligible recommendations, no qualifying record, and insufficient evidence.",
      disruptionEvidenceCoverageDefinition: "Per-scenario fraction of supplied disruption records matching a candidate destination and month, and either explicitly applying to the destination category or having unknown activity scope, that pass evidence, freshness, event-validity, scope, and trigger checks; known out-of-activity-scope records are excluded. N/A when no candidate-relevant records remain. Sub-destination geographic applicability is not represented by the current data.",
      rankingEligibilityPolicy: "Each method is evaluated on its own eligible ranked list: missing required score inputs are excluded, and Method C also quarantines current evidence-backed full-destination closures. NDCG ideal rankings use the same original scenario candidate pool for all methods; exclusion counts and eligible pool sizes are reported by method.",
      holdoutStatus: "Exploratory; selection rationale and historical independence from tuning are not established.",
      dataFingerprint: dataVersion.fingerprint,
    },
    dataVersion,
    dataCoverage: {
      destinationCount: destinationsData.length,
      destinationMonthLabelCount: Object.values(groundTruthData.ratings ?? {}).reduce(
        (sum, entry) => sum + Object.keys(entry.monthlyGrades ?? {}).length,
        0
      ),
      suppliedDisruptionRecordCount: disruptionsData.length,
      evidenceBackedDisruptionRecordCount: disruptionsData.filter(
        (record) => getDisruptionEvidenceStatus(record, asOfDate).usable
      ).length,
      evidenceBackedDisruptionCoverage: disruptionsData.length
        ? disruptionsData.filter((record) => getDisruptionEvidenceStatus(record, asOfDate).usable).length /
          disruptionsData.length
        : null,
    },
    aggregateResults,
    penaltySensitivity,
    seasonalWeightSensitivity: weightSensitivity,
    notableDivergences: notableDivergences.slice(0, 12),
    scenarios,
  };
}

function formatFixed(value, digits = 4) {
  return Number.isFinite(value) ? value.toFixed(digits) : "N/A";
}

function formatLatexPercent(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)}\\%` : "N/A";
}

export function generateLatexTable(benchmarkData) {
  const cohorts = [
    ["Category-specific holdout (waterfalls + trekking)", benchmarkData.aggregateResults.categorySpecificHoldout],
    ["Category-specific development (waterfalls + trekking)", benchmarkData.aggregateResults.categorySpecificDevelopment],
    ["Category-specific total (excludes mixed pool)", benchmarkData.aggregateResults.categorySpecific],
    ["All-pool holdout (includes mixed pool)", benchmarkData.aggregateResults.holdout],
    ["All-pool development (includes mixed pool)", benchmarkData.aggregateResults.development],
    ["All-pool total (includes mixed pool)", benchmarkData.aggregateResults.overall],
  ];
  const rows = [];
  for (const [scope, result] of cohorts) {
    const valuesByMethod = [result.methodA, result.methodB, result.methodC];
    const metrics = [
      ["Precision@K (0--1)", (item) => formatFixed(item.precisionAtK)],
      ["NDCG@K (0--1)", (item) => formatFixed(item.ndcgAtK)],
      ["Full-closure conflict (\\%)", (item) => formatLatexPercent(item.closureConflictPercent)],
      ["Mean effective K", (item) => formatFixed(item.meanEffectiveK, 2)],
      ["Undefined P@K scenarios", (item) => String(item.precisionExcludedScenarios)],
      ["Undefined NDCG@K scenarios", (item) => String(item.ndcgExcludedScenarios)],
    ];
    for (const [label, format] of metrics) {
      rows.push(`${scope} (n=${result.scenarioCount}) & ${label} & ${format(valuesByMethod[0])} & ${format(valuesByMethod[1])} & ${format(valuesByMethod[2])} \\\\`);
    }
  }
  return [
    "\\begin{table*}[t]",
    "\\centering",
    `\\caption{Scenario-level macro-averages with metric values on the 0--1 scale except full-closure conflict (percent). Single-activity scenarios request K=${benchmarkData.protocol.kSingleActivity}; mixed-pool scenarios request K=${benchmarkData.protocol.kCombined}. Mean effective K and per-method undefined-scenario counts are shown. Category-specific rows exclude mixed activity; all-pool rows include it. Holdout rows are exploratory, not confirmatory.}`,
    "\\begin{tabular}{llrrr}",
    "\\toprule Cohort and scope & Metric (unit) & Method A & Method B & Method C \\\\ \\midrule",
    ...rows,
    "\\bottomrule",
    "\\end{tabular}",
    "\\end{table*}",
  ].join("\n");
}

function csvCell(value) {
  const text = value === null || value === undefined ? "N/A" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function generateExperimentCSV(benchmarkData) {
  const headers = [
    "Run_Timestamp", "Protocol_Version", "Data_Fingerprint", "As_Of_Date",
    "Scenario_ID", "Scenario_Scope", "Activity", "Month_Number", "Month_Name", "Split",
    "Candidate_Count", "MethodA_EligiblePool", "MethodB_EligiblePool", "MethodC_EligiblePool",
    "MethodA_IneligibleCount", "MethodB_IneligibleCount", "MethodC_IneligibleCount",
    "K_Requested", "MethodA_K_Evaluated", "MethodB_K_Evaluated", "MethodC_K_Evaluated",
    "MethodA_Precision_at_K", "MethodA_NDCG_at_K", "MethodA_FullClosureConflictRate",
    "MethodB_Precision_at_K", "MethodB_NDCG_at_K", "MethodB_FullClosureConflictRate",
    "MethodC_Precision_at_K", "MethodC_NDCG_at_K", "MethodC_FullClosureConflictRate",
    "MethodA_NDCG_Excluded", "MethodB_NDCG_Excluded", "MethodC_NDCG_Excluded",
    "MethodA_PartialRestrictionRate", "MethodB_PartialRestrictionRate", "MethodC_PartialRestrictionRate",
    "SeasonalDataCoverage", "RelevanceLabelCoverage", "CandidateApplicableDisruptionEvidenceCoverage",
    "MethodC_ExcludedDestinations", "MethodC_IneligibleDestinations", "MethodC_IgnoredDisruptionRecords",
    "MethodA_PrecisionStatus", "MethodA_PrecisionReason", "MethodA_NDCGStatus", "MethodA_NDCGReason",
    "MethodB_PrecisionStatus", "MethodB_PrecisionReason", "MethodB_NDCGStatus", "MethodB_NDCGReason",
    "MethodC_PrecisionStatus", "MethodC_PrecisionReason", "MethodC_NDCGStatus", "MethodC_NDCGReason",
    "MethodA_ClosureStatus", "MethodA_ClosureReason", "MethodB_ClosureStatus", "MethodB_ClosureReason",
    "MethodC_ClosureStatus", "MethodC_ClosureReason", "MethodA_PrecisionDenominator", "MethodB_PrecisionDenominator",
    "MethodC_PrecisionDenominator", "MethodA_NDCG_IDCG", "MethodB_NDCG_IDCG", "MethodC_NDCG_IDCG",
  ];
  const rows = benchmarkData.scenarios.map((scenario) => [
    benchmarkData.timestamp,
    benchmarkData.protocol.version,
    benchmarkData.dataVersion.fingerprint,
    benchmarkData.protocol.asOfDate,
    scenario.id,
    scenario.scope,
    scenario.activity,
    scenario.month,
    scenario.monthName,
    scenario.split,
    scenario.candidateCount,
    scenario.methodA.metrics.eligiblePoolCount,
    scenario.methodB.metrics.eligiblePoolCount,
    scenario.methodC.metrics.eligiblePoolCount,
    scenario.methodA.ranking._ineligible?.length ?? 0,
    scenario.methodB.ranking._ineligible?.length ?? 0,
    scenario.methodC.ranking._ineligible?.length ?? 0,
    scenario.k,
    scenario.methodA.metrics.k,
    scenario.methodB.metrics.k,
    scenario.methodC.metrics.k,
    scenario.methodA.metrics.precisionAtK,
    scenario.methodA.metrics.ndcgAtK,
    scenario.methodA.metrics.closureConflictRate,
    scenario.methodB.metrics.precisionAtK,
    scenario.methodB.metrics.ndcgAtK,
    scenario.methodB.metrics.closureConflictRate,
    scenario.methodC.metrics.precisionAtK,
    scenario.methodC.metrics.ndcgAtK,
    scenario.methodC.metrics.closureConflictRate,
    scenario.methodA.metrics.ndcgExcluded,
    scenario.methodB.metrics.ndcgExcluded,
    scenario.methodC.metrics.ndcgExcluded,
    scenario.methodA.metrics.partialRestrictionRate,
    scenario.methodB.metrics.partialRestrictionRate,
    scenario.methodC.metrics.partialRestrictionRate,
    scenario.coverage.seasonalDataCoverage,
    scenario.coverage.relevanceLabelCoverage,
    scenario.coverage.disruptionEvidenceCoverage,
    scenario.methodC.quarantined.map((item) => `${item.name} [${item.exclusionReason}]`).join(" | ") || "none",
    scenario.methodC.ranking._ineligible?.map((item) => `${item.name} [${item.dataQualityIssues.join("; ")}]`).join(" | ") || "none",
    scenario.methodC.ignoredDisruptions.map((item) => `${item.id}:${item.assessment}:${item.reason}`).join(" | ") || "none",
    ...[scenario.methodA, scenario.methodB, scenario.methodC].flatMap(({ metrics }) => [
      metrics.precisionAtKStatus, metrics.precisionAtKReasonCode, metrics.ndcgAtKStatus, metrics.ndcgAtKReasonCode,
    ]),
    ...[scenario.methodA, scenario.methodB, scenario.methodC].flatMap(({ metrics }) => [
      metrics.closureConflictStatus, metrics.closureConflictReasonCode,
    ]),
    scenario.methodA.metrics.precisionDenominator,
    scenario.methodB.metrics.precisionDenominator,
    scenario.methodC.metrics.precisionDenominator,
    scenario.methodA.metrics.ndcgDenominator,
    scenario.methodB.metrics.ndcgDenominator,
    scenario.methodC.metrics.ndcgDenominator,
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}
