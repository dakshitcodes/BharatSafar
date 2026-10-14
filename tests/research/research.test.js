import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  rankMethodBSeasonal,
  rankMethodCDisruptionAware,
  runRankingExperiment,
} from "../../src/research/algorithms/rankingEngine.js";
import {
  calculateClosureConflictRate,
  calculateClosureConflictMetric,
  calculateDCG,
  calculateIDCG,
  calculateNDCGAtK,
  calculatePartialRestrictionRate,
  calculatePrecisionAtK,
  calculateScenarioCoverage,
  evaluateRanking,
} from "../../src/research/evaluation/metrics.js";
import {
  generateLatexTable,
  generateExperimentCSV,
  runFullBenchmark,
} from "../../src/research/evaluation/runExperiment.js";
import {
  getConditionalTriggerStatus,
  getApplicableVerifiedDisruptions,
  getDisruptionEvidenceStatus,
  getDisruptionEventStatus,
  isDisruptionEffective,
} from "../../src/research/data/disruptionPolicy.js";

const asOfDate = "2026-10-14";
function destination(id, category = "trekking", popularityScore = 0.5) {
  return {
    id,
    name: id,
    category,
    popularityScore,
    monthlyData: { "7": { avgTempC: 20, rainfallMm: 20, scenicIndex: 0.8 } },
  };
}
function verifiedDisruption(overrides = {}) {
  return {
    id: "closure-1",
    destinationId: "closed",
    applicableMonths: [7],
    isAbsoluteClosure: true,
    restrictionScope: "FULL_DESTINATION",
    effectiveFrom: "2026-01-01",
    effectiveTo: "2026-12-31",
    evidence: {
      sourceUrl: "https://example.gov/notices/closure-1",
      sourceTitle: "Closure notice",
      issuingAuthority: "Example Authority",
      lastVerifiedAt: "2026-09-01",
      verificationStatus: "verified",
      claimSupported: true,
      scopeSupported: true,
      validThrough: "2026-12-31",
    },
    ...overrides,
  };
}
function csvColumnCount(row) {
  let quoted = false;
  let columns = 1;
  for (let index = 0; index < row.length; index += 1) {
    if (row[index] === '"' && quoted && row[index + 1] === '"') {
      index += 1;
    } else if (row[index] === '"') {
      quoted = !quoted;
    } else if (row[index] === "," && !quoted) {
      columns += 1;
    }
  }
  return columns;
}

test("mixed activity scoring uses the destination category's weather model", () => {
  const trekking = destination("trek", "trekking");
  const waterfalls = destination("falls", "waterfalls");
  const mixed = rankMethodBSeasonal([trekking, waterfalls], 7, "all");
  const trekkingOnly = rankMethodBSeasonal([trekking], 7, "trekking");
  assert.equal(mixed.find((item) => item.id === "trek").scoreBreakdown.weatherFit,
    trekkingOnly[0].scoreBreakdown.weatherFit);
  assert.equal(mixed.find((item) => item.id === "trek").scoreBreakdown.effectiveActivity, "trekking");
});

test("verified applicable full closure is quarantined out of eligible recommendations", () => {
  const candidates = [destination("closed"), destination("open")];
  const ranking = rankMethodCDisruptionAware(candidates, 7, "trekking", {
    disruptions: [verifiedDisruption()], asOfDate,
  });
  assert.equal(ranking.some((item) => item.id === "closed"), false);
  assert.equal(ranking._quarantined[0].id, "closed");
  assert.equal(ranking._quarantined[0].exclusionEvidence.sourceTitle, "Closure notice");
});

test("partial restrictions do not become full closures", () => {
  const partial = verifiedDisruption({
    isAbsoluteClosure: false,
    restrictionScope: "TRAIL_SECTION",
    appliesToActivities: ["trekking"],
    penaltyMultiplier: 0.5,
  });
  const ranking = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [partial], asOfDate,
  });
  assert.equal(ranking.length, 1);
  assert.equal(ranking._quarantined.length, 0);
  assert.notEqual(ranking[0].status, "OPEN_OPTIMAL");
  assert.equal(ranking[0].scoreBreakdown.disruptionPenalty, 0.5);
  const alternative = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [partial], asOfDate, partialPenaltyOverride: 0.25,
  });
  assert.equal(alternative[0].scoreBreakdown.disruptionPenalty, 0.25);
});

