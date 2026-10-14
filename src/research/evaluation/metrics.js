/**
 * Quantitative Evaluation Suite for BharatVerse Recommender Benchmark
 * 
 * Implements:
 * - Precision@K
 * - Discounted Cumulative Gain (DCG@K)
 * - Ideal Discounted Cumulative Gain (IDCG@K)
 * - Normalized Discounted Cumulative Gain (NDCG@K)
 * - Closure Conflict Rate (CCR@K)
 * - Data Coverage
 */

import { groundTruthData } from "../data/groundTruthData.js";
import { disruptionsData } from "../data/disruptionsData.js";

/**
 * Retrieves the ground-truth relevance grade (0-3) for a destination-month pair
 */
export function getGroundTruthGrade(destinationId, month) {
  const destEntry = groundTruthData.ratings[destinationId];
  if (!destEntry) return 0;
  const monthData = destEntry.monthlyGrades[String(month)];
  return monthData ? monthData.grade : 0;
}

/**
 * Retrieves the ground-truth rationale
 */
export function getGroundTruthRationale(destinationId, month) {
  const destEntry = groundTruthData.ratings[destinationId];
  if (!destEntry) return "";
  const monthData = destEntry.monthlyGrades[String(month)];
  return monthData ? monthData.rationale : "";
}

/**
 * Checks whether a destination has an active absolute verified closure in that month
 */
export function hasVerifiedClosure(destinationId, month) {
  const monthNum = Number(month);
  return disruptionsData.some(
    (d) =>
      d.destinationId === destinationId &&
      d.applicableMonths.includes(monthNum) &&
      d.isAbsoluteClosure
  );
}

/**
 * Computes Precision@K
 * P@K = (Number of recommended items in top-K with grade >= threshold) / K
 */
export function calculatePrecisionAtK(rankedList, month, k = 5, threshold = 2) {
  if (!rankedList || rankedList.length === 0) return 0;
  const effectiveK = Math.min(k, rankedList.length);
  const topK = rankedList.slice(0, effectiveK);

  const relevantCount = topK.filter((item) => {
    const grade = getGroundTruthGrade(item.id, month);
    return grade >= threshold;
  }).length;

  return parseFloat((relevantCount / effectiveK).toFixed(4));
}

/**
 * Computes DCG@K using standard exponential relevance formulation
 * DCG@K = sum_{i=1}^K (2^{rel_i} - 1) / log2(i + 1)
 */
export function calculateDCG(rankedList, month, k = 5) {
  if (!rankedList || rankedList.length === 0) return 0;
  const effectiveK = Math.min(k, rankedList.length);
  let dcg = 0;

  for (let i = 0; i < effectiveK; i++) {
    const grade = getGroundTruthGrade(rankedList[i].id, month);
    const gain = Math.pow(2, grade) - 1;
    const discount = Math.log2(i + 2); // i=0 -> log2(2) = 1
    dcg += gain / discount;
  }

  return dcg;
}

/**
 * Computes Ideal DCG@K by sorting candidates by true relevance grade
 */
export function calculateIDCG(candidates, month, k = 5) {
  if (!candidates || candidates.length === 0) return 0;
  const sortedByTrueGrade = [...candidates].sort((a, b) => {
    const gradeA = getGroundTruthGrade(a.id, month);
    const gradeB = getGroundTruthGrade(b.id, month);
    return gradeB - gradeA;
  });

  return calculateDCG(sortedByTrueGrade, month, k);
}

/**
 * Computes Normalized Discounted Cumulative Gain (NDCG@K)
 * NDCG@K = DCG@K / IDCG@K
 */
export function calculateNDCGAtK(rankedList, allCandidates, month, k = 5) {
  const dcg = calculateDCG(rankedList, month, k);
  const idcg = calculateIDCG(allCandidates, month, k);

  if (idcg === 0) return 1.0;
  return parseFloat((dcg / idcg).toFixed(4));
}

/**
 * Computes Closure-Conflict Rate (CCR@K)
 * CCR@K = (Number of recommended items in top-K with verified closures) / K
 */
export function calculateClosureConflictRate(rankedList, month, k = 5) {
  if (!rankedList || rankedList.length === 0) return 0;
  const effectiveK = Math.min(k, rankedList.length);
  const topK = rankedList.slice(0, effectiveK);

  const conflictCount = topK.filter((item) =>
    hasVerifiedClosure(item.id, month)
  ).length;

  return parseFloat((conflictCount / effectiveK).toFixed(4));
}

/**
 * Evaluates all metrics for a given ranked list
 */
export function evaluateRanking(rankedList, allCandidates, month, k = 5) {
  const precision = calculatePrecisionAtK(rankedList, month, k);
  const ndcg = calculateNDCGAtK(rankedList, allCandidates, month, k);
  const ccr = calculateClosureConflictRate(rankedList, month, k);

  return {
    k: Math.min(k, rankedList.length),
    precisionAtK: precision,
    ndcgAtK: ndcg,
    closureConflictRate: ccr,
    closureConflictPercent: parseFloat((ccr * 100).toFixed(1)),
  };
}
