#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  generateExperimentCSV,
  generateLatexTable,
  runFullBenchmark,
} from "../src/research/evaluation/runExperiment.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.resolve(scriptDir, "../src/research/output");
const benchmark = runFullBenchmark();
if (benchmark.scenarios.length !== 36 ||
    benchmark.aggregateResults.categorySpecific.scenarioCount !== 24 ||
    benchmark.aggregateResults.all.scenarioCount !== 12) {
  throw new Error("Benchmark scenario counts do not match the documented 24 + 12 protocol.");
}
const csv = generateExperimentCSV(benchmark);
const csvRowCount = csv.trim().split(/\r?\n/).length - 1;
if (csvRowCount !== benchmark.scenarios.length) {
  throw new Error(`Generated CSV has ${csvRowCount} rows for ${benchmark.scenarios.length} scenarios.`);
}
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, "benchmark_results.csv"), csv, "utf8");
fs.writeFileSync(path.join(outputDir, "ieee_table.tex"), generateLatexTable(benchmark), "utf8");
fs.writeFileSync(
  path.join(outputDir, "benchmark_summary.json"),
  `${JSON.stringify(benchmark, null, 2)}\n`,
  "utf8"
);

console.log(`Generated ${benchmark.scenarios.length} scenarios (${benchmark.aggregateResults.categorySpecific.scenarioCount} category-specific; ${benchmark.aggregateResults.overall.scenarioCount} total).`);
console.log(`Requested cutoffs: K=${benchmark.protocol.kSingleActivity} for single-activity pools; K=${benchmark.protocol.kCombined} for the mixed pool.`);
console.log("Aggregate scopes and cutoffs:", benchmark.protocol.aggregateScopes);
console.table(Object.fromEntries(
  ["categorySpecificHoldout", "categorySpecificDevelopment", "categorySpecific", "overall"].map((scope) => {
    const aggregate = benchmark.aggregateResults[scope];
    return [scope, {
      scenarios: aggregate.scenarioCount,
      "A NDCG@K": aggregate.methodA.ndcgAtK,
      "B NDCG@K": aggregate.methodB.ndcgAtK,
      "C NDCG@K": aggregate.methodC.ndcgAtK,
      "A full-closure conflict %": aggregate.methodA.closureConflictPercent,
      "C full-closure conflict %": aggregate.methodC.closureConflictPercent,
      "NDCG undefined/excluded (A)": aggregate.methodA.ndcgExcludedScenarios,
    }];
  })
));
for (const fileName of ["benchmark_results.csv", "benchmark_summary.json", "ieee_table.tex"]) {
  const filePath = path.join(outputDir, fileName);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).size === 0) {
    throw new Error(`Expected benchmark artifact was not generated: ${filePath}`);
  }
}
console.log(`CSV has ${csvRowCount} scenario rows.`);
console.log(`Verified CSV, JSON, and LaTeX artifacts in ${outputDir}`);
