import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Clock,
  Users,
  MapPin,
  Gift,
  History,
  Sparkles,
} from "lucide-react";
import { ritualDetailsData } from "../utils/ritualDetailsData";

const RitualExplorerPage = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedRitual, setSelectedRitual] = useState(null);

  const states = Object.keys(ritualDetailsData).sort();
  const rituals = selectedState ? Object.keys(ritualDetailsData[selectedState]) : [];
  const ritualDetails =
    selectedState && selectedRitual
      ? ritualDetailsData[selectedState][selectedRitual]
      : null;

  const handleStateChange = (state) => {
    setSelectedState(state);
    setSelectedRitual(null);
  };

  const handleRitualChange = (ritual) => {
    setSelectedRitual(ritual);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section with Video Background */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source
             src="https://res.cloudinary.com/bharatverse/video/upload/v1766499649/bharatverse_public/jfezyhbtv6usxh1wttio.mp4"
            controls
          />
          
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/20" />

        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-pink-900/30" />

        {/* Content - Centered */}
        <div className="relative h-full flex flex-col items-center justify-center px-4 z-10">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8 max-w-4xl"
          >
            <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 drop-shadow-lg">
              Rituals
              Explorer
            </h1>
            <p className="text-2xl md:text-3xl text-white/90 drop-shadow-lg leading-relaxed">
              Dive deep into India's sacred rituals, their history, and cultural
              significance across all 29 states
            </p>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-32 text-white/60"
          >
            <ChevronDown size={40} className="animate-pulse" />
          </motion.div>
        </div>

        {/* Dropdowns - Positioned at Bottom of Video Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute bottom-0 left-0 right-0 z-20"
        >
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent pt-16 pb-8 px-4">
            <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-6">
              {/* State Dropdown */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">
                  🏛️ Select State
                </label>
                <div className="relative">
                  <select
                    value={selectedState || ""}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="bs-input cursor-pointer bg-white text-charcoal-900 pr-10"
                  >
                    <option value="">Choose a state...</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-600 pointer-events-none size-5" />
                </div>
              </div>

              {/* Ritual Dropdown */}
              <div>
                <label className="block text-lg font-bold text-white mb-3">
                   Select Ritual
                </label>
                <div className="relative">
                  <select
                    value={selectedRitual || ""}
                    onChange={(e) => handleRitualChange(e.target.value)}
                    disabled={!selectedState}
                    className="bs-input cursor-pointer bg-white text-charcoal-900 pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {selectedState ? "Choose a ritual..." : "Select state first"}
                    </option>
                    {rituals.map((ritual) => (
                      <option key={ritual} value={ritual}>
                        {ritual}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gold-600 pointer-events-none size-5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ritual Details - Below Video */}
      {ritualDetails && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="py-12 px-4 bg-ivory-100"
        >
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-bs-sm overflow-hidden border border-ivory-200">
              {/* Header */}
              <div className="bg-charcoal-900 p-8 text-white">
                <h2 className="text-5xl font-display font-bold mb-3 text-gold-400">{selectedRitual}</h2>
                <p className="text-xl font-sans opacity-90">{ritualDetails.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="bg-charcoal-800 px-4 py-2 rounded-full text-sm border border-charcoal-700">
                    📍 {selectedState}
                  </span>
                  <span className="bg-charcoal-800 px-4 py-2 rounded-full text-sm border border-charcoal-700">
                    ⏱️ {ritualDetails.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* History */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-ivory-50 rounded-2xl p-6 border-l-4 border-gold-500"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <History className="text-blue-600" size={28} />
                    <h3 className="text-2xl font-bold text-charcoal-900">History</h3>
                  </div>
                  <p className="text-charcoal-700 leading-relaxed text-lg">
                    {ritualDetails.history}
                  </p>
                </motion.div>

                {/* Significance */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-yellow-50 rounded-2xl p-6 border-l-4 border-yellow-500"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className="text-yellow-600" size={28} />
                    <h3 className="text-2xl font-bold text-charcoal-900">
                      Significance
                    </h3>
                  </div>
                  <p className="text-charcoal-700 leading-relaxed text-lg">
                    {ritualDetails.significance}
                  </p>
                </motion.div>

                {/* Cultural Importance */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-purple-50 rounded-2xl p-6 border-l-4 border-purple-500"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <Sparkles className="text-purple-600" size={28} />
                    <h3 className="text-2xl font-bold text-charcoal-900">
                      Cultural Importance
                    </h3>
                  </div>
                  <p className="text-charcoal-700 leading-relaxed text-lg">
                    {ritualDetails.culturalImportance}
                  </p>
                </motion.div>

                {/* Process */}
                {ritualDetails.process && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-green-50 rounded-2xl p-6 border-l-4 border-green-500"
                  >
                    <h3 className="text-2xl font-bold text-charcoal-900 mb-4">
                      Step-by-Step Process
                    </h3>
                    <ol className="space-y-3">
                      {ritualDetails.process.map((step, idx) => (
                        <li key={idx} className="flex items-start space-x-4">
                          <span className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-charcoal-700 pt-2 text-lg">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </motion.div>
                )}

                {/* Quick Facts Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="grid md:grid-cols-2 gap-4"
                >
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <Clock className="text-blue-600" size={24} />
                      <h4 className="font-bold text-charcoal-900">Duration</h4>
                    </div>
                    <p className="text-charcoal-700 text-lg">{ritualDetails.duration}</p>
                  </div>

                  <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-6 border border-red-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="text-red-600" size={24} />
                      <h4 className="font-bold text-charcoal-900">Participants</h4>
                    </div>
                    <p className="text-charcoal-700 text-lg">{ritualDetails.participants}</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="text-green-600" size={24} />
                      <h4 className="font-bold text-charcoal-900">Region</h4>
                    </div>
                    <p className="text-charcoal-700 text-lg">{ritualDetails.region}</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-2">
                      <Gift className="text-purple-600" size={24} />
                      <h4 className="font-bold text-charcoal-900">Offerings</h4>
                    </div>
                    <p className="text-charcoal-700 text-lg">{ritualDetails.offerings}</p>
                  </div>
                </motion.div>

                {/* Best Time */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 border-2 border-orange-300"
                >
                  <h4 className="font-bold text-charcoal-900 mb-2 text-lg">
                    🎯 Best Time to Witness
                  </h4>
                  <p className="text-charcoal-700 mb-4 text-lg">
                    {ritualDetails.bestTime}
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-sm text-gray-600">
                      💡 <strong>Search on YouTube:</strong> "{ritualDetails.videos}"
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!ritualDetails && (
        
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="py-16 px-4 bg-ivory-100"
>
 <div className="text-center max-w-3xl mx-auto">
    
    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
      Select a state and ritual to explore
    </h2>
    <p className="text-2xl md:text-3xl text-charcoal-700 font-semibold mb-4">
      Discover the rich history, significance, and process
    </p>
    <p className="text-xl md:text-2xl text-gray-600">
      of India's sacred traditions across all 29 states
    </p>
  </div>
</motion.div>

      )}
    </div>
  );
};

export default RitualExplorerPage;
