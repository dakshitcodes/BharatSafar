#!/usr/bin/env node

/**
 * CLI Runner for BharatVerse Research Benchmark
 * Run via: node scripts/run_research_benchmark.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runFullBenchmark, generateLatexTable, generateExperimentCSV } from "../src/research/evaluation/runExperiment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("================================================================================");
console.log("       BHARATVERSE / BHARATSAFAR EMPIRICAL RESEARCH BENCHMARK RUNNER           ");
console.log("================================================================================");
console.log("Evaluating Three Methods across 24 Month-Activity Travel Scenarios:");
console.log(" - Method A: Popularity-Based Baseline");
console.log(" - Method B: Seasonal-Aware Multi-Criteria Scoring");
console.log(" - Method C: Disruption-Aware Seasonal Ranking (Proposed)\n");

const benchmarkResults = runFullBenchmark({ k: 5 });

const overall = benchmarkResults.aggregateResults.overall;
const dev = benchmarkResults.aggregateResults.development;
const holdout = benchmarkResults.aggregateResults.holdout;

console.log("--------------------------------------------------------------------------------");
console.log("SUMMARY OF AGGREGATE METRICS (MACRO-AVERAGES ACROSS 24 SCENARIOS)");
console.log("--------------------------------------------------------------------------------");
console.table({
  "Holdout Test (8 Scenarios)": {
    "Method A (Popularity)": `P@3: ${holdout.methodA.precisionAtK} | NDCG@3: ${holdout.methodA.ndcgAtK} | Conflict: ${holdout.methodA.closureConflictPercent}%`,
    "Method B (Seasonal)": `P@3: ${holdout.methodB.precisionAtK} | NDCG@3: ${holdout.methodB.ndcgAtK} | Conflict: ${holdout.methodB.closureConflictPercent}%`,
    "Method C (Disruption-Aware)": `P@3: ${holdout.methodC.precisionAtK} | NDCG@3: ${holdout.methodC.ndcgAtK} | Conflict: ${holdout.methodC.closureConflictPercent}%`,
  },
  "Development Set (16 Scenarios)": {
    "Method A (Popularity)": `P@3: ${dev.methodA.precisionAtK} | NDCG@3: ${dev.methodA.ndcgAtK} | Conflict: ${dev.methodA.closureConflictPercent}%`,
    "Method B (Seasonal)": `P@3: ${dev.methodB.precisionAtK} | NDCG@3: ${dev.methodB.ndcgAtK} | Conflict: ${dev.methodB.closureConflictPercent}%`,
    "Method C (Disruption-Aware)": `P@3: ${dev.methodC.precisionAtK} | NDCG@3: ${dev.methodC.ndcgAtK} | Conflict: ${dev.methodC.closureConflictPercent}%`,
  },
  "Overall (24 Scenarios)": {
    "Method A (Popularity)": `P@3: ${overall.methodA.precisionAtK} | NDCG@3: ${overall.methodA.ndcgAtK} | Conflict: ${overall.methodA.closureConflictPercent}%`,
    "Method B (Seasonal)": `P@3: ${overall.methodB.precisionAtK} | NDCG@3: ${overall.methodB.ndcgAtK} | Conflict: ${overall.methodB.closureConflictPercent}%`,
    "Method C (Disruption-Aware)": `P@3: ${overall.methodC.precisionAtK} | NDCG@3: ${overall.methodC.ndcgAtK} | Conflict: ${overall.methodC.closureConflictPercent}%`,
  },
});

console.log("\n--------------------------------------------------------------------------------");
console.log("KEY RESEARCH FINDINGS & EMPIRICAL DIVERGENCE:");
console.log("--------------------------------------------------------------------------------");
benchmarkResults.notableDivergences.forEach((div, idx) => {
  console.log(`[#${idx + 1}] Scenario: ${div.activity.toUpperCase()} in ${div.monthName}`);
  console.log(`    - Method A Closure Conflict: ${(div.ccrMethodA * 100).toFixed(0)}% (Top picks: ${div.topPicksA.join(", ")})`);
  console.log(`    - Method C Closure Conflict: ${(div.ccrMethodC * 100).toFixed(0)}% (Top picks: ${div.topPicksC.join(", ")})`);
  console.log(`    - NDCG Improvement: ${div.ndcgMethodA.toFixed(3)} -> ${div.ndcgMethodC.toFixed(3)} (+${(div.ndcgLift * 100).toFixed(1)}% lift)\n`);
});

// Write output files
const outputDir = path.resolve(__dirname, "../src/research/output");
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const csvData = generateExperimentCSV(benchmarkResults);
fs.writeFileSync(path.join(outputDir, "benchmark_results.csv"), csvData, "utf-8");

const latexTable = generateLatexTable(benchmarkResults);
fs.writeFileSync(path.join(outputDir, "ieee_table.tex"), latexTable, "utf-8");

fs.writeFileSync(
  path.join(outputDir, "benchmark_summary.json"),
  JSON.stringify(benchmarkResults, null, 2),
  "utf-8"
);

console.log("Files successfully generated:");
console.log(`  -> CSV Data: ${path.join(outputDir, "benchmark_results.csv")}`);
console.log(`  -> LaTeX Table: ${path.join(outputDir, "ieee_table.tex")}`);
console.log(`  -> Full JSON: ${path.join(outputDir, "benchmark_summary.json")}`);
console.log("================================================================================");