test("partial penalty requires matching destination, month, scope and activity", () => {
  const mismatch = verifiedDisruption({
    destinationId: "closed", isAbsoluteClosure: false,
    restrictionScope: "BOATING_AND_BATHING", appliesToActivities: ["trekking"],
    penaltyMultiplier: 0.1,
  });
  const result = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [mismatch], asOfDate,
  });
  assert.equal(result[0].scoreBreakdown.disruptionPenalty, 1);
  assert.equal(result[0].ignoredDisruptions[0].reason, "restriction-scope-does-not-match-activity");
});

test("applicable disruption lookup requires a concrete destination activity", () => {
  const closure = verifiedDisruption();
  assert.throws(() => getApplicableVerifiedDisruptions("closed", 7, [closure], asOfDate), TypeError);
  assert.equal(getApplicableVerifiedDisruptions("closed", 7, [closure], asOfDate, "trekking").length, 1);
});

test("partial restriction metric excludes scope mismatches", () => {
  const trekkingCandidate = destination("closed", "trekking");
  const boatingOnly = verifiedDisruption({
    isAbsoluteClosure: false,
    restrictionScope: "BOATING_AND_BATHING",
    appliesToActivities: ["waterfalls"],
  });
  assert.equal(calculatePartialRestrictionRate(
    [trekkingCandidate], 7, 1, [boatingOnly], asOfDate, [trekkingCandidate]
  ), null);
});

test("ranking methods and unified experiment reject invalid months and activities", () => {
  assert.throws(() => rankMethodBSeasonal([], 13, "all"), RangeError);
  assert.throws(() => rankMethodBSeasonal([], 1, "beaches"), TypeError);
  assert.throws(() => rankMethodCDisruptionAware([], 0, "trekking"), RangeError);
  assert.throws(() => rankMethodCDisruptionAware([], 1, "beaches"), TypeError);
  assert.throws(() => runRankingExperiment("beaches", 1), TypeError);
  assert.throws(() => runRankingExperiment(undefined, Number.NaN), RangeError);
  assert.equal(runRankingExperiment(undefined, 7).activity, "all");
});

test("seasonal weights are explicit design inputs with validated sensitivity", () => {
  const candidate = destination("weighted", "trekking", 1);
  candidate.monthlyData["7"].scenicIndex = 0.1;
  const defaultB = rankMethodBSeasonal([candidate], 7, "trekking")[0];
  const weatherHeavyB = rankMethodBSeasonal([candidate], 7, "trekking", {
    weights: { scenic: 0.1, weather: 0.8, popularity: 0.1 },
  })[0];
  const weatherHeavyC = rankMethodCDisruptionAware([candidate], 7, "trekking", {
    weights: { scenic: 0.1, weather: 0.8, popularity: 0.1 }, disruptions: [], asOfDate,
  })[0];
  assert.notEqual(defaultB.finalScore, weatherHeavyB.finalScore);
  assert.equal(weatherHeavyC.scoreBreakdown.baseSeasonalScore, weatherHeavyB.finalScore);
  assert.throws(() => rankMethodBSeasonal([candidate], 7, "trekking", {
    weights: { scenic: 1, weather: 1, popularity: 0 },
  }), RangeError);
  const benchmark = runFullBenchmark({ asOfDate });
  assert.equal(benchmark.protocol.seasonalWeights.scenic, 0.5);
  assert.equal(benchmark.seasonalWeightSensitivity.length, 3);
  assert.ok(benchmark.seasonalWeightSensitivity.every((item) => item.comparedScenarioCount > 0));
  assert.match(benchmark.seasonalWeightSensitivity[0].interpretation, /not optimized/);
});

