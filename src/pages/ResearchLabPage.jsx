import React, { useState, useMemo } from "react";
import { AnimatePresence } from "framer-motion";
import {
  FlaskConical,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  TrendingUp,
  BarChart3,
  FileText,
  Copy,
  Download,
  Check,
  Calendar,
  Compass,
  Layers,
  Thermometer,
  CloudRain,
  Eye,
  Info,
  ChevronRight,
  ShieldAlert,
  MapPin,
  Sparkles,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import toast from "react-hot-toast";

import { destinationsData } from "../research/data/destinationsData.js";
import {
  DEFAULT_SEASONAL_WEIGHTS,
  rankMethodAPopularity,
  rankMethodBSeasonal,
  rankMethodCDisruptionAware,
} from "../research/algorithms/rankingEngine.js";
import {
  evaluateRanking,
  getGroundTruthGrade,
  getGroundTruthRationale,
  hasVerifiedClosure,
} from "../research/evaluation/metrics.js";
import {
  runFullBenchmark,
  generateLatexTable,
  generateExperimentCSV,
  MONTH_NAMES,
} from "../research/evaluation/runExperiment.js";

const MONTHS = [
  { id: 1, name: "January", season: "Winter" },
  { id: 2, name: "February", season: "Winter" },
  { id: 3, name: "March", season: "Spring" },
  { id: 4, name: "April", season: "Summer" },
  { id: 5, name: "May", season: "Summer" },
  { id: 6, name: "June", season: "Monsoon Arrival" },
  { id: 7, name: "July", season: "Peak Monsoon" },
  { id: 8, name: "August", season: "Peak Monsoon" },
  { id: 9, name: "September", season: "Late Monsoon" },
  { id: 10, name: "October", season: "Post-Monsoon / Autumn" },
  { id: 11, name: "November", season: "Autumn / Pre-Winter" },
  { id: 12, name: "December", season: "Winter" },
];

const formatMetric = (value, digits = 3) =>
  Number.isFinite(value) ? value.toFixed(digits) : "N/A";
const formatPercent = (value, digits = 1) =>
  Number.isFinite(value) ? `${value.toFixed(digits)}%` : "N/A";
const formatFractionPercent = (value, digits = 1) =>
  Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "N/A";
const metricReasonLabels = {
  NO_QUALIFYING_CLOSURE_RECORD: "No current, verified full-closure record applies to this scenario.",
  INSUFFICIENT_EVIDENCE: "A supplied closure record lacks enough current evidence.",
  NO_ELIGIBLE_RECOMMENDATIONS: "There are no eligible recommendations to evaluate.",
  MISSING_RELEVANCE_LABELS: "Some destinations in the scenario lack relevance labels.",
  ZERO_IDCG: "The shared ideal ranking has no positive relevance gain.",
  UNDEFINED_NDCG: "NDCG could not be calculated from this scenario.",
  NO_VALID_DENOMINATOR: "There is no valid denominator for this metric.",
};
const explainMetricReason = (reason) =>
  metricReasonLabels[reason] ?? "This metric is not available for the selected scenario.";
const explainClosureReasons = (counts = {}) => Object.entries(counts).map(([reason, count]) => {
  const label = {
    NO_QUALIFYING_CLOSURE_RECORD: "No verified closure record",
    INSUFFICIENT_EVIDENCE: "Evidence incomplete",
    NO_ELIGIBLE_RECOMMENDATIONS: "No eligible results",
  }[reason] ?? "Other reason";
  return `${label}: ${count}`;
}).join(", ") || "none";

export default function ResearchLabPage() {
  const [activeTab, setActiveTab] = useState("lab"); // "lab" | "consumer" | "benchmark" | "paper"
  const [selectedActivity, setSelectedActivity] = useState("waterfalls"); // "waterfalls" | "trekking" | "all"
  const [selectedMonth, setSelectedMonth] = useState(7); // Default to July (monsoon highlights the key research gap)
  const [cutoffK, setCutoffK] = useState(3);
  const [selectedDestForModal, setSelectedDestForModal] = useState(null);
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Run full benchmark once for aggregate stats
  const benchmarkData = useMemo(() => runFullBenchmark(), []);
  const overallResults = benchmarkData.aggregateResults.overall;
  const ndcgOrder = ["methodA", "methodB", "methodC"]
    .filter((method) => Number.isFinite(overallResults[method].ndcgAtK))
    .sort((a, b) => overallResults[b].ndcgAtK - overallResults[a].ndcgAtK);
  const bestNdcg = ndcgOrder.length ? overallResults[ndcgOrder[0]].ndcgAtK : null;
  const ndcgLeaders = ndcgOrder
    .filter((method) => overallResults[method].ndcgAtK === bestNdcg)
    .map((method) => method.replace("method", "Method "));

  // Filter candidates for the currently selected interactive scenario
  const candidates = useMemo(() => {
    if (selectedActivity === "all") return destinationsData;
    return destinationsData.filter((d) => d.category === selectedActivity);
  }, [selectedActivity]);

  // Adjust effective K if candidate pool is smaller
  const effectiveK = Math.min(cutoffK, candidates.length);

  // Compute live rankings for the 3 methods
  const rankedA = useMemo(
    () => rankMethodAPopularity(candidates),
    [candidates]
  );
  const rankedB = useMemo(
    () => rankMethodBSeasonal(candidates, selectedMonth, selectedActivity),
    [candidates, selectedMonth, selectedActivity]
  );
  const rankedC = useMemo(
    () =>
      rankMethodCDisruptionAware(candidates, selectedMonth, selectedActivity),
    [candidates, selectedMonth, selectedActivity]
  );

  // Compute live evaluation metrics
  const metricsA = useMemo(
    () => evaluateRanking(rankedA, candidates, selectedMonth, effectiveK),
    [rankedA, candidates, selectedMonth, effectiveK]
  );
  const metricsB = useMemo(
    () => evaluateRanking(rankedB, candidates, selectedMonth, effectiveK),
    [rankedB, candidates, selectedMonth, effectiveK]
  );
  const metricsC = useMemo(
    () => evaluateRanking(rankedC, candidates, selectedMonth, effectiveK),
    [rankedC, candidates, selectedMonth, effectiveK]
  );

  // Top recommendations for each method
  const topA = rankedA.slice(0, effectiveK);
  const topB = rankedB.slice(0, effectiveK);
  const topC = rankedC.slice(0, effectiveK);
  const quarantinedC = rankedC._quarantined ?? [];
  const ineligibleC = rankedC._ineligible ?? [];
  const ignoredDisruptionsC = Array.from(new Map(
    rankedC.flatMap((destination) => destination.ignoredDisruptions ?? [])
      .map((record) => [record.id, record])
  ).values());

  const handleCopyLatex = async () => {
    const latex = generateLatexTable(benchmarkData);
    try {
      await navigator.clipboard.writeText(latex);
      setCopiedLatex(true);
      toast.success("IEEE-formatted LaTeX table copied to clipboard.");
      setTimeout(() => setCopiedLatex(false), 3000);
    } catch {
      toast.error("Clipboard access failed. You can still export the benchmark CSV.");
    }
  };

  const handleDownloadCSV = () => {
    let url;
    let link;
    try {
      const csvContent = generateExperimentCSV(benchmarkData);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      url = URL.createObjectURL(blob);
      link = document.createElement("a");
      link.href = url;
      link.download = `bharatverse_experiment_results_${benchmarkData.scenarios.length}scenarios.csv`;
      document.body.appendChild(link);
      link.click();
      toast.success("Benchmark CSV dataset exported.");
    } catch {
      toast.error("CSV export failed. Try again or use the benchmark output files.");
    } finally {
      link?.remove();
      if (url) window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-ivory-100 text-charcoal-900 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-charcoal-900 via-charcoal-950 to-charcoal-900 text-ivory-50 pt-28 pb-16 px-6 border-b border-gold-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(201,168,76,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <FlaskConical className="w-3.5 h-3.5" />
              Academic Minor Project & IEEE Research Benchmark
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLatex}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-charcoal-800 hover:bg-charcoal-700 border border-charcoal-700 text-ivory-200 text-xs font-medium transition shadow-sm"
              >
                {copiedLatex ? (
                  <Check className="w-3.5 h-3.5 text-forest-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-gold-400" />
                )}
                Copy LaTeX Table
              </button>
              <button
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-charcoal-950 text-xs font-semibold transition shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export CSV Data
              </button>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-ivory-50 tracking-tight max-w-4xl leading-tight">
            Seasonal & Disruption-Aware Tourism Recommendation Engine
          </h1>
          <p className="mt-4 text-base md:text-lg text-charcoal-200 max-w-3xl leading-relaxed">
            Comparing seasonal ranking and supplied disruption records with a static popularity baseline. Inputs and relevance labels are provisional.
          </p>

          {/* Primary View Switcher Navigation */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-charcoal-800 pb-3">
            {[
              { id: "lab", label: "Experimental Comparison Lab", icon: FlaskConical },
              { id: "consumer", label: "Seasonal Discovery (Live Engine)", icon: Compass },
              { id: "benchmark", label: "36-Scenario Matrix", icon: BarChart3 },
              { id: "paper", label: "Research Paper Specifications", icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gold-500 text-charcoal-950 font-semibold shadow-md shadow-gold-500/20"
                      : "bg-charcoal-850/60 hover:bg-charcoal-800 text-ivory-300 hover:text-ivory-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 -mt-4 relative z-20">
        {/* VIEW 1: EXPERIMENTAL COMPARISON LAB */}
        {activeTab === "lab" && (
          <div className="space-y-8">
            {/* Control Panel: Scenario Selection */}
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
                    1. Select Activity Category
                  </label>
                  <div className="flex gap-2">
                    {[
                      { id: "waterfalls", label: "Waterfalls (5 Candidates)" },
                      { id: "trekking", label: "Trekking (4 Candidates)" },
                      { id: "all", label: "Combined Pool (9 Candidates)" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedActivity(cat.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition ${
                          selectedActivity === cat.id
                            ? "bg-charcoal-900 text-ivory-50 shadow-sm"
                            : "bg-ivory-200 hover:bg-ivory-300 text-charcoal-700"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cutoff K */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-2">
                    2. Recommendation Cutoff (Top-K)
                  </label>
                  <div className="flex gap-2">
                    {[1, 3, 5].map((k) => (
                      <button
                        key={k}
                        onClick={() => setCutoffK(k)}
                        className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition ${
                          cutoffK === k
                            ? "bg-gold-500 text-charcoal-950"
                            : "bg-ivory-200 hover:bg-ivory-300 text-charcoal-700"
                        }`}
                      >
                        Top-{k}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Month Selector Carousel */}
              <div className="mt-6 pt-6 border-t border-ivory-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    3. Select Travel Scenario Month
                  </label>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gold-100 text-gold-900 border border-gold-300">
                    Selected: {MONTHS[selectedMonth - 1].name} ({MONTHS[selectedMonth - 1].season})
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                  {MONTHS.map((m) => {
                    const isSelected = selectedMonth === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => setSelectedMonth(m.id)}
                        className={`p-2 rounded-xl flex flex-col items-center justify-center transition border text-center ${
                          isSelected
                            ? "bg-gold-500 text-charcoal-950 border-gold-600 shadow-md font-bold"
                            : "bg-ivory-50 hover:bg-ivory-200 border-ivory-300 text-charcoal-700"
                        }`}
                      >
                        <span className="text-xs font-bold">{m.name.slice(0, 3)}</span>
                        <span className="text-[10px] opacity-75 mt-0.5 line-clamp-1">{m.season}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Live Comparative Metric Scorecards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Method A Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-red-200/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
                  Baseline Aggregator
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                  Method A
                  <span className="text-xs font-normal text-charcoal-500">(Popularity-Only)</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-1">
                  Baseline ranking by the supplied popularityScore field only.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">NDCG@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">{formatMetric(metricsA.ndcgAtK)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">Precision@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {formatPercent(metricsA.precisionAtK === null ? null : metricsA.precisionAtK * 100)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-charcoal-600 flex items-center gap-1 font-semibold text-red-700">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Full-closure conflict @K
                    </span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      metricsA.closureConflictPercent > 0 ? "bg-red-100 text-red-800" : "bg-charcoal-100 text-charcoal-700"
                    }`}>
                      {formatPercent(metricsA.closureConflictPercent)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Method B Card */}
              <div className="bg-white rounded-2xl p-6 border-2 border-amber-200/80 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider">
                  Seasonal Only
                </div>
                <h3 className="text-lg font-bold text-charcoal-900 flex items-center gap-2">
                  Method B
                  <span className="text-xs font-normal text-charcoal-500">(Seasonal-Aware)</span>
                </h3>
                <p className="text-xs text-charcoal-500 mt-1">
                  Scenic index ({Math.round(DEFAULT_SEASONAL_WEIGHTS.scenic * 100)}%), weather comfort ({Math.round(DEFAULT_SEASONAL_WEIGHTS.weather * 100)}%), and popularityScore ({Math.round(DEFAULT_SEASONAL_WEIGHTS.popularity * 100)}%).
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">NDCG@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">{formatMetric(metricsB.ndcgAtK)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">Precision@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {formatPercent(metricsB.precisionAtK === null ? null : metricsB.precisionAtK * 100)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-charcoal-600 flex items-center gap-1 font-semibold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Full-closure conflict @K
                    </span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      metricsB.closureConflictPercent > 0 ? "bg-amber-100 text-amber-800" : "bg-charcoal-100 text-charcoal-700"
                    }`}>
                      {formatPercent(metricsB.closureConflictPercent)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Method C Card (Proposed) */}
              <div className="bg-gradient-to-br from-white to-forest-50/50 rounded-2xl p-6 border-2 border-forest-500 shadow-md relative overflow-hidden ring-2 ring-forest-500/20">
                <div className="absolute top-0 right-0 px-3 py-1 bg-forest-600 text-ivory-50 text-[10px] font-bold rounded-bl-xl uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-gold-300" />
                  Proposed Model
                </div>
                <h3 className="text-lg font-bold text-forest-900 flex items-center gap-2">
                  Method C
                  <span className="text-xs font-semibold text-forest-700">(Disruption-Aware)</span>
                </h3>
                <p className="text-xs text-charcoal-600 mt-1">
                  Seasonal scoring with an eligibility filter for supplied absolute-closure records.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-forest-100 pb-2">
                    <span className="text-charcoal-700 font-medium">NDCG@{effectiveK}</span>
                    <span className="font-mono font-bold text-forest-800 flex items-center gap-1">
                      {formatMetric(metricsC.ndcgAtK)}
                      {Number.isFinite(metricsC.ndcgAtK) && Number.isFinite(metricsA.ndcgAtK) && metricsC.ndcgAtK !== metricsA.ndcgAtK && (
                        <span className="text-[10px] font-sans px-1.5 py-0.2 bg-forest-100 text-forest-700 rounded-full">
                          {formatFractionPercent(metricsC.ndcgAtK - metricsA.ndcgAtK)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-forest-100 pb-2">
                    <span className="text-charcoal-700 font-medium">Precision@{effectiveK}</span>
                    <span className="font-mono font-bold text-forest-800">
                      {formatPercent(metricsC.precisionAtK === null ? null : metricsC.precisionAtK * 100)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-forest-800 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-4 h-4 text-forest-600" />
                      Full-closure conflict @K
                    </span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded text-xs bg-charcoal-100 text-charcoal-800 border border-charcoal-300">
                      {formatPercent(metricsC.closureConflictPercent)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-ivory-300 bg-white/70 px-4 py-3 text-xs text-charcoal-600">
              <div>
                <span className="font-semibold text-charcoal-800">Precision@K</span>
                <p className="mt-1">{metricsC.precisionAtK === null
                  ? explainMetricReason(metricsC.precisionAtKReasonCode)
                  : `Calculated over ${metricsC.precisionDenominator} eligible recommendations; labels are complete for ${metricsC.labeledCandidateCount} of ${metricsC.candidateCount} destinations.`}</p>
              </div>
              <div>
                <span className="font-semibold text-charcoal-800">NDCG@K</span>
                <p className="mt-1">{metricsC.ndcgAtK === null
                  ? explainMetricReason(metricsC.ndcgAtKReasonCode)
                  : `Compared with a shared ideal ranking of ${metricsC.ndcgIdealPoolCount} scenario destinations.`}</p>
              </div>
              <div>
                <span className="font-semibold text-charcoal-800">Full-closure conflict</span>
                <p className="mt-1">{metricsC.closureConflictRate === null
                  ? explainMetricReason(metricsC.closureConflictReasonCode)
                  : `Calculated over ${metricsC.closureConflictDenominator} eligible recommendations.`}</p>
              </div>
            </div>
            <p className="text-[11px] text-charcoal-500 px-1">
              Full-closure conflict only checks the supplied destination-level records. An unavailable rate does not indicate that destinations are open or safe.
            </p>

            {/* Side-by-Side 3-Column Recommendations Visualizer */}
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-2">
                <div>
                  <h3 className="text-lg font-serif font-bold text-charcoal-900">
                    Side-by-Side Top-{effectiveK} Recommendations for {MONTHS[selectedMonth - 1].name}
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Method C applies only current, evidence-backed full-destination records. Supplied records that fail the evidence policy are listed as ignored; verify access with authorities before travel.
                  </p>
                </div>
                <div className="text-xs text-charcoal-500 italic">
                  *Click any destination card to inspect ground-truth validation rubric & data
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Column 1: Method A Output */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-red-400">
                    <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                      Method A Output (Popularity)
                    </span>
                    <span className="text-xs text-charcoal-500 font-mono">Cutoff: {effectiveK}</span>
                  </div>
                  {topA.map((dest, idx) => {
                    const isClosed = hasVerifiedClosure(dest.id, selectedMonth);
                    const grade = getGroundTruthGrade(dest.id, selectedMonth);
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestForModal(dest)}
                        className={`p-4 rounded-xl border transition cursor-pointer relative ${
                          isClosed
                            ? "bg-red-50/70 border-red-300 hover:border-red-400"
                            : "bg-ivory-50 border-ivory-200 hover:border-ivory-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-charcoal-800 text-ivory-50 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-charcoal-900">{dest.name}</h4>
                          </div>
                          <span className="text-xs font-mono text-charcoal-500">
                            Score: {dest.finalScore}
                          </span>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="text-charcoal-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold-600" />
                            {dest.state}
                          </span>
                          <span className="text-charcoal-500">
                            Popularity: {Math.round(dest.popularityScore * 100)}%
                          </span>
                        </div>

                        {isClosed ? (
                          <div className="mt-3 p-2 rounded bg-red-100 border border-red-300 text-red-800 text-xs flex items-start gap-1.5">
                            <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-semibold">FULL-CLOSURE RECORD MATCH</strong>
                              <span className="text-[11px] leading-tight block">
                                Ranked despite a current, evidence-backed full-closure record for {MONTHS[selectedMonth - 1].name}. Method A does not apply disruption rules.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-charcoal-500 flex items-center gap-1">
                            <span>Provisional Grade:</span>
                            <span className="font-bold text-charcoal-700">Grade {grade}/3</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Column 2: Method B Output */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-amber-400">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                      Method B Output (Seasonal Multi-Factor)
                    </span>
                    <span className="text-xs text-charcoal-500 font-mono">Cutoff: {effectiveK}</span>
                  </div>
                  {topB.map((dest, idx) => {
                    const isClosed = hasVerifiedClosure(dest.id, selectedMonth);
                    const grade = getGroundTruthGrade(dest.id, selectedMonth);
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestForModal(dest)}
                        className={`p-4 rounded-xl border transition cursor-pointer relative ${
                          isClosed
                            ? "bg-amber-50/70 border-amber-300 hover:border-amber-400"
                            : "bg-ivory-50 border-ivory-200 hover:border-ivory-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-600 text-ivory-50 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-charcoal-900">{dest.name}</h4>
                          </div>
                          <span className="text-xs font-mono font-semibold text-amber-900">
                            Score: {dest.finalScore}
                          </span>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="text-charcoal-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold-600" />
                            {dest.state}
                          </span>
                          <span className="text-charcoal-500">
                            Flow/Trail Fit: {Math.round((dest.scoreBreakdown.scenicFit || 0) * 100)}%
                          </span>
                        </div>

                        {isClosed ? (
                          <div className="mt-3 p-2 rounded bg-amber-100 border border-amber-300 text-amber-900 text-xs flex items-start gap-1.5">
                            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="block font-semibold">FULL-CLOSURE RECORD MATCH</strong>
                              <span className="text-[11px] leading-tight block">
                                This current, evidence-backed closure record is shown for comparison; Method B does not apply disruption rules.
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-charcoal-500 flex items-center gap-1">
                            <span>Provisional Grade:</span>
                            <span className="font-bold text-charcoal-700">Grade {grade}/3</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Column 3: Method C Output */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b-2 border-forest-500">
                    <span className="text-xs font-bold uppercase tracking-wider text-forest-700 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                      Method C Output (Disruption-Aware)
                    </span>
                    <span className="text-xs text-charcoal-500 font-mono">Cutoff: {effectiveK}</span>
                  </div>
                  {topC.map((dest, idx) => {
                    const grade = getGroundTruthGrade(dest.id, selectedMonth);
                    const isWarning = dest.status === "WARNING";
                    return (
                      <div
                        key={dest.id}
                        onClick={() => setSelectedDestForModal(dest)}
                        className="p-4 rounded-xl border bg-white border-forest-200 hover:border-forest-400 hover:shadow-sm transition cursor-pointer relative"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-forest-600 text-ivory-50 text-xs font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-forest-950">{dest.name}</h4>
                          </div>
                          <span className="text-xs font-mono font-bold text-forest-800">
                            Score: {dest.finalScore}
                          </span>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="text-charcoal-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gold-600" />
                            {dest.state}
                          </span>
                          <span className="font-semibold text-emerald-700 flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            No verified closure applied
                          </span>
                        </div>

                        {isWarning && (
                          <div className="mt-2.5 p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-tight">
                            ⚠️ <strong>Advisory Applied:</strong> {dest.activeDisruptions[0]?.title}
                          </div>
                        )}

                        <div className="mt-2 space-y-1 text-[11px] text-charcoal-500 pt-1 border-t border-ivory-200">
                          <span className="block">Provisional relevance label: {grade ?? "N/A"}/3</span>
                          <span className="block">
                            Score components: scenic {formatFractionPercent(dest.scoreBreakdown.scenicFit)}, weather {formatFractionPercent(dest.scoreBreakdown.weatherFit)}, popularity {formatFractionPercent(dest.scoreBreakdown.popularity)}, disruption multiplier {formatMetric(dest.scoreBreakdown.disruptionPenalty, 2)}.
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CONSUMER-FACING SEASONAL DISCOVERY */}
        {activeTab === "consumer" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-charcoal-900">
                    Seasonal Discovery in {MONTHS[selectedMonth - 1].name}
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-1">
                    Powered by Method C using provisional seasonal inputs and supplied disruption records; confirm current access with the responsible authority.
                  </p>
                </div>
                {/* Month Quick Selector */}
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-4 py-2 rounded-xl bg-ivory-100 border border-ivory-300 text-charcoal-800 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  {MONTHS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.season})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {rankedC.map((dest, idx) => {
                  const mData = dest.monthlyData[String(selectedMonth)] || {};
                  const isWarning = dest.status === "WARNING";
                  return (
                    <div
                      key={dest.id}
                      className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                        isWarning
                          ? "border-amber-300"
                          : "border-ivory-300 hover:border-gold-400"
                      }`}
                    >
                      {/* Image & Header */}
                      <div className="relative h-48 w-full overflow-hidden bg-charcoal-800">
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className={`w-full h-full object-cover transition duration-300 ${
                            "hover:scale-105"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />

                        {/* Rank Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-md text-ivory-50 text-xs font-bold border border-white/20">
                          #{idx + 1} Ranked
                        </div>

                        {/* Disruption Status Pill */}
                        <div className="absolute top-3 right-3">
                          {isWarning ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-charcoal-950 text-xs font-bold shadow-md flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Seasonal Advisory
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-charcoal-900/80 text-white text-xs font-bold shadow-md flex items-center gap-1">
                              <Info className="w-3.5 h-3.5" />
                              {dest.disruptionAssessment === "UNKNOWN_RECORDS_PRESENT"
                                ? "Closure status unknown"
                                : dest.disruptionAssessment === "NO_RECORD_SUPPLIED"
                                  ? "No closure record supplied"
                                  : "No qualifying closure applied"}
                            </span>
                          )}
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="text-lg font-bold drop-shadow-md">{dest.name}</h4>
                          <p className="text-xs text-ivory-200 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gold-400" />
                            {dest.state} • {dest.category.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        {/* Climate & Environmental Metrics */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-xl bg-ivory-100 flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-terracotta-500" />
                            <div>
                              <span className="text-[10px] text-charcoal-500 block">Avg Temp</span>
                              <span className="font-bold text-charcoal-800">{Number.isFinite(mData.avgTempC) ? `${mData.avgTempC}°C` : "N/A"}</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-ivory-100 flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-blue-500" />
                            <div>
                              <span className="text-[10px] text-charcoal-500 block">Monthly Rain</span>
                              <span className="font-bold text-charcoal-800">{Number.isFinite(mData.rainfallMm) ? `${mData.rainfallMm} mm` : "N/A"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Condition Note */}
                        <div className="text-xs">
                          <span className="font-semibold text-charcoal-700 block">Trail / Flow Status:</span>
                          <span className="text-charcoal-600">{mData.trailCondition || "No condition note recorded"}</span>
                        </div>

                        {/* Verified Disruption Banner */}
                        {dest.activeDisruptions && dest.activeDisruptions.length > 0 && (
                          <div className={`p-3 rounded-xl text-xs ${
                            "bg-amber-50 border border-amber-200 text-amber-900"
                          }`}>
                            <strong className="block font-bold mb-1">
                              {dest.activeDisruptions[0].title}
                            </strong>
                            <p className="text-[11px] leading-relaxed">
                              {dest.activeDisruptions[0].description}
                            </p>
                            <span className="block mt-1 text-[10px] font-mono opacity-80">
                              Order: {dest.activeDisruptions[0].officialOrderReference}
                            </span>
                          </div>
                        )}

                        {/* Suitability Meter */}
                        <div>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-semibold text-charcoal-600">Seasonal Suitability Score</span>
                            <span className="font-bold font-mono text-charcoal-900">
                              {Number.isFinite(dest.finalScore) ? `${Math.round(dest.finalScore * 100)}%` : "N/A"}
                            </span>
                          </div>
                          <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                dest.finalScore > 0.7
                                  ? "bg-forest-500"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${Number.isFinite(dest.finalScore) ? Math.round(dest.finalScore * 100) : 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-2 flex items-center justify-between border-t border-ivory-200 text-xs">
                          <span className="text-charcoal-500 text-[11px]">
                            Authority: {typeof dest.regulatoryAuthority === "string" && dest.regulatoryAuthority.trim()
                              ? dest.regulatoryAuthority.split("/")[0].trim()
                              : "Not recorded"}
                          </span>
                          <button
                            onClick={() => setSelectedDestForModal(dest)}
                            className="font-semibold text-gold-700 hover:text-gold-800 flex items-center gap-1"
                          >
                            Inspect Data
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {(quarantinedC.length > 0 || ineligibleC.length > 0 || ignoredDisruptionsC.length > 0) && (
                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-charcoal-700">
                  <h4 className="font-semibold">Eligibility and disruption audit</h4>
                  <p className="mt-1 text-xs">
                    Recommendations include only destinations with complete required scoring fields and no applicable, current, evidence-backed full-destination closure. Ignored disruption records do not affect scores.
                  </p>
                  {quarantinedC.length > 0 && <p className="mt-2">Excluded by verified full-closure rule: {quarantinedC.map((item) => item.name).join(", ")}.</p>}
                  {ineligibleC.length > 0 && <p className="mt-2">Not ranked because required score inputs are missing: {ineligibleC.map((item) => `${item.name} (${item.dataQualityIssues.join(", ")})`).join("; ")}.</p>}
                  {ignoredDisruptionsC.length > 0 && <p className="mt-2">Supplied records not applied: {ignoredDisruptionsC.map((item) => `${item.title} (${item.assessment}: ${item.reason})`).join("; ")}. UNKNOWN means the record does not establish that conditions are clear.</p>}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: FULL BENCHMARK MATRIX */}
        {activeTab === "benchmark" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-charcoal-900">
                    Benchmark Matrix ({benchmarkData.scenarios.length} Scenarios)
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-1">
                    Exploratory evaluation across three activity pools. Results macro-average scenarios with pool-specific K values.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyLatex}
                    className="px-3.5 py-1.5 rounded-lg bg-charcoal-900 text-ivory-50 text-xs font-semibold hover:bg-charcoal-800 transition flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy LaTeX Table
                  </button>
                  <button
                    onClick={handleDownloadCSV}
                    className="px-3.5 py-1.5 rounded-lg bg-gold-500 text-charcoal-950 text-xs font-semibold hover:bg-gold-600 transition flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                </div>
              </div>

              {/* Aggregate Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-charcoal-900 text-ivory-50">
                      <th className="p-3 font-semibold rounded-tl-lg">Scenario Cohort</th>
                      <th className="p-3 font-semibold">Scenarios</th>
                      <th className="p-3 font-semibold">Method A P@K / NDCG@K</th>
                      <th className="p-3 font-semibold">Method B P@K / NDCG@K</th>
                      <th className="p-3 font-semibold bg-forest-800 text-gold-300">Method C P@K / NDCG@K</th>
                      <th className="p-3 font-semibold">A full-closure conflict</th>
                      <th className="p-3 font-semibold bg-forest-800 text-gold-300 rounded-tr-lg">C full-closure conflict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200 font-mono">
                    {[
                      ["Category-specific holdout", benchmarkData.aggregateResults.categorySpecificHoldout,
                        "Feb, Apr, Sep, Nov; selection rationale and historical tuning independence are undocumented."],
                      ["Category-specific development", benchmarkData.aggregateResults.categorySpecificDevelopment,
                        "Eight other months across waterfall and trekking pools."],
                      ["Category-specific total", benchmarkData.aggregateResults.categorySpecific,
                        "24 waterfall and trekking scenarios; excludes mixed activity."],
                      ["All-scenario holdout", benchmarkData.aggregateResults.holdout,
                        "12 scenarios across all pools in Feb, Apr, Sep, and Nov; exploratory split."],
                      ["All-scenario development", benchmarkData.aggregateResults.development,
                        "24 scenarios across all pools in the other eight months."],
                      ["All scenarios", benchmarkData.aggregateResults.overall,
                        "36 scenarios; includes 12 mixed-activity scenarios, K=5 there and K=3 in single-activity pools."],
                    ].map(([label, cohort, detail]) => (
                      <tr key={label} className="hover:bg-ivory-50">
                        <td className="p-3 font-sans font-bold text-charcoal-900">
                          {label}<span className="block text-[10px] text-charcoal-500 font-normal">{detail}</span>
                        </td>
                        <td className="p-3">{cohort.scenarioCount}</td>
                        {[cohort.methodA, cohort.methodB, cohort.methodC].map((method, index) => (
                          <td key={index} className={`p-3 ${index === 2 ? "font-bold text-forest-700 bg-forest-50/50" : "text-charcoal-700"}`}>
                            P@K {formatFractionPercent(method.precisionAtK)}<br />P@K undefined: {method.precisionExcludedScenarios}<br />NDCG@K {formatMetric(method.ndcgAtK)}<br />NDCG undefined: {method.ndcgExcludedScenarios}
                          </td>
                        ))}
                        <td className="p-3">{formatPercent(cohort.methodA.closureConflictPercent)}<br /><span className="text-[10px] text-charcoal-500">N/A: {explainClosureReasons(cohort.methodA.closureConflictReasonCounts)}</span></td>
                        <td className="p-3">{formatPercent(cohort.methodC.closureConflictPercent)}<br /><span className="text-[10px] text-charcoal-500">N/A: {explainClosureReasons(cohort.methodC.closureConflictReasonCounts)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-charcoal-600">
                NDCG scenarios with missing labels or zero ideal DCG are excluded and counted. P@K uses the number of eligible returned items up to requested K; per-method eligible pool sizes and actual K are in the CSV. Closure conflict is undefined (N/A) where no current, evidence-backed full-closure reference exists. Mean seasonal coverage: {formatFractionPercent(benchmarkData.aggregateResults.overall.coverage.seasonalDataCoverage)}; relevance-label coverage: {formatFractionPercent(benchmarkData.aggregateResults.overall.coverage.relevanceLabelCoverage)}; disruption evidence coverage: {formatFractionPercent(benchmarkData.aggregateResults.overall.coverage.disruptionEvidenceCoverage)}.
              </p>

              {/* Notable Divergence Highlights */}
              <div className="mt-8 pt-6 border-t border-ivory-200">
                <h4 className="text-base font-bold text-charcoal-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-gold-600" />
                  Key Empirical Divergences & Error Analysis
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {benchmarkData.notableDivergences.slice(0, 4).map((div, i) => (
                    <div key={i} className="p-4 rounded-xl bg-ivory-50 border border-ivory-300 text-xs">
                      <div className="flex justify-between items-center font-bold text-charcoal-900 mb-1">
                        <span>{div.activity.toUpperCase()} in {div.monthName}</span>
                        <span className="text-forest-700 font-mono">
                          NDCG delta vs A: {formatFractionPercent(div.ndcgLift)}
                        </span>
                      </div>
                      <p className="text-charcoal-600 leading-relaxed">
                        Method A full-closure conflict rate: <strong>{formatFractionPercent(div.ccrMethodA)}</strong>. Method C exclusion applies only to current evidence-backed full-destination closures; the current records do not establish independent real-world verification.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: IEEE RESEARCH PAPER BLUEPRINT */}
        {activeTab === "paper" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 shadow-bs-md border border-ivory-300 prose prose-charcoal max-w-none">
              <div className="flex justify-between items-start border-b border-ivory-200 pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold-700 block">
                    IEEE Conference Paper Preprint Blueprint
                  </span>
                  <h2 className="text-2xl font-serif font-bold text-charcoal-900 mt-1">
                    Evaluating Seasonal and Disruption-Aware Ranking for Sustainable Tourism Recommendation
                  </h2>
                </div>
                <button
                  onClick={handleCopyLatex}
                  className="px-4 py-2 rounded-xl bg-charcoal-900 text-ivory-50 text-xs font-semibold hover:bg-charcoal-800 transition flex items-center gap-1.5 shrink-0"
                >
                  <Copy className="w-4 h-4" />
                  Copy LaTeX Source
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 not-prose text-xs">
                <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300">
                  <strong className="block text-charcoal-900 mb-1 font-bold">Research Question 1 (RQ1)</strong>
                  <p className="text-charcoal-600">
                    Does seasonal suitability ranking improve provisional relevance over the popularityScore baseline?
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300">
                  <strong className="block text-charcoal-900 mb-1 font-bold">Research Question 2 (RQ2)</strong>
                  <p className="text-charcoal-600">
                    What ranking-quality change accompanies the seasonal scoring model on this dataset?
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300">
                  <strong className="block text-charcoal-900 mb-1 font-bold">Research Question 3 (RQ3)</strong>
                  <p className="text-charcoal-600">
                    Does Method C exclude destinations matching the benchmark's supplied absolute-closure records, and how do ranking metrics compare?
                  </p>
                </div>
              </div>

              <div className="text-sm text-charcoal-700 space-y-4">
                <h4 className="font-bold text-charcoal-900">Abstract Summary</h4>
                <p>
                  This exploratory benchmark compares three ranking methods across {benchmarkData.scenarios.length} scenarios and nine destinations: 24 single-activity waterfall and trekking scenarios plus 12 mixed-activity scenarios. Requested cutoffs are K=3 for single-activity pools and K=5 for the mixed pool, so the reported values are NDCG@K macro-averages, not a single fixed-K statistic. NDCG@K is {formatMetric(overallResults.methodA.ndcgAtK)} for Method A, {formatMetric(overallResults.methodB.ndcgAtK)} for Method B, and {formatMetric(overallResults.methodC.ndcgAtK)} for Method C. The highest defined aggregate is {ndcgLeaders.join(" and ") || "not available"}. These relevance labels are provisional single-annotator labels without recorded per-label evidence or independent validation. The supplied disruption records currently yield {overallResults.methodC.closureConflictPercent === null ? "no estimable full-closure conflict rate" : `${formatPercent(overallResults.methodC.closureConflictPercent)} Method C full-closure conflict`}; this is not evidence of safety. The contribution is an auditable evaluation prototype, not a guarantee of safe travel or generalisation beyond these nine destinations.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Ground Truth & Destination Detail Modal */}
      <AnimatePresence>
        {selectedDestForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-ivory-300 overflow-hidden relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedDestForModal(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-ivory-100 hover:bg-ivory-200 text-charcoal-600 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="p-2 rounded-xl bg-gold-100 text-gold-800">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-charcoal-900">{selectedDestForModal.name}</h3>
                  <p className="text-xs text-charcoal-500">
                    {selectedDestForModal.state} • Elevation: {selectedDestForModal.elevationMeters}m
                  </p>
                </div>
              </div>

              {/* Monthly Ground Truth Details */}
              <div className="p-4 rounded-2xl bg-ivory-100 border border-ivory-200 space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-charcoal-700">
                    Evaluation in {MONTHS[selectedMonth - 1].name}:
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-charcoal-900 text-ivory-50 text-xs font-mono font-bold">
                    Relevance Grade: {getGroundTruthGrade(selectedDestForModal.id, selectedMonth) ?? "N/A"} / 3
                  </span>
                </div>
                <p className="text-xs text-charcoal-700 italic leading-relaxed">
                  "{getGroundTruthRationale(selectedDestForModal.id, selectedMonth) || "No rationale recorded."}"
                </p>
              </div>

              {/* Monthly Climate & Operating Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Avg Temp</span>
                  <span className="font-bold text-charcoal-900">
                    {Number.isFinite(selectedDestForModal.monthlyData?.[String(selectedMonth)]?.avgTempC)
                      ? `${selectedDestForModal.monthlyData[String(selectedMonth)].avgTempC}°C` : "N/A"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Monthly Rain</span>
                  <span className="font-bold text-charcoal-900">
                    {Number.isFinite(selectedDestForModal.monthlyData?.[String(selectedMonth)]?.rainfallMm)
                      ? `${selectedDestForModal.monthlyData[String(selectedMonth)].rainfallMm} mm` : "N/A"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Flow / Snow</span>
                  <span className="font-bold text-charcoal-900 truncate block">
                    {selectedDestForModal.monthlyData?.[String(selectedMonth)]?.flowLevel || "N/A"}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Popularity</span>
                  <span className="font-bold text-charcoal-900">
                    {Number.isFinite(selectedDestForModal.popularityScore)
                      ? `${Math.round(selectedDestForModal.popularityScore * 100)}%` : "N/A"}
                  </span>
                </div>
              </div>

              {/* Regulatory Authority */}
              <div className="p-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs">
                <span className="font-semibold text-charcoal-700 block">Regulatory Authority:</span>
                <span className="text-charcoal-600">{typeof selectedDestForModal.regulatoryAuthority === "string" && selectedDestForModal.regulatoryAuthority.trim()
                  ? selectedDestForModal.regulatoryAuthority : "Not recorded"}</span>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedDestForModal(null)}
                  className="px-5 py-2 rounded-xl bg-charcoal-900 text-ivory-50 text-xs font-semibold hover:bg-charcoal-800 transition"
                >
                  Close Inspector
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
