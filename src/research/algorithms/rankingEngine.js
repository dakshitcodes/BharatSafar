/**
 * BharatVerse / BharatSafar Research Benchmark Engine
 *
 * Formal implementations of the three comparative recommendation methods:
 * - Method A: Popularity-Based Baseline
 * - Method B: Seasonal-Aware Multi-Criteria Scoring
 * - Method C: Disruption-Aware Seasonal Ranking (Proposed)
 *
 * RESEARCH INTEGRITY NOTES (2026-10-14):
 * 1. calculateWeatherComfort() uses activity === "all" fallback: when a combined
 *    pool is evaluated, each destination's own category is passed in (see callers).
 * 2. Method C separates eligibility (supplied absolute-closure records) from ranking.
 *    Closed destinations are quarantined into a separate list and CANNOT appear
 *    in the actionable top-K. This is a tested algorithmic property under the
 *    supplied disruption data; it does not prove universal real-world safety.
 * 3. Penalty multipliers for partial disruptions are documented design parameters,
 *    not empirically validated weights. See disruptionsData.js for disruption scope.
 */

import { destinationsData } from "../data/destinationsData.js";
import { disruptionsData } from "../data/disruptionsData.js";
import {
  DISRUPTION_POLICY,
  getActivityApplicability,
  getApplicableVerifiedDisruptions,
  getConditionalTriggerStatus,
  getDisruptionEvidenceStatus,
  getDisruptionEventStatus,
  isVerifiedFullClosure,
} from "../data/disruptionPolicy.js";

const VALID_ACTIVITIES = new Set(["waterfalls", "trekking", "all"]);
export const DEFAULT_SEASONAL_WEIGHTS = Object.freeze({ scenic: 0.5, weather: 0.3, popularity: 0.2 });

function validateRankingInputs(month, activity) {
  const monthNumber = Number(month);
  if (!Number.isInteger(monthNumber) || monthNumber < 1 || monthNumber > 12) {
    throw new RangeError("month must be an integer from 1 to 12.");
  }
  if (!VALID_ACTIVITIES.has(activity)) {
    throw new TypeError('activity must be "waterfalls", "trekking", or "all".');
  }
  return monthNumber;
}

function validateSeasonalWeights(weights = DEFAULT_SEASONAL_WEIGHTS) {
  if (!weights || typeof weights !== "object") {
    throw new RangeError("Seasonal weights must be an object of finite proportions that sum to 1.");
  }
  const values = [weights.scenic, weights.weather, weights.popularity];
  if (values.some((weight) => !Number.isFinite(weight) || weight < 0) ||
      Math.abs(values.reduce((sum, weight) => sum + weight, 0) - 1) > 1e-9) {
    throw new RangeError("Seasonal weights must be finite, non-negative, and sum to 1.");
  }
  return weights;
}

function combineSeasonalScore(scenic, weather, popularity, weights) {
  return weights.scenic * scenic + weights.weather * weather + weights.popularity * popularity;
}

/**
 * Calculates environmental weather comfort score [0, 1].
 * activity must be exactly "trekking" or "waterfalls".
 * The "all" pool case is handled by callers, which pass dest.category.
 *
 * Thresholds:
 *   Trekking – ideal temp 0–22°C; ideal rain <50mm/month.
 *   Waterfalls – ideal temp 18–29°C; moderate–high rainfall benefits flow.
 */
export function calculateWeatherComfort(tempC, rainfallMm, activity) {
  if (!Number.isFinite(tempC) || !Number.isFinite(rainfallMm)) {
    throw new TypeError("Weather scoring requires finite temperature and rainfall values.");
  }
  if (activity !== "trekking" && activity !== "waterfalls") {
    throw new TypeError(`Unsupported activity category: ${activity}`);
  }
  let tempScore = 1.0;
  let rainScore = 1.0;

  if (activity === "trekking") {
    // Trekking temperature preference
    if (tempC < -10) tempScore = 0.2;
    else if (tempC < 0) tempScore = 0.55;
    else if (tempC >= 0 && tempC <= 22) tempScore = 1.0;
    else if (tempC <= 28) tempScore = 0.75;
    else if (tempC <= 34) tempScore = 0.45;
    else tempScore = 0.15;

    // Trekking rainfall penalty — >300mm/month causes trail degradation / landslide risk
    if (rainfallMm <= 50) rainScore = 1.0;
    else if (rainfallMm <= 120) rainScore = 0.8;
    else if (rainfallMm <= 250) rainScore = 0.5;
    else if (rainfallMm <= 500) rainScore = 0.2;
    else rainScore = 0.05;

    return 0.5 * tempScore + 0.5 * rainScore;
  } else if (activity === "waterfalls") {
    // Waterfall category: moderate–high rainfall recharges flow; extreme torrential
    // (>1500mm) causes fog / dangerous currents.
    if (tempC < 10) tempScore = 0.6;
    else if (tempC >= 18 && tempC <= 29) tempScore = 1.0;
    else if (tempC <= 34) tempScore = 0.8;
    else tempScore = 0.4;

    if (rainfallMm <= 10) rainScore = 0.3;       // likely dry / thin flow
    else if (rainfallMm <= 100) rainScore = 0.6;
    else if (rainfallMm <= 500) rainScore = 0.95;
    else if (rainfallMm <= 1000) rainScore = 1.0;
    else rainScore = 0.85;                        // torrential downpour

    return 0.4 * tempScore + 0.6 * rainScore;
  }
}