test("partial penalty sensitivity override leaves full-closure filtering unchanged", () => {
  const fullClosure = verifiedDisruption({ id: "full", destinationId: "closed" });
  const partial = verifiedDisruption({
    id: "partial",
    destinationId: "open",
    isAbsoluteClosure: false,
    restrictionScope: "TRAIL_SECTION",
    appliesToActivities: ["trekking"],
    penaltyMultiplier: 0.5,
  });
  const candidates = [destination("closed"), destination("open")];
  const baseline = rankMethodCDisruptionAware(candidates, 7, "trekking", {
    disruptions: [fullClosure, partial], asOfDate,
  });
  const alternative = rankMethodCDisruptionAware(candidates, 7, "trekking", {
    disruptions: [fullClosure, partial], asOfDate, partialPenaltyOverride: 0.25,
  });
  assert.deepEqual(alternative._quarantined.map((item) => item.id), ["closed"]);
  assert.deepEqual(alternative._quarantined.map((item) => item.id), baseline._quarantined.map((item) => item.id));
  assert.equal(alternative.some((item) => item.id === "closed"), false);
  assert.equal(alternative.find((item) => item.id === "open").scoreBreakdown.disruptionPenalty, 0.25);
});

test("expired, unverified, unknown-scope, and untriggered conditional records are rejected", () => {
  const expired = verifiedDisruption();
  expired.evidence.lastVerifiedAt = "2026-01-01";
  const unverified = verifiedDisruption();
  unverified.evidence.verificationStatus = "unverified";
  const unknownScope = verifiedDisruption({ restrictionScope: "UNKNOWN" });
  const conditional = verifiedDisruption({ isConditional: true, triggerStatus: "unknown" });
  const invalidExpiry = verifiedDisruption();
  invalidExpiry.evidence.validThrough = "2026-02-30";
  for (const record of [expired, unverified, unknownScope, invalidExpiry]) {
    assert.equal(getDisruptionEvidenceStatus(record, asOfDate).usable, false);
  }
  assert.equal(getConditionalTriggerStatus(conditional, asOfDate).reason, "conditional-trigger-unconfirmed");
  const ranking = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [expired, unverified, unknownScope, conditional], asOfDate,
  });
  assert.equal(ranking.length, 1);
  assert.equal(ranking._quarantined.length, 0);
  assert.equal(ranking[0].disruptionAssessment, "UNKNOWN_RECORDS_PRESENT");
  assert.equal(ranking[0].ignoredDisruptions[0].assessment, "UNKNOWN");
});

test("event validity is independent from fresh evidence and future closures are not active", () => {
  const future = verifiedDisruption({ effectiveFrom: "2026-11-01" });
  assert.equal(getDisruptionEvidenceStatus(future, asOfDate).usable, true);
  assert.equal(getDisruptionEventStatus(future, asOfDate).reason, "not-yet-effective");
  assert.equal(isDisruptionEffective(future, asOfDate), false);
  const ranking = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [future], asOfDate,
  });
  assert.equal(ranking.length, 1);
  assert.equal(ranking._quarantined.length, 0);
  assert.equal(ranking[0].ignoredDisruptions[0].assessment, "NOT_CURRENTLY_EFFECTIVE");
});

test("missing event bounds are unknown rather than evidence that a restriction is active", () => {
  const undated = verifiedDisruption({ effectiveFrom: undefined, effectiveTo: undefined });
  assert.equal(isDisruptionEffective(undated, asOfDate), false);
  assert.equal(getDisruptionEventStatus(undated, asOfDate).reason, "event-validity-dates-missing");
});

test("conditional restrictions require a recent dated trigger assessment and direct evidence", () => {
  const conditional = verifiedDisruption({
    isAbsoluteClosure: false,
    restrictionScope: "TRAIL_SECTION",
    appliesToActivities: ["trekking"],
    isConditional: true,
    triggerStatus: "met",
    triggerCheckedAt: "2026-05-01",
    triggerEvidenceUrl: "https://example.gov/notices/trigger",
    triggerEvidenceTitle: "Trigger observation",
    triggerEvidenceAuthority: "Example Authority",
    triggerEvidenceClaimSupported: true,
  });
  assert.equal(getConditionalTriggerStatus(conditional, asOfDate).reason, "stale-trigger-assessment");
  const ranking = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [conditional], asOfDate,
  });
  assert.equal(ranking[0].scoreBreakdown.disruptionPenalty, 1);
  assert.equal(ranking[0].ignoredDisruptions[0].assessment, "UNKNOWN");
  conditional.triggerCheckedAt = "2026-10-01";
  assert.equal(getConditionalTriggerStatus(conditional, asOfDate).confirmed, true);
  const active = rankMethodCDisruptionAware([destination("closed")], 7, "trekking", {
    disruptions: [conditional], asOfDate,
  });
  assert.equal(active[0].scoreBreakdown.disruptionPenalty, 0.5);
});

