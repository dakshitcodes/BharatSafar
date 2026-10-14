#!/usr/bin/env python3
"""
BharatVerse / BharatSafar Empirical Research Benchmark Evaluator
Python implementation of Information Retrieval Metrics:
- Precision@K (threshold >= 2)
- Discounted Cumulative Gain (DCG@K)
- Ideal Discounted Cumulative Gain (IDCG@K)
- Normalized Discounted Cumulative Gain (NDCG@K)
- Closure-Conflict Rate (CCR@K)

Includes Development (Tuning) vs Holdout (Test) split across 24 seasonal scenarios.
"""

import json
import math
import os
import csv
from pathlib import Path

# Paths to benchmark datasets
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "src" / "research" / "data"

DESTINATIONS_FILE = DATA_DIR / "destinations.json"
DISRUPTIONS_FILE = DATA_DIR / "disruptions.json"
GROUND_TRUTH_FILE = DATA_DIR / "groundTruth.json"

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]


def load_json(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def calculate_weather_comfort(temp_c, rain_mm, activity):
    """Calculates continuous environmental comfort [0, 1]"""
    if activity == "trekking":
        # Trekking temperature preference
        if temp_c < -10:
            temp_score = 0.20
        elif temp_c < 0:
            temp_score = 0.55
        elif 0 <= temp_c <= 22:
            temp_score = 1.00
        elif temp_c <= 28:
            temp_score = 0.75
        elif temp_c <= 34:
            temp_score = 0.45
        else:
            temp_score = 0.15

        # Trekking rainfall penalty
        if rain_mm <= 50:
            rain_score = 1.00
        elif rain_mm <= 120:
            rain_score = 0.80
        elif rain_mm <= 250:
            rain_score = 0.50
        elif rain_mm <= 500:
            rain_score = 0.20
        else:
            rain_score = 0.05
        return 0.50 * temp_score + 0.50 * rain_score
    else:
        # Waterfalls temperature preference
        if temp_c < 10:
            temp_score = 0.60
        elif 18 <= temp_c <= 29:
            temp_score = 1.00
        elif temp_c <= 34:
            temp_score = 0.80
        else:
            temp_score = 0.40

        # Waterfalls benefit from rainfall for recharge
        if rain_mm <= 10:
            rain_score = 0.30
        elif rain_mm <= 100:
            rain_score = 0.60
        elif rain_mm <= 500:
            rain_score = 0.95
        elif rain_mm <= 1000:
            rain_score = 1.00
        else:
            rain_score = 0.85
        return 0.40 * temp_score + 0.60 * rain_score


def get_active_disruptions(dest_id, month, disruptions_data):
    """Finds all verified disruption orders active for destination in month"""
    return [
        d for d in disruptions_data
        if d["destinationId"] == dest_id and month in d["applicableMonths"]
    ]


def rank_method_a_popularity(candidates):
    """Method A: Popularity-Based Baseline"""
    return sorted(candidates, key=lambda d: d["popularityScore"], reverse=True)


def rank_method_b_seasonal(candidates, month, activity):
    """Method B: Seasonal Multi-Factor Environmental Scoring"""
    month_str = str(month)
    scored = []
    for d in candidates:
        m_data = d["monthlyData"].get(month_str, {})
        w_fit = calculate_weather_comfort(
            m_data.get("avgTempC", 25),
            m_data.get("rainfallMm", 50),
            activity
        )
        scenic_fit = m_data.get("scenicIndex", 0.5)
        pop = d["popularityScore"]
        # Weights: 50% scenic/flow, 30% weather, 20% popularity
        score = 0.50 * scenic_fit + 0.30 * w_fit + 0.20 * pop
        scored.append((d, round(score, 4)))

    scored.sort(key=lambda item: (item[1], item[0]["popularityScore"]), reverse=True)
    return [item[0] for item in scored]


def rank_method_c_disruption_aware(candidates, month, activity, disruptions_data):
    """Method C: Disruption-Aware Seasonal Ranking (Proposed)"""
    month_str = str(month)
    scored = []
    for d in candidates:
        m_data = d["monthlyData"].get(month_str, {})
        w_fit = calculate_weather_comfort(
            m_data.get("avgTempC", 25),
            m_data.get("rainfallMm", 50),
            activity
        )
        scenic_fit = m_data.get("scenicIndex", 0.5)
        pop = d["popularityScore"]
        base_score = 0.50 * scenic_fit + 0.30 * w_fit + 0.20 * pop

        active_disruptions = get_active_disruptions(d["id"], month, disruptions_data)
        has_absolute_closure = any(dis.get("isAbsoluteClosure", False) for dis in active_disruptions)

        if has_absolute_closure:
            # Hard safety invariant: absolute closure zeroes score and demotes item
            final_score = 0.0
        elif active_disruptions:
            penalty = 1.0
            for dis in active_disruptions:
                penalty *= dis.get("penaltyMultiplier", 0.5)
            final_score = round(base_score * penalty, 4)
        else:
            final_score = round(base_score, 4)

        scored.append((d, final_score))

    scored.sort(key=lambda item: (item[1], item[0]["popularityScore"]), reverse=True)
    return [item[0] for item in scored]


# -------------------------------------------------------------------------
# Formal Metric Calculations (Pure Mathematical Formulations)
# -------------------------------------------------------------------------

def calculate_precision_at_k(ranked_list, ground_truth_grades, k=5, threshold=2):
    """
    Precision@K = (Number of relevant destinations in top K) / K
    Relevant is defined as ground_truth_grade >= threshold (default 2)
    """
    if not ranked_list:
        return 0.0
    effective_k = min(k, len(ranked_list))
    top_k = ranked_list[:effective_k]

    relevant_count = sum(
        1 for d in top_k if ground_truth_grades.get(d["id"], 0) >= threshold
    )
    return relevant_count / effective_k


def calculate_dcg_at_k(ranked_list, ground_truth_grades, k=5):
    """
    DCG@K = sum_{i=1}^K (2^{rel_i} - 1) / log2(i + 1)
    Here rel_i is the independent relevance grade at rank i.
    """
    if not ranked_list:
        return 0.0
    effective_k = min(k, len(ranked_list))
    dcg = 0.0
    for i in range(effective_k):
        rel = ground_truth_grades.get(ranked_list[i]["id"], 0)
        gain = (2.0 ** rel) - 1.0
        discount = math.log2(i + 2.0)  # i=0 -> log2(2) = 1.0
        dcg += gain / discount
    return dcg


def calculate_idcg_at_k(all_candidates, ground_truth_grades, k=5):
    """
    IDCG@K: The maximum possible DCG obtained by sorting all candidates
    in ideal descending order of their independent relevance grade.
    """
    if not all_candidates:
        return 0.0
    ideal_sorted = sorted(
        all_candidates,
        key=lambda d: ground_truth_grades.get(d["id"], 0),
        reverse=True
    )
    return calculate_dcg_at_k(ideal_sorted, ground_truth_grades, k)


def calculate_ndcg_at_k(ranked_list, all_candidates, ground_truth_grades, k=5):
    """
    NDCG@K = DCG@K / IDCG@K
    Normalized Discounted Cumulative Gain ranges from 0.0 to 1.0.
    """
    idcg = calculate_idcg_at_k(all_candidates, ground_truth_grades, k)
    if idcg == 0.0:
        return 1.0
    dcg = calculate_dcg_at_k(ranked_list, ground_truth_grades, k)
    return dcg / idcg


def calculate_closure_conflict_rate(ranked_list, month, disruptions_data, k=5):
    """
    Closure-conflict rate = (Top-K recommendations with verified closures) / K
    """
    if not ranked_list:
        return 0.0
    effective_k = min(k, len(ranked_list))
    top_k = ranked_list[:effective_k]

    conflict_count = sum(
        1 for d in top_k
        if any(
            dis.get("isAbsoluteClosure", False)
            for dis in get_active_disruptions(d["id"], month, disruptions_data)
        )
    )
    return conflict_count / effective_k


# -------------------------------------------------------------------------
# Full Benchmark Runner & Train/Holdout Evaluation Split
# -------------------------------------------------------------------------

def run_evaluation():
    destinations = load_json(DESTINATIONS_FILE)
    disruptions = load_json(DISRUPTIONS_FILE)
    ground_truth = load_json(GROUND_TRUTH_FILE)

    ratings_data = ground_truth["ratings"]

    # Development Set vs Holdout Test Set split
    # 8 Holdout Months: [2 (Feb), 4 (Apr), 9 (Sep), 11 (Nov)] across 2 activities = 8 scenarios
    # 16 Dev Months: [1 (Jan), 3 (Mar), 5 (May), 6 (Jun), 7 (Jul), 8 (Aug), 10 (Oct), 12 (Dec)] = 16 scenarios
    HOLDOUT_MONTHS = {2, 4, 9, 11}
    DEV_MONTHS = {1, 3, 5, 6, 7, 8, 10, 12}

    activities = ["waterfalls", "trekking"]
    all_results = []

    print("================================================================================")
    print("      BHARATVERSE INDEPENDENT BENCHMARK EVALUATOR (PYTHON STANDARD REC-EVAL)     ")
    print("================================================================================")
    print(f"Loaded {len(destinations)} destinations, {len(disruptions)} disruption orders.")
    print(f"Relevance rubric: {ground_truth['rubric']['scale']}")
    print("Split: 16 Development (Tuning) scenarios, 8 Holdout (Test) scenarios.\n")

    for act in activities:
        candidates = [d for d in destinations if d["category"] == act]
        k = 3  # Top-3 cutoff for category-specific evaluation

        for month in range(1, 13):
            month_str = str(month)
            month_name = MONTH_NAMES[month - 1]
            split_type = "HOLDOUT" if month in HOLDOUT_MONTHS else "DEV"

            # Build ground truth relevance map for this scenario
            gt_grades = {
                d["id"]: ratings_data[d["id"]]["monthlyGrades"][month_str]["grade"]
                for d in candidates
            }

            # Run the 3 methods
            rank_a = rank_method_a_popularity(candidates)
            rank_b = rank_method_b_seasonal(candidates, month, act)
            rank_c = rank_method_c_disruption_aware(candidates, month, act, disruptions)

            # Calculate metrics
            p_a = calculate_precision_at_k(rank_a, gt_grades, k)
            p_b = calculate_precision_at_k(rank_b, gt_grades, k)
            p_c = calculate_precision_at_k(rank_c, gt_grades, k)

            ndcg_a = calculate_ndcg_at_k(rank_a, candidates, gt_grades, k)
            ndcg_b = calculate_ndcg_at_k(rank_b, candidates, gt_grades, k)
            ndcg_c = calculate_ndcg_at_k(rank_c, candidates, gt_grades, k)

            ccr_a = calculate_closure_conflict_rate(rank_a, month, disruptions, k)
            ccr_b = calculate_closure_conflict_rate(rank_b, month, disruptions, k)
            ccr_c = calculate_closure_conflict_rate(rank_c, month, disruptions, k)

            all_results.append({
                "scenario_id": f"{act}-m{month}",
                "activity": act,
                "month": month,
                "month_name": month_name,
                "split": split_type,
                "k": k,
                "p_a": p_a, "p_b": p_b, "p_c": p_c,
                "ndcg_a": ndcg_a, "ndcg_b": ndcg_b, "ndcg_c": ndcg_c,
                "ccr_a": ccr_a, "ccr_b": ccr_b, "ccr_c": ccr_c,
                "top_picks_a": [d["name"] for d in rank_a[:k]],
                "top_picks_c": [d["name"] for d in rank_c[:k]],
            })

    # Illustrative Concrete Example: July Waterfalls (Trace Math step-by-step)
    july_wf = next(r for r in all_results if r["scenario_id"] == "waterfalls-m7")
    print("--------------------------------------------------------------------------------")
    print("CONCRETE EXAMPLE STEP-BY-STEP TRACE: Activity=Waterfalls, Month=July")
    print("--------------------------------------------------------------------------------")
    print(f"Method 1 (Popularity) Top-3:  {', '.join(july_wf['top_picks_a'])}")
    print(f"  -> Precision@3: {july_wf['p_a']:.2f} | NDCG@3: {july_wf['ndcg_a']:.4f} | Closure Conflict: {july_wf['ccr_a']*100:.1f}%")
    print(f"Method 2 (Seasonal) Top-3:    (Driven by peak monsoon water flow)")
    print(f"  -> Precision@3: {july_wf['p_b']:.2f} | NDCG@3: {july_wf['ndcg_b']:.4f} | Closure Conflict: {july_wf['ccr_b']*100:.1f}%")
    print(f"Method 3 (Proposed) Top-3:    {', '.join(july_wf['top_picks_c'])}")
    print(f"  -> Precision@3: {july_wf['p_c']:.2f} | NDCG@3: {july_wf['ndcg_c']:.4f} | Closure Conflict: {july_wf['ccr_c']*100:.1f}%\n")

    # Aggregate summaries across splits
    def macro_avg(results, key):
        return sum(r[key] for r in results) / len(results)

    dev_results = [r for r in all_results if r["split"] == "DEV"]
    holdout_results = [r for r in all_results if r["split"] == "HOLDOUT"]

    print("--------------------------------------------------------------------------------")
    print("BENCHMARK AGGREGATE RESULTS (MACRO-AVERAGE)")
    print("--------------------------------------------------------------------------------")
    print(f"{'Metric':<26} | {'Method A (Pop)':<16} | {'Method B (Season)':<18} | {'Method C (Proposed)':<20}")
    print("-" * 86)

    for name, subset in [("Holdout Test Set (8 Scenarios)", holdout_results),
                         ("Development Set (16 Scenarios)", dev_results),
                         ("Overall (All 24 Scenarios)", all_results)]:
        print(f"[{name}]")
        print(f"  Precision@3              | {macro_avg(subset, 'p_a'):<16.4f} | {macro_avg(subset, 'p_b'):<18.4f} | {macro_avg(subset, 'p_c'):<20.4f}")
        print(f"  NDCG@3                   | {macro_avg(subset, 'ndcg_a'):<16.4f} | {macro_avg(subset, 'ndcg_b'):<18.4f} | {macro_avg(subset, 'ndcg_c'):<20.4f}")
        print(f"  Closure Conflict Rate    | {macro_avg(subset, 'ccr_a')*100:<15.1f}% | {macro_avg(subset, 'ccr_b')*100:<17.1f}% | {macro_avg(subset, 'ccr_c')*100:<19.1f}%")
        print("-" * 86)

    # Export CSV
    output_dir = BASE_DIR / "src" / "research" / "output"
    output_dir.mkdir(parents=True, exist_ok=True)
    csv_file = output_dir / "python_evaluation_results.csv"

    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Scenario_ID", "Activity", "Month", "Month_Name", "Split", "K",
            "MethodA_Precision", "MethodB_Precision", "MethodC_Precision",
            "MethodA_NDCG", "MethodB_NDCG", "MethodC_NDCG",
            "MethodA_CCR", "MethodB_CCR", "MethodC_CCR"
        ])
        for r in all_results:
            writer.writerow([
                r["scenario_id"], r["activity"], r["month"], r["month_name"], r["split"], r["k"],
                r["p_a"], r["p_b"], r["p_c"],
                r["ndcg_a"], r["ndcg_b"], r["ndcg_c"],
                r["ccr_a"], r["ccr_b"], r["ccr_c"]
            ])

    print(f"\nResults successfully exported to: {csv_file}")
    print("================================================================================")


if __name__ == "__main__":
    run_evaluation()