/**
 * Checks active disruptions for a destination in a given month.
 * Returns supplied records for audit. Ranking logic separately applies the
 * evidence, freshness, scope, and conditional-trigger policy.
 */
export function getActiveDisruptions(destinationId, month, records = disruptionsData) {
  const monthNum = Number(month);
  return records.filter(
    (d) =>
      d.destinationId === destinationId &&
      Array.isArray(d.applicableMonths) &&
      d.applicableMonths.includes(monthNum)
  );
}

function dataQualityIssues(destination, month, includeSeasonal = false) {
  const issues = [];
  if (!Number.isFinite(destination.popularityScore)) issues.push("popularityScore");
  if (includeSeasonal) {
    const monthly = destination.monthlyData?.[String(month)];
    if (!Number.isFinite(monthly?.avgTempC)) issues.push("avgTempC");
    if (!Number.isFinite(monthly?.rainfallMm)) issues.push("rainfallMm");
    if (!Number.isFinite(monthly?.scenicIndex) || monthly.scenicIndex < 0 || monthly.scenicIndex > 1) {
      issues.push("scenicIndex");
    }
    if (!destination.category) issues.push("category");
  }
  return issues;
}

function compareRankings(a, b) {
  const aHasScore = Number.isFinite(a.finalScore);
  const bHasScore = Number.isFinite(b.finalScore);
  if (aHasScore !== bHasScore) return aHasScore ? -1 : 1;
  if (aHasScore && b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
  const aPopularity = Number.isFinite(a.popularityScore) ? a.popularityScore : -Infinity;
  const bPopularity = Number.isFinite(b.popularityScore) ? b.popularityScore : -Infinity;
  if (bPopularity !== aPopularity) return bPopularity - aPopularity;
  return String(a.id).localeCompare(String(b.id));
}

/**
 * METHOD A: Popularity-Based Baseline
 * Ranks destinations solely by historical popularity score.
 * Does NOT check seasonal fit or disruptions — serves as the naive baseline.
 */
export function rankMethodAPopularity(candidates) {
  const scored = [...candidates]
    .map((dest) => {
      const issues = dataQualityIssues(dest, null);
      return {
        ...dest,
        method: "Method A (Popularity)",
        finalScore: issues.length ? null : dest.popularityScore,
        scoreBreakdown: { popularity: issues.length ? null : dest.popularityScore },
        dataQualityIssues: issues,
        status: "NOT_EVALUATED_FOR_DISRUPTIONS",
        hasClosure: false,
      };
    })
    .sort(compareRankings);
  const eligible = scored.filter((item) => Number.isFinite(item.finalScore));
  eligible._ineligible = scored.filter((item) => !Number.isFinite(item.finalScore));
  return eligible;
}

/**
 * METHOD B: Seasonal-Aware Multi-Criteria Scoring
 * Considers activity- and month-specific weather and scenic trail factors.
 * Does NOT consult disruption records — represents seasonal-only improvement.
 *
 * FIX (2026-10-14): When activity === "all", use each destination's own category
 * for weather scoring so that trekking destinations are not evaluated with the
 * waterfall weather model.
 */
export function rankMethodBSeasonal(candidates, month, activity, { weights = DEFAULT_SEASONAL_WEIGHTS } = {}) {
  month = validateRankingInputs(month, activity);
  weights = validateSeasonalWeights(weights);
  const monthKey = String(month);

  const scored = [...candidates]
    .map((dest) => {
      const mData = dest.monthlyData?.[monthKey] || {};

      // BUGFIX: resolve per-destination activity for combined pool
      const effectiveActivity = activity === "all" ? dest.category : activity;
      const issues = dataQualityIssues(dest, month, true);
      if (effectiveActivity !== "trekking" && effectiveActivity !== "waterfalls") {
        issues.push("unsupportedCategory");
      }

      const weatherFit = issues.length
        ? null
        : calculateWeatherComfort(mData.avgTempC, mData.rainfallMm, effectiveActivity);
      const scenicFit = Number.isFinite(mData.scenicIndex) ? mData.scenicIndex : null;
      const popularity = Number.isFinite(dest.popularityScore) ? dest.popularityScore : null;

      // Design weights (50% scenic/flow, 30% weather, 20% popularity);
      // these are not empirically optimized. See benchmark sensitivity output.
      const seasonalScore = issues.length
        ? null
        : combineSeasonalScore(scenicFit, weatherFit, popularity, weights);

      return {
        ...dest,
        method: "Method B (Seasonal)",
        finalScore: seasonalScore === null ? null : parseFloat(seasonalScore.toFixed(4)),
        scoreBreakdown: {
          popularity,
          weatherFit: weatherFit === null ? null : parseFloat(weatherFit.toFixed(4)),
          scenicFit,
          seasonalScore: seasonalScore === null ? null : parseFloat(seasonalScore.toFixed(4)),
          disruptionPenalty: null,
          effectiveActivity,
          weights,
        },
        status: "UNCHECKED",
        hasClosure: false,
        dataQualityIssues: issues,
      };
    })
    .sort(compareRankings);
  const eligible = scored.filter((item) => Number.isFinite(item.finalScore));
  eligible._ineligible = scored.filter((item) => !Number.isFinite(item.finalScore));
  return eligible;
}

/**
 * METHOD C: Disruption-Aware Seasonal Ranking (Proposed)
 * Applies seasonal multi-criteria scoring and excludes items matching supplied absolute-closure records.
 *
 * KEY DESIGN RULES (2026-10-14):
 * 1. ELIGIBILITY FILTER: Destinations with a matching isAbsoluteClosure record are
 *    quarantined into `quarantinedClosedItems` and physically excluded from
 *    `actionableRecommendations`. They CANNOT appear in the returned top-K.
 * 2. PARTIAL RESTRICTIONS: Non-absolute disruptions (bans, warnings) reduce the base
 *    seasonal score multiplicatively. The penalty multiplier and scope are documented
 *    in disruptionsData.js.
 * 3. COMBINED POOL: Per-destination activity category is used for weather scoring.
 * 4. SAFETY CLAIM SCOPE: Closure-conflict rate is undefined when the candidate pool
 *    has no current, evidence-backed full-closure reference. A measured zero would
 *    describe only the supplied records and would not prove real-world safety.
 *
 * Returns an actionable array with audit metadata: _quarantined and _allScored.
 */
export function rankMethodCDisruptionAware(
  candidates,
  month,
  activity,
  {
    disruptions = disruptionsData,
    asOfDate = DISRUPTION_POLICY.asOfDate,
    partialPenaltyOverride = null,
    weights = DEFAULT_SEASONAL_WEIGHTS,
  } = {}
) {
  month = validateRankingInputs(month, activity);
  weights = validateSeasonalWeights(weights);
  const monthKey = String(month);

  const allScoredItems = [...candidates].map((dest) => {
    const mData = dest.monthlyData?.[monthKey] || {};

    // BUGFIX: resolve per-destination activity for combined pool
    const effectiveActivity = activity === "all" ? dest.category : activity;
    const issues = dataQualityIssues(dest, month, true);
    if (effectiveActivity !== "trekking" && effectiveActivity !== "waterfalls") {
      issues.push("unsupportedCategory");
    }
    const hasBaseScore = issues.length === 0;
    const weatherFit = hasBaseScore
      ? calculateWeatherComfort(mData.avgTempC, mData.rainfallMm, effectiveActivity)
      : null;
    const scenicFit = Number.isFinite(mData.scenicIndex) ? mData.scenicIndex : null;
    const popularity = Number.isFinite(dest.popularityScore) ? dest.popularityScore : null;
    const baseSeasonalScore = hasBaseScore
      ? combineSeasonalScore(scenicFit, weatherFit, popularity, weights)
      : null;

    const activeSuppliedDisruptions = getActiveDisruptions(dest.id, month, disruptions);
    const activeDisruptions = getApplicableVerifiedDisruptions(
      dest.id,
      month,
      disruptions,
      asOfDate,
      effectiveActivity
    );
    const ignoredDisruptions = activeSuppliedDisruptions
      .filter((record) => !activeDisruptions.includes(record))
      .map((record) => {
        const evidence = getDisruptionEvidenceStatus(record, asOfDate);
        const event = getDisruptionEventStatus(record, asOfDate);
        const trigger = getConditionalTriggerStatus(record, asOfDate);
        const applicability = getActivityApplicability(record, effectiveActivity);
        const reason = !evidence.usable ? evidence.reason
          : !event.effective ? event.reason
            : !trigger.confirmed ? trigger.reason : applicability.reason;
        const assessment = !evidence.usable || !event.known ||
          ["stale-trigger-assessment", "invalid-trigger-assessment-date", "missing-trigger-evidence", "incomplete-trigger-evidence"].includes(trigger.reason)
          ? "UNKNOWN"
          : !event.effective ? "NOT_CURRENTLY_EFFECTIVE"
            : !trigger.confirmed ? "UNKNOWN"
              : "OUT_OF_SCOPE";
        return { id: record.id, title: record.title, assessment, reason };
      });
    const fullClosures = activeDisruptions.filter((record) =>
      isVerifiedFullClosure(record, asOfDate)
    );
    const hasAbsoluteClosure = fullClosures.length > 0;

    let finalScore = hasBaseScore ? 0 : null;
    let status = hasBaseScore ? "NO_QUALIFYING_DISRUPTION_APPLIED" : "MISSING_DATA";
    let disruptionPenalty = 1.0;

    if (hasAbsoluteClosure) {
      // Eligibility rule: a supplied absolute-closure record overrides all scores.
      // This destination will be moved to quarantinedClosedItems below.
      finalScore = 0.0;
      status = "CLOSED";
      disruptionPenalty = 0.0;
    } else if (hasBaseScore && activeDisruptions.length > 0) {
      // Design weights; use sensitivity analysis before treating them as validated.
      disruptionPenalty = activeDisruptions.reduce((acc, curr) => {
        // Sensitivity overrides apply only to partial restrictions. A
        // destination- or scope-specific absolute rule keeps its configured
        // multiplier, and a verified full-destination closure was already
        // handled by the eligibility filter above.
        const multiplier = curr.isAbsoluteClosure === true
          ? (curr.penaltyMultiplier ?? 1)
          : (Number.isFinite(partialPenaltyOverride)
            ? partialPenaltyOverride
            : (curr.penaltyMultiplier ?? 0.5));
        return acc * multiplier;
      }, 1.0);
      finalScore = parseFloat((baseSeasonalScore * disruptionPenalty).toFixed(4));
      status = "WARNING";
    } else {
      finalScore = baseSeasonalScore === null ? null : parseFloat(baseSeasonalScore.toFixed(4));
      status = hasBaseScore ? "NO_QUALIFYING_DISRUPTION_APPLIED" : "MISSING_DATA";
    }

    return {
      ...dest,
      method: "Method C (Disruption-Aware)",
      finalScore,
      scoreBreakdown: {
        popularity,
        weatherFit: weatherFit === null ? null : parseFloat(weatherFit.toFixed(4)),
        scenicFit,
        baseSeasonalScore: baseSeasonalScore === null ? null : parseFloat(baseSeasonalScore.toFixed(4)),
        disruptionPenalty: parseFloat(disruptionPenalty.toFixed(4)),
        effectiveActivity,
        weights,
      },
      status,
      disruptionAssessment: ignoredDisruptions.some((record) => record.assessment === "UNKNOWN")
        ? "UNKNOWN_RECORDS_PRESENT"
        : activeDisruptions.length
          ? "QUALIFYING_RECORDS_APPLIED"
          : activeSuppliedDisruptions.length
            ? "NO_QUALIFYING_RECORD_APPLIES"
            : "NO_RECORD_SUPPLIED",
      hasClosure: hasAbsoluteClosure,
      activeDisruptions,
      ignoredDisruptions,
      exclusionReason: hasAbsoluteClosure ? "verified-full-destination-closure" : null,
      dataQualityIssues: issues,
    };
  });

  // ELIGIBILITY SEPARATION: quarantine closed items — they cannot appear in top-K
  const quarantinedClosedItems = allScoredItems
    .filter((d) => d.hasClosure)
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((destination) => ({
      ...destination,
      exclusionEvidence: destination.activeDisruptions.find((record) =>
        isVerifiedFullClosure(record, asOfDate)
      )?.evidence ?? null,
    }));

  const actionableRecommendations = allScoredItems
    .filter((d) => !d.hasClosure && Number.isFinite(d.finalScore))
    .sort(compareRankings);
  const ineligibleItems = allScoredItems
    .filter((d) => !d.hasClosure && !Number.isFinite(d.finalScore))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));

  // Attach metadata so callers can access both lists
  actionableRecommendations._quarantined = quarantinedClosedItems;
  actionableRecommendations._ineligible = ineligibleItems;
  actionableRecommendations._allScored = allScoredItems;

  return actionableRecommendations;
}

/**
 * Unified execution function that retrieves candidate destinations and executes all three methods.
 */
export function runRankingExperiment(activity = "all", month) {
  month = validateRankingInputs(month, activity);
  const candidates = destinationsData.filter(
    (d) => !activity || activity === "all" || d.category === activity
  );

  const methodA = rankMethodAPopularity(candidates);
  const methodB = rankMethodBSeasonal(candidates, month, activity);
  const methodC = rankMethodCDisruptionAware(candidates, month, activity);

  return {
    activity,
    month: Number(month),
    candidateCount: candidates.length,
    rankings: {
      methodA,
      methodB,
      methodC,
      methodCQuarantined: methodC._quarantined || [],
    },
  };
}