test("closure-conflict rate uses only current evidence-backed full closures in the candidate pool", () => {
  const closure = verifiedDisruption();
  assert.equal(calculateClosureConflictRate([{ id: "closed" }], 7, 1, [closure], asOfDate), 1);
  const partial = verifiedDisruption({ isAbsoluteClosure: false, restrictionScope: "BOATING_AND_BATHING" });
  assert.equal(calculateClosureConflictRate([{ id: "closed" }], 7, 1, [partial], asOfDate), null);
  assert.equal(calculateClosureConflictRate([{ id: "other" }], 7, 1, [closure], asOfDate), null);
});

test("closure N/A results carry a reason and use the explicit scenario pool", () => {
  const closure = verifiedDisruption();
  assert.equal(calculateClosureConflictMetric([{ id: "open" }], 7, 1, [], asOfDate, [{ id: "open" }]).reasonCode,
    "NO_QUALIFYING_CLOSURE_RECORD");
  const unverified = verifiedDisruption();
  unverified.evidence.verificationStatus = "unverified";
  assert.equal(calculateClosureConflictMetric([{ id: "open" }], 7, 1, [unverified], asOfDate,
    [{ id: "closed" }, { id: "open" }]).reasonCode, "INSUFFICIENT_EVIDENCE");
  assert.equal(calculateClosureConflictMetric([], 7, 1, [closure], asOfDate,
    [{ id: "closed" }]).reasonCode, "NO_ELIGIBLE_RECOMMENDATIONS");
  assert.equal(calculateClosureConflictMetric([{ id: "open" }], 7, 1, [closure], asOfDate,
    [{ id: "closed" }, { id: "open" }]).value, 0);
});

test("missing relevance labels remain undefined rather than grade zero", () => {
  const labels = { ratings: { known: { monthlyGrades: { "7": { grade: 0 } } } } };
  const ranked = [{ id: "unknown" }, { id: "known" }];
  assert.equal(calculatePrecisionAtK(ranked, 7, 2, 2, labels), null);
  assert.equal(calculateNDCGAtK(ranked, ranked, 7, 2, labels), null);
});

test("precision and NDCG match hand-calculated three-item examples", () => {
  const candidates = [{ id: "grade-3" }, { id: "grade-2" }, { id: "grade-0" }];
  const labels = { ratings: {
    "grade-3": { monthlyGrades: { "7": { grade: 3 } } },
    "grade-2": { monthlyGrades: { "7": { grade: 2 } } },
    "grade-0": { monthlyGrades: { "7": { grade: 0 } } },
  } };
  assert.equal(calculatePrecisionAtK(candidates, 7, 3, 2, labels), 0.6667);

  const nonIdealRanking = [candidates[1], candidates[0], candidates[2]];
  const expectedDcg = 3 + 7 / Math.log2(3);
  const expectedIdcg = 7 + 3 / Math.log2(3);
  assert.ok(Math.abs(calculateDCG(nonIdealRanking, 7, 3, labels) - expectedDcg) < 1e-12);
  assert.ok(Math.abs(calculateIDCG(candidates, 7, 3, labels) - expectedIdcg) < 1e-12);
  assert.equal(calculateNDCGAtK(nonIdealRanking, candidates, 7, 3, labels), 0.834);
});

test("empty eligible recommendation lists return undefined metrics without throwing", () => {
  assert.equal(calculatePrecisionAtK([], 7, 3, 2, { ratings: {} }, []), null);
  assert.equal(calculateNDCGAtK([], [], 7, 3, { ratings: {} }), null);
  assert.equal(calculateClosureConflictMetric([], 7, 3, [], asOfDate, []).reasonCode,
    "NO_ELIGIBLE_RECOMMENDATIONS");
});

