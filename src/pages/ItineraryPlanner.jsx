import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, ArrowRight, RotateCcw, Zap } from "lucide-react";
import GeminiItineraryForm from "../components/GeminiItineraryForm";
import GeminiItineraryDisplay from "../components/GeminiItineraryDisplay";
import heroBgImage from "../assets/it-6.jpg"; // ✅ Import image

const ItineraryPlanner = () => {
  const [itinerary, setItinerary] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleItineraryGenerated = (result, form) => {
    setIsLoading(true);
    setTimeout(() => {
      setItinerary(result);
      setFormData(form);
      setIsLoading(false);
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth",
        });
      }, 300);
    }, 500);
  };

  const handleNewItinerary = () => {
    setItinerary(null);
    setFormData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/55 via-black/40 to-black/50 backdrop-blur-sm"></div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-300/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header - Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-4 py-2 mb-6">
              <Sparkles size={18} className="text-yellow-300" />
              <span className="text-sm font-semibold text-white">AI-Powered Planning</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heritage font-bold mb-4 text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
              Plan Your Indian Journey
            </h1>

            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_6px_20px_rgba(0,0,0,0.8)]">
              Let <span className="font-semibold text-yellow-300">Google Gemini AI</span> craft your perfect itinerary. Choose your destination or let us recommend the best fit.
            </p>
          </motion.div>

          {/* Form Section - Card with Premium Look */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mb-12"
          >
            {/* Glow Effect Behind Card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 rounded-3xl blur-xl opacity-30"></div>

            {/* Card */}
            <div className="relative bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin className="text-white" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-amber-900">Trip Details</h2>
                  <p className="text-sm text-amber-700">Fill in your travel preferences</p>
                </div>
              </div>

              <GeminiItineraryForm onItineraryGenerated={handleItineraryGenerated} />
            </div>
          </motion.div>

          {/* Results Section - With Animation */}
          <AnimatePresence>
            {itinerary && formData && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.6 }}
              >
                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-16">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Zap className="text-yellow-300 animate-pulse" size={32} />
                      <span className="text-2xl font-bold text-white drop-shadow-lg">Generating Your Itinerary...</span>
                    </div>
                    <p className="text-white/80">AI is crafting your personalized journey...</p>
                  </div>
                )}

                {!isLoading && (
                  <>
                    {/* Success Badge */}
                    <div className="mb-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="inline-flex items-center space-x-2 bg-green-500/30 backdrop-blur-md border-2 border-green-400 rounded-full px-6 py-3"
                      >
                        <span className="text-2xl">✨</span>
                        <span className="font-semibold text-green-100">Itinerary Ready!</span>
                      </motion.div>
                    </div>

                    {/* Results */}
                    <GeminiItineraryDisplay itinerary={itinerary} formData={formData} />

                    {/* Plan Another Button - Premium */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNewItinerary}
                      className="mt-12 mx-auto block group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-300"></div>
                      <div className="relative bg-white hover:bg-gray-50 text-orange-600 hover:text-orange-700 font-bold py-4 px-10 rounded-2xl transition duration-300 flex items-center space-x-2">
                        <RotateCcw size={20} />
                        <span>Plan Another Itinerary</span>
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlanner;
