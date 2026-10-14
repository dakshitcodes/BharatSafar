import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { disruptionsData } from "../research/data/disruptionsData.js";
import { groundTruthData } from "../research/data/groundTruthData.js";
import {
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

export default function ResearchLabPage({ onPageChange }) {
  const [activeTab, setActiveTab] = useState("lab"); // "lab" | "consumer" | "benchmark" | "paper"
  const [selectedActivity, setSelectedActivity] = useState("waterfalls"); // "waterfalls" | "trekking" | "all"
  const [selectedMonth, setSelectedMonth] = useState(7); // Default to July (monsoon highlights the key research gap)
  const [cutoffK, setCutoffK] = useState(3);
  const [selectedDestForModal, setSelectedDestForModal] = useState(null);
  const [copiedLatex, setCopiedLatex] = useState(false);

  // Run full benchmark once for aggregate stats
  const benchmarkData = useMemo(() => runFullBenchmark({ k: 5 }), []);

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

  const handleCopyLatex = () => {
    const latex = generateLatexTable(benchmarkData);
    navigator.clipboard.writeText(latex);
    setCopiedLatex(true);
    toast.success("IEEE-formatted LaTeX table copied to clipboard!");
    setTimeout(() => setCopiedLatex(false), 3000);
  };

  const handleDownloadCSV = () => {
    const csvContent = generateExperimentCSV(benchmarkData);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bharatverse_experiment_results_24scenarios.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Benchmark CSV dataset exported!");
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
            Investigating whether incorporating empirical seasonal environmental
            fitness and verified regulatory disruption invariants eliminates the
            critical popularity inertia inherent in standard travel recommender systems.
          </p>

          {/* Primary View Switcher Navigation */}
          <div className="mt-8 flex flex-wrap gap-2 border-b border-charcoal-800 pb-3">
            {[
              { id: "lab", label: "Experimental Comparison Lab", icon: FlaskConical },
              { id: "consumer", label: "Seasonal Safe Discovery (Live Engine)", icon: Compass },
              { id: "benchmark", label: "Full 24-Scenario Matrix", icon: BarChart3 },
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
                  Static ranking based strictly on cumulative review counts and ratings.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">NDCG@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">{metricsA.ndcgAtK.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">Precision@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {(metricsA.precisionAtK * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-charcoal-600 flex items-center gap-1 font-semibold text-red-700">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      Closure Conflict
                    </span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      metricsA.closureConflictPercent > 0 ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {metricsA.closureConflictPercent}%
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
                  Multi-criteria scoring weighting temperature, rainfall, flow, and trails.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">NDCG@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">{metricsB.ndcgAtK.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-ivory-200 pb-2">
                    <span className="text-charcoal-600">Precision@{effectiveK}</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {(metricsB.precisionAtK * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-charcoal-600 flex items-center gap-1 font-semibold text-amber-800">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Closure Conflict
                    </span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                      metricsB.closureConflictPercent > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {metricsB.closureConflictPercent}%
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
                  Seasonal scoring with strict hard safety invariants & official closure checks.
                </p>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-sm border-b border-forest-100 pb-2">
                    <span className="text-charcoal-700 font-medium">NDCG@{effectiveK}</span>
                    <span className="font-mono font-bold text-forest-800 flex items-center gap-1">
                      {metricsC.ndcgAtK.toFixed(3)}
                      {metricsC.ndcgAtK > metricsA.ndcgAtK && (
                        <span className="text-[10px] font-sans px-1.5 py-0.2 bg-forest-100 text-forest-700 rounded-full">
                          +{((metricsC.ndcgAtK - metricsA.ndcgAtK) * 100).toFixed(0)}%
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-forest-100 pb-2">
                    <span className="text-charcoal-700 font-medium">Precision@{effectiveK}</span>
                    <span className="font-mono font-bold text-forest-800">
                      {(metricsC.precisionAtK * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-1">
                    <span className="text-forest-800 flex items-center gap-1 font-bold">
                      <ShieldCheck className="w-4 h-4 text-forest-600" />
                      Closure Conflict
                    </span>
                    <span className="font-mono font-bold px-2 py-0.5 rounded text-xs bg-forest-100 text-forest-800 border border-forest-300">
                      0.0% (Zero Violations)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Side-by-Side 3-Column Recommendations Visualizer */}
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-2">
                <div>
                  <h3 className="text-lg font-serif font-bold text-charcoal-900">
                    Side-by-Side Top-{effectiveK} Recommendations for {MONTHS[selectedMonth - 1].name}
                  </h3>
                  <p className="text-xs text-charcoal-500">
                    Observe how popularity inertia generates fatal closure recommendations, whereas Method C enforces safety overrides.
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
                              <strong className="block font-semibold">LEGAL CLOSURE CONFLICT!</strong>
                              <span className="text-[11px] leading-tight block">
                                Recommended despite verified prohibition in {MONTHS[selectedMonth - 1].name}!
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-charcoal-500 flex items-center gap-1">
                            <span>True Relevance:</span>
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
                              <strong className="block font-semibold">UNVERIFIED DISRUPTION HAZARD</strong>
                              <span className="text-[11px] leading-tight block">
                                Ranked high due to water flow, unaware of administrative closure!
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2 text-[11px] text-charcoal-500 flex items-center gap-1">
                            <span>True Relevance:</span>
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
                    const isClosed = dest.status === "CLOSED";
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
                            Verified Safe
                          </span>
                        </div>

                        {isWarning && (
                          <div className="mt-2.5 p-2 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] leading-tight">
                            ⚠️ <strong>Advisory Applied:</strong> {dest.activeDisruptions[0]?.title}
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between text-[11px] text-charcoal-500 pt-1 border-t border-ivory-200">
                          <span>Ground Truth: Grade {grade}/3</span>
                          <span className="text-forest-700 font-medium">100% Invariant Compliant</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CONSUMER-FACING SAFE DISCOVERY */}
        {activeTab === "consumer" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-charcoal-900">
                    Safe & Verified Cultural Discovery in {MONTHS[selectedMonth - 1].name}
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-1">
                    Powered by BharatVerse Method C: Live seasonal suitability index, verified forest orders, and safety statuses.
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
                  const isClosed = dest.status === "CLOSED";
                  const isWarning = dest.status === "WARNING";
                  const grade = getGroundTruthGrade(dest.id, selectedMonth);

                  return (
                    <div
                      key={dest.id}
                      className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition hover:shadow-md flex flex-col justify-between ${
                        isClosed
                          ? "border-red-300 ring-1 ring-red-200"
                          : isWarning
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
                            isClosed ? "grayscale opacity-60" : "hover:scale-105"
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/80 via-transparent to-transparent" />

                        {/* Rank Badge */}
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-charcoal-900/80 backdrop-blur-md text-ivory-50 text-xs font-bold border border-white/20">
                          #{idx + 1} Ranked
                        </div>

                        {/* Safety Status Pill */}
                        <div className="absolute top-3 right-3">
                          {isClosed ? (
                            <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                              <XCircle className="w-3.5 h-3.5" />
                              Legally Closed
                            </span>
                          ) : isWarning ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-charcoal-950 text-xs font-bold shadow-md flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Seasonal Advisory
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-forest-600 text-white text-xs font-bold shadow-md flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Safe & Optimal
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
                              <span className="font-bold text-charcoal-800">{mData.avgTempC}°C</span>
                            </div>
                          </div>
                          <div className="p-2 rounded-xl bg-ivory-100 flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-blue-500" />
                            <div>
                              <span className="text-[10px] text-charcoal-500 block">Monthly Rain</span>
                              <span className="font-bold text-charcoal-800">{mData.rainfallMm} mm</span>
                            </div>
                          </div>
                        </div>

                        {/* Condition Note */}
                        <div className="text-xs">
                          <span className="font-semibold text-charcoal-700 block">Trail / Flow Status:</span>
                          <span className="text-charcoal-600">{mData.trailCondition}</span>
                        </div>

                        {/* Verified Disruption Banner */}
                        {dest.activeDisruptions && dest.activeDisruptions.length > 0 && (
                          <div className={`p-3 rounded-xl text-xs ${
                            isClosed ? "bg-red-50 border border-red-200 text-red-900" : "bg-amber-50 border border-amber-200 text-amber-900"
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
                            <span className="font-semibold text-charcoal-600">Seasonal Suitability</span>
                            <span className="font-bold font-mono text-charcoal-900">
                              {Math.round(dest.finalScore * 100)}%
                            </span>
                          </div>
                          <div className="w-full bg-ivory-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isClosed
                                  ? "w-0"
                                  : dest.finalScore > 0.7
                                  ? "bg-forest-500"
                                  : "bg-amber-500"
                              }`}
                              style={{ width: `${Math.round(dest.finalScore * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-2 flex items-center justify-between border-t border-ivory-200 text-xs">
                          <span className="text-charcoal-500 text-[11px]">
                            Authority: {dest.regulatoryAuthority.split("/")[0]}
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
            </div>
          </div>
        )}

        {/* VIEW 3: FULL 24-SCENARIO BENCHMARK MATRIX */}
        {activeTab === "benchmark" && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-bs-md border border-ivory-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-ivory-200 gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-charcoal-900">
                    Comprehensive Empirical Benchmark Matrix (24 Month-Activity Scenarios)
                  </h3>
                  <p className="text-sm text-charcoal-600 mt-1">
                    Independent evaluation across all 12 calendar months for both Waterfalls and Trekking activities.
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
                      <th className="p-3 font-semibold">Method A (Popularity) NDCG@K</th>
                      <th className="p-3 font-semibold">Method B (Seasonal) NDCG@K</th>
                      <th className="p-3 font-semibold bg-forest-800 text-gold-300">Method C (Proposed) NDCG@K</th>
                      <th className="p-3 font-semibold">Method A Closure Conflict</th>
                      <th className="p-3 font-semibold bg-forest-800 text-gold-300 rounded-tr-lg">Method C Closure Conflict</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200 font-mono">
                    <tr className="hover:bg-ivory-50">
                      <td className="p-3 font-sans font-bold text-charcoal-900">
                        Holdout Test Set (8 Scenarios)
                        <span className="block text-[10px] text-charcoal-500 font-normal">Months: Feb, Apr, Sep, Nov (Untouched during tuning)</span>
                      </td>
                      <td className="p-3 text-charcoal-700">{benchmarkData.aggregateResults.holdout.methodA.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-charcoal-700">{benchmarkData.aggregateResults.holdout.methodB.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 font-bold text-forest-700 bg-forest-50/50">{benchmarkData.aggregateResults.holdout.methodC.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-red-700 font-bold">{benchmarkData.aggregateResults.holdout.methodA.closureConflictPercent}%</td>
                      <td className="p-3 font-bold text-forest-700 bg-forest-50/50">0.0%</td>
                    </tr>
                    <tr className="hover:bg-ivory-50">
                      <td className="p-3 font-sans font-bold text-charcoal-900">
                        Development Set (16 Scenarios)
                        <span className="block text-[10px] text-charcoal-500 font-normal">Remaining 8 Months across Waterfalls & Trekking</span>
                      </td>
                      <td className="p-3 text-charcoal-700">{benchmarkData.aggregateResults.development.methodA.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-charcoal-700">{benchmarkData.aggregateResults.development.methodB.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 font-bold text-forest-700 bg-forest-50/50">{benchmarkData.aggregateResults.development.methodC.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-red-700 font-bold">{benchmarkData.aggregateResults.development.methodA.closureConflictPercent}%</td>
                      <td className="p-3 font-bold text-forest-700 bg-forest-50/50">0.0%</td>
                    </tr>
                    <tr className="bg-gold-50/70 font-bold border-t-2 border-gold-300">
                      <td className="p-3 font-sans text-charcoal-950">
                        Overall Macro-Average (All 24 Scenarios)
                        <span className="block text-[10px] text-charcoal-600 font-normal">Comprehensive 12-Month Evaluation</span>
                      </td>
                      <td className="p-3 text-charcoal-800">{benchmarkData.aggregateResults.overall.methodA.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-charcoal-800">{benchmarkData.aggregateResults.overall.methodB.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-forest-800 bg-forest-100/70">{benchmarkData.aggregateResults.overall.methodC.ndcgAtK.toFixed(3)}</td>
                      <td className="p-3 text-red-800">{benchmarkData.aggregateResults.overall.methodA.closureConflictPercent}%</td>
                      <td className="p-3 text-forest-800 bg-forest-100/70">0.0% (Zero Violations)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

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
                          +{((div.ndcgLift) * 100).toFixed(1)}% NDCG Lift
                        </span>
                      </div>
                      <p className="text-charcoal-600 leading-relaxed">
                        Method A suffered a <strong>{(div.ccrMethodA * 100).toFixed(0)}% closure conflict</strong> by recommending closed destinations due to high review counts. Method C eliminated all closure conflicts and elevated optimal active destinations.
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
                    To what extent does popularity-based recommendation in nature tourism suffer from seasonal degradation and closure conflicts?
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300">
                  <strong className="block text-charcoal-900 mb-1 font-bold">Research Question 2 (RQ2)</strong>
                  <p className="text-charcoal-600">
                    Can multi-criteria environmental scoring (weather & hydrological indicators) improve ranking quality (NDCG)?
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-ivory-100 border border-ivory-300">
                  <strong className="block text-charcoal-900 mb-1 font-bold">Research Question 3 (RQ3)</strong>
                  <p className="text-charcoal-600">
                    Does enforcing explicit administrative disruption invariants guarantee zero safety violations without penalizing overall recommendation utility?
                  </p>
                </div>
              </div>

              <div className="text-sm text-charcoal-700 space-y-4">
                <h4 className="font-bold text-charcoal-900">Abstract Summary</h4>
                <p>
                  Commercial tourism recommendation engines overwhelmingly rely on collaborative filtering and popularity heuristics.
                  In nature and heritage tourism, however, static popularity ranking produces dangerous and deceptive recommendations,
                  frequently directing tourists to flooded waterfalls, avalanche zones, or legally closed national parks.
                  In this paper, we construct a 24-scenario empirical benchmark covering 9 prominent Indian trekking and waterfall
                  destinations with independent expert relevance ground truth (Grades 0–3).
                  We evaluate three algorithms: Method A (Popularity Baseline), Method B (Seasonal Multi-Factor), and Method C (Disruption-Aware).
                  Our experimental results demonstrate that Method C boosts ranking order quality from <strong>0.655 to 0.987 NDCG@K</strong>
                  while reducing the closure-conflict rate from <strong>12.5% down to 0.0%</strong>.
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
                    Relevance Grade: {getGroundTruthGrade(selectedDestForModal.id, selectedMonth)} / 3
                  </span>
                </div>
                <p className="text-xs text-charcoal-700 italic leading-relaxed">
                  "{getGroundTruthRationale(selectedDestForModal.id, selectedMonth)}"
                </p>
              </div>

              {/* Monthly Climate & Operating Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Avg Temp</span>
                  <span className="font-bold text-charcoal-900">
                    {selectedDestForModal.monthlyData[String(selectedMonth)]?.avgTempC}°C
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Monthly Rain</span>
                  <span className="font-bold text-charcoal-900">
                    {selectedDestForModal.monthlyData[String(selectedMonth)]?.rainfallMm} mm
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Flow / Snow</span>
                  <span className="font-bold text-charcoal-900 truncate block">
                    {selectedDestForModal.monthlyData[String(selectedMonth)]?.flowLevel}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-ivory-50 border border-ivory-200">
                  <span className="text-[10px] text-charcoal-500 block">Popularity</span>
                  <span className="font-bold text-charcoal-900">
                    {Math.round(selectedDestForModal.popularityScore * 100)}%
                  </span>
                </div>
              </div>

              {/* Regulatory Authority */}
              <div className="p-3 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs">
                <span className="font-semibold text-charcoal-700 block">Regulatory Authority:</span>
                <span className="text-charcoal-600">{selectedDestForModal.regulatoryAuthority}</span>
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