test("missing labels outside top K also make relevance metrics undefined with explicit status", () => {
  const candidates = [{ id: "known" }, { id: "also-known" }, { id: "unlabeled" }];
  const labels = { ratings: {
    known: { monthlyGrades: { "7": { grade: 3 } } },
    "also-known": { monthlyGrades: { "7": { grade: 2 } } },
  } };
  const metrics = evaluateRanking([{ id: "known" }], candidates, 7, 1, { labels, disruptions: [] });
  assert.equal(metrics.precisionAtK, null);
  assert.equal(metrics.ndcgAtK, null);
  assert.equal(metrics.precisionAtKReasonCode, "MISSING_RELEVANCE_LABELS");
  assert.equal(metrics.ndcgAtKReasonCode, "MISSING_RELEVANCE_LABELS");
  assert.equal(metrics.precisionDenominator, 1);
  assert.equal(metrics.unlabeledCandidateCount, 1);
});

test("ranking methods expose consistent audit lists for candidate-universe evaluation", () => {
  const candidates = [destination("closed"), destination("open")];
  const methodB = rankMethodBSeasonal(candidates, 7, "trekking");
  const methodC = rankMethodCDisruptionAware(candidates, 7, "trekking", {
    disruptions: [verifiedDisruption()], asOfDate,
  });
  assert.deepEqual(methodB._ineligible, []);
  assert.deepEqual(methodC._allScored.map((item) => item.id).sort(), ["closed", "open"]);
  assert.deepEqual(methodC._quarantined.map((item) => item.id), ["closed"]);
  assert.deepEqual(methodC._ineligible, []);
  const metricsC = evaluateRanking(methodC, candidates, 7, 1, {
    labels: { ratings: {
      closed: { monthlyGrades: { "7": { grade: 3 } } },
      open: { monthlyGrades: { "7": { grade: 2 } } },
    } }, disruptions: [verifiedDisruption()], asOfDate,
  });
  assert.equal(metricsC.ndcgIdealPoolCount, 2);
});

test("scenario disruption coverage respects candidate and explicit activity scope", () => {
  const candidates = [destination("in-pool", "trekking"), destination("outside-pool", "waterfalls")];
  const applicable = verifiedDisruption({
    destinationId: "in-pool", isAbsoluteClosure: false,
    restrictionScope: "SPECIFIC_ACTIVITY", appliesToActivities: ["trekking"],
  });
  const outOfScope = verifiedDisruption({
    id: "out-of-scope", destinationId: "in-pool", isAbsoluteClosure: false,
    restrictionScope: "SPECIFIC_ACTIVITY", appliesToActivities: ["waterfalls"],
  });
  const outside = verifiedDisruption({ destinationId: "outside-pool" });
  const coverage = calculateScenarioCoverage(candidates.slice(0, 1), 7, {
    disruptions: [applicable, outOfScope, outside],
  });
  assert.equal(coverage.activeDisruptionRecordCount, 1);
  assert.equal(coverage.evidenceBackedDisruptionRecordCount, 1);
  assert.equal(coverage.disruptionEvidenceCoverage, 1);
  assert.equal(coverage.popularityDataCoverage, 1);
});

test("zero ideal DCG is undefined under the exclusion policy", () => {
  const labels = { ratings: { a: { monthlyGrades: { "7": { grade: 0 } } } } };
  assert.equal(calculateNDCGAtK([{ id: "a" }], [{ id: "a" }], 7, 1, labels), null);
});

test("benchmark scenario K values are explicit and match all metric cutoffs", () => {
  const benchmark = runFullBenchmark({ asOfDate });
  assert.ok(benchmark.scenarios.every((scenario) =>
    scenario.methodA.metrics.requestedK === scenario.k &&
    scenario.methodB.metrics.requestedK === scenario.k &&
    scenario.methodC.metrics.requestedK === scenario.k));
  assert.equal(benchmark.scenarios.find((scenario) => scenario.activity === "all").k, 5);
  assert.equal(benchmark.scenarios.find((scenario) => scenario.activity === "trekking").k, 3);
});

