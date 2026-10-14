/**
 * BharatVerse / BharatSafar Research Benchmark Engine
 * 
 * Formal implementations of the three comparative recommendation methods:
 * - Method A: Popularity-Based Baseline
 * - Method B: Seasonal-Aware Multi-Criteria Scoring
 * - Method C: Disruption-Aware Seasonal Ranking (Proposed)
 */

import { destinationsData } from "../data/destinationsData.js";
import { disruptionsData } from "../data/disruptionsData.js";

/**
 * Normalizes a value to [0, 1] given min and max
 */
export function normalize(val, min, max) {
  if (max === min) return 1.0;
  return Math.max(0, Math.min(1, (val - min) / (max - min)));
}

/**
 * Calculates environmental weather comfort score [0, 1]
 */
export function calculateWeatherComfort(tempC, rainfallMm, activity) {
  let tempScore = 1.0;
  let rainScore = 1.0;

  if (activity === "trekking") {
    // Ideal trekking temp: 10C - 20C. Sub-zero or >32C penalized.
    if (tempC < -10) tempScore = 0.2;
    else if (tempC < 0) tempScore = 0.55;
    else if (tempC >= 0 && tempC <= 22) tempScore = 1.0;
    else if (tempC <= 28) tempScore = 0.75;
    else if (tempC <= 34) tempScore = 0.45;
    else tempScore = 0.15;

    // Ideal trekking rain: <50mm. >300mm causes severe trail degradation/landslides.
    if (rainfallMm <= 50) rainScore = 1.0;
    else if (rainfallMm <= 120) rainScore = 0.8;
    else if (rainfallMm <= 250) rainScore = 0.5;
    else if (rainfallMm <= 500) rainScore = 0.2;
    else rainScore = 0.05;

    return 0.5 * tempScore + 0.5 * rainScore;
  } else {
    // Waterfalls:
    // Ideal temp: 20C - 30C
    if (tempC < 10) tempScore = 0.6;
    else if (tempC >= 18 && tempC <= 29) tempScore = 1.0;
    else if (tempC <= 34) tempScore = 0.8;
    else tempScore = 0.4;

    // Waterfalls benefit from rainfall for recharge, but extreme torrential >1500mm causes fog/danger
    if (rainfallMm <= 10) rainScore = 0.3; // likely dry
    else if (rainfallMm <= 100) rainScore = 0.6;
    else if (rainfallMm <= 500) rainScore = 0.95;
    else if (rainfallMm <= 1000) rainScore = 1.0;
    else rainScore = 0.85; // torrential downpour

    return 0.4 * tempScore + 0.6 * rainScore;
  }
}

/**
 * Checks active disruptions for a destination in a given month
 */
export function getActiveDisruptions(destinationId, month) {
  const monthNum = Number(month);
  return disruptionsData.filter(
    (d) => d.destinationId === destinationId && d.applicableMonths.includes(monthNum)
  );
}

/**
 * METHOD A: Popularity-Based Baseline
 * Ranks destinations solely by historical popularity score.
 */
export function rankMethodAPopularity(candidates) {
  return [...candidates]
    .map((dest) => ({
      ...dest,
      method: "Method A (Popularity)",
      finalScore: dest.popularityScore,
      scoreBreakdown: {
        popularity: dest.popularityScore,
        seasonal: null,
        disruptionPenalty: null,
      },
      status: "UNCHECKED",
      hasClosure: false,
    }))
    .sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * METHOD B: Seasonal-Aware Multi-Criteria Scoring
 * Considers activity- and month-specific weather and scenic trail factors.
 */
export function rankMethodBSeasonal(candidates, month, activity) {
  const monthKey = String(month);

  return [...candidates]
    .map((dest) => {
      const mData = dest.monthlyData[monthKey] || {};
      const weatherFit = calculateWeatherComfort(
        mData.avgTempC ?? 25,
        mData.rainfallMm ?? 50,
        activity
      );
      const scenicFit = mData.scenicIndex ?? 0.5;
      const popularity = dest.popularityScore;

      // Method B Weighting: 50% scenic/flow, 30% weather, 20% popularity
      const seasonalScore = 0.5 * scenicFit + 0.3 * weatherFit + 0.2 * popularity;

      return {
        ...dest,
        method: "Method B (Seasonal)",
        finalScore: parseFloat(seasonalScore.toFixed(4)),
        scoreBreakdown: {
          popularity,
          weatherFit: parseFloat(weatherFit.toFixed(4)),
          scenicFit,
          seasonalScore: parseFloat(seasonalScore.toFixed(4)),
          disruptionPenalty: null,
        },
        status: "UNCHECKED",
        hasClosure: false,
      };
    })
    .sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      return b.popularityScore - a.popularityScore;
    });
}

/**
 * METHOD C: Disruption-Aware Seasonal Ranking (Proposed)
 * Applies seasonal multi-criteria scoring combined with verified safety & closure invariants.
 */
export function rankMethodCDisruptionAware(candidates, month, activity) {
  const monthKey = String(month);

  return [...candidates]
    .map((dest) => {
      const mData = dest.monthlyData[monthKey] || {};
      const weatherFit = calculateWeatherComfort(
        mData.avgTempC ?? 25,
        mData.rainfallMm ?? 50,
        activity
      );
      const scenicFit = mData.scenicIndex ?? 0.5;
      const popularity = dest.popularityScore;
      const baseSeasonalScore = 0.5 * scenicFit + 0.3 * weatherFit + 0.2 * popularity;

      const activeDisruptions = getActiveDisruptions(dest.id, month);
      const hasAbsoluteClosure = activeDisruptions.some((d) => d.isAbsoluteClosure);

      let finalScore = 0;
      let status = "OPEN_OPTIMAL";
      let disruptionPenalty = 1.0;

      if (hasAbsoluteClosure) {
        // HARD SAFETY INVARIANT: Absolute closure overrides any seasonal suitability.
        finalScore = 0.0;
        status = "CLOSED";
        disruptionPenalty = 0.0;
      } else if (activeDisruptions.length > 0) {
        // Multiplicative safety degradation for partial bans and warnings
        disruptionPenalty = activeDisruptions.reduce(
          (acc, curr) => acc * (curr.penaltyMultiplier ?? 0.5),
          1.0
        );
        finalScore = parseFloat((baseSeasonalScore * disruptionPenalty).toFixed(4));
        status = "WARNING";
      } else {
        finalScore = parseFloat(baseSeasonalScore.toFixed(4));
        status = "OPEN_OPTIMAL";
      }

      return {
        ...dest,
        method: "Method C (Disruption-Aware)",
        finalScore,
        scoreBreakdown: {
          popularity,
          weatherFit: parseFloat(weatherFit.toFixed(4)),
          scenicFit,
          baseSeasonalScore: parseFloat(baseSeasonalScore.toFixed(4)),
          disruptionPenalty: parseFloat(disruptionPenalty.toFixed(4)),
        },
        status,
        hasClosure: hasAbsoluteClosure,
        activeDisruptions,
      };
    })
    .sort((a, b) => {
      if (b.finalScore !== a.finalScore) return b.finalScore - a.finalScore;
      return b.popularityScore - a.popularityScore;
    });
}

/**
 * Unified execution function that retrieves candidate destinations and executes all three methods.
 */
export function runRankingExperiment(activity, month) {
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
    },
  };
}