test("invalid K and holdout month options are rejected", () => {
  assert.throws(() => runFullBenchmark({ kCombined: 0 }), RangeError);
  assert.throws(() => runFullBenchmark({ kSingleActivity: 1.5 }), RangeError);
  assert.throws(() => runFullBenchmark({ holdoutMonths: [2, 2] }), RangeError);
  assert.throws(() => runFullBenchmark({ holdoutMonths: [0, 13] }), RangeError);
  assert.throws(() => runFullBenchmark({ holdoutMonths: "Feb" }), RangeError);
  assert.deepEqual(runFullBenchmark({ holdoutMonths: [11, 2] }).protocol.holdoutMonths, [2, 11]);
});

test("benchmark scenario and CSV row counts match (36 total, 24 category-specific)", () => {
  const benchmark = runFullBenchmark({ asOfDate });
  const csvLines = generateExperimentCSV(benchmark).trim().split(/\r?\n/);
  assert.equal(benchmark.scenarios.length, 36);
  assert.equal(benchmark.aggregateResults.categorySpecific.scenarioCount, 24);
  assert.equal(benchmark.aggregateResults.overall.scenarioCount, 36);
  assert.equal(csvLines.length - 1, 36);
  assert.match(csvLines[0], /K_Requested/);
  assert.ok(csvLines.every((row) => csvColumnCount(row) === csvColumnCount(csvLines[0])));
  assert.equal(benchmark.dataCoverage.destinationMonthLabelCount, 108);
  assert.equal(benchmark.dataCoverage.evidenceBackedDisruptionRecordCount, 0);
  assert.equal(benchmark.dataVersion.fingerprint, runFullBenchmark({ asOfDate }).dataVersion.fingerprint);
  assert.deepEqual(benchmark.aggregateResults.overall.coverage.ndcgExcludedScenarios,
    { methodA: 0, methodB: 0, methodC: 0 });
  assert.equal(benchmark.penaltySensitivity[0].uniqueEvidenceBackedPartialRestrictionRecordCount, 0);
  assert.equal(benchmark.penaltySensitivity[0].excludedScenarioCount, 36);
  assert.match(csvLines[0], /CandidateApplicableDisruptionEvidenceCoverage/);
  assert.match(csvLines[0], /Scenario_Scope/);
  const latex = generateLatexTable(benchmark);
  assert.match(latex, /All-pool total \(includes mixed pool\)/);
  assert.match(latex, /Mean effective K/);
  assert.match(latex, /Undefined NDCG@K scenarios/);
  assert.match(latex, /Holdout rows are exploratory/);
  assert.match(latex, /0\.9776/);
  assert.doesNotMatch(latex, /null/);
});

test("repeated benchmark runs with identical inputs produce identical rankings and metrics", () => {
  const first = runFullBenchmark({ asOfDate, kCombined: 5, kSingleActivity: 3 });
  const second = runFullBenchmark({ asOfDate, kCombined: 5, kSingleActivity: 3 });
  assert.deepEqual(first.scenarios, second.scenarios);
});

test("research interface contains no hardcoded safety guarantee or closure metric", () => {
  const page = readFileSync(new URL("../../src/pages/ResearchLabPage.jsx", import.meta.url), "utf8");
  assert.doesNotMatch(page, /Verified Safe|100% Invariant Compliant|Safe & Optimal|Legally Closed/);
  assert.doesNotMatch(page, /0\.0% \(supplied records\)/);
  assert.match(page, /UNKNOWN means the record does not establish that conditions are clear/);
});

test("missing seasonal inputs are exposed and do not receive imputed scores", () => {
  const incomplete = destination("incomplete");
  delete incomplete.monthlyData["7"].rainfallMm;
  const result = rankMethodBSeasonal([incomplete], 7, "trekking")[0];
  assert.equal(result, undefined);
  assert.ok(rankMethodBSeasonal([incomplete], 7, "trekking")._ineligible[0].dataQualityIssues.includes("rainfallMm"));
});
