import React, { useEffect, useState } from "react";
import { Calendar, Star, Clock, Heart, Share2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import festivalsData from "../data/festivals.json";

// Import images
import diwaliImg from "../assets/diwali.jpeg";
import pongalImg from "../assets/pongal.jpeg";
import holiImg from "../assets/holi.jpg";
import eidImg from "../assets/eid.jpg";
import christmasImg from "../assets/christmas.jpg";
import navratriImg from "../assets/navratri.jpeg";
import ganeshImg from "../assets/ganesh.jpg";
import onamImg from "../assets/onam.webp";
import bihuImg from "../assets/bihu.gif";
import durgapujaImg from "../assets/durgapuja.jpg";
import rakshaImg from "../assets/raksha.png";
import sankrantiImg from "../assets/sankranti.jpg";
import janmashtamiImg from "../assets/janmashtami.webp";
import karvaImg from "../assets/karva.jpg";
import shivratriImg from "../assets/shivratri.webp";
import vaisakhiImg from "../assets/vaisakhi.avif";
import gudiImg from "../assets/gudi.jpg";
import vishuImg from "../assets/vishu.jpg";
import gurunanakImg from "../assets/gurunanak.jpg";
import lohriImg from "../assets/lohri.jpg";

// Map image keys from JSON to imports
const imageMap = {
  diwali: diwaliImg,
  pongal: pongalImg,
  holi: holiImg,
  eid: eidImg,
  christmas: christmasImg,
  navratri: navratriImg,
  ganesh: ganeshImg,
  onam: onamImg,
  bihu: bihuImg,
  durgapuja: durgapujaImg,
  raksha: rakshaImg,
  sankranti: sankrantiImg,
  janmashtami: janmashtamiImg,
  karva: karvaImg,
  shivratri: shivratriImg,
  vaisakhi: vaisakhiImg,
  gudi: gudiImg,
  vishu: vishuImg,
  gurunanak: gurunanakImg,
  lohri: lohriImg,
};

const FestivalsPage = ({ addBookmark, isBookmarked }) => {
  const [festivals, setFestivals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [filteredFestivals, setFilteredFestivals] = useState([]);
  const [selectedFestival, setSelectedFestival] = useState(null);

  // Prepare categories & states from JSON
  const categories = ["All", ...new Set(festivalsData.map((f) => f.category))];
  const states = ["All", ...new Set(festivalsData.map((f) => f.state))];
  const months = [
    "All",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    // Attach local images
    const withImages = festivalsData.map((f) => ({
      ...f,
      images: [imageMap[f.imageKey] || "/placeholder.jpg"],
    }));
    setFestivals(withImages);
  }, []);

  useEffect(() => {
    let filtered = festivals.filter(
      (festival) =>
        festival.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        festival.state.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((f) => f.category === selectedCategory);
    }

    if (selectedState !== "all") {
      filtered = filtered.filter((f) => f.state === selectedState);
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((f) =>
        (f.date || "").toLowerCase().includes(selectedMonth.toLowerCase())
      );
    }

    if (selectedRating !== "all") {
      filtered = filtered.filter((f) => f.rating >= parseFloat(selectedRating));
    }

    switch (sortBy) {
      case "popularity":
        filtered.sort(
          (a, b) => b.rating * b.reviews_count - a.rating * a.reviews_count
        );
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        filtered.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
        break;
      default:
        break;
    }

    setFilteredFestivals(filtered);
  }, [
    searchTerm,
    selectedCategory,
    selectedState,
    selectedMonth,
    selectedRating,
    sortBy,
    festivals,
  ]);

  return (
    <div className="min-h-screen bg-ivory-100">
      {/* Hero */}
      <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          src="https://res.cloudinary.com/bharatverse/video/upload/v1766498820/rl75kecmsmmv35aijemw.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Overlay for readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/30 to-charcoal-900/80 pointer-events-none"
          style={{ zIndex: 1 }}
        ></div>
        {/* Content */}
        <div className="text-center px-4 relative max-w-4xl mx-auto" style={{ zIndex: 2 }}>
          <p className="bs-label text-gold-400 mb-4">India's Living Traditions</p>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Indian Festivals
          </h1>
          <p className="text-lg md:text-xl text-white/80 font-sans leading-relaxed">
            Experience the vibrant colors, traditions, and celebrations of
            India’s diverse cultural heritage
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-center bg-white rounded-2xl shadow-bs-sm border border-ivory-200 py-6 px-8">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-600" size={18} />
            <input
              type="text"
              placeholder="Search festivals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bs-input pl-10 w-full"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bs-input max-w-[160px] cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* State */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bs-input max-w-[160px] cursor-pointer"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Month */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bs-input max-w-[160px] cursor-pointer"
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          {/* Rating */}
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="bs-input max-w-[140px] cursor-pointer"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">4.5 & up</option>
            <option value="4.0">4.0 & up</option>
            <option value="3.5">3.5 & up</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bs-input max-w-[160px] cursor-pointer"
          >
            <option value="popularity">Most Popular</option>
            <option value="name">Name</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((festival) => (
            <motion.div
              key={festival.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bs-card group overflow-hidden"
            >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={festival.images?.[0] || "/placeholder.jpg"}
                    alt={festival.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                <button
                  onClick={() => addBookmark?.(festival)}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isBookmarked?.(festival.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
              </div>

              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-charcoal-900 mb-2 group-hover:text-gold-700 transition-colors">{festival.title}</h3>
                <p className="font-sans text-charcoal-500 text-sm mb-4 leading-relaxed line-clamp-2">
                  {festival.description}
                </p>

                <div className="flex items-center justify-between text-xs font-sans text-charcoal-400 mb-4 pt-3 border-t border-ivory-200">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> {festival.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {festival.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 font-sans text-sm font-semibold text-charcoal-700">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    {festival.rating} <span className="font-normal text-charcoal-400 text-xs">({festival.reviews_count})</span>
                  </span>
                  <button
                    onClick={() => setSelectedFestival(festival)}
                    className="text-sm font-sans font-semibold text-gold-700 hover:text-gold-800 transition-colors"
                  >
                    Explore →
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedFestival && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="relative">
                <img
                  src={selectedFestival.images?.[0] || "/placeholder.jpg"}
                  alt={selectedFestival.title}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
                <button
                  onClick={() => setSelectedFestival(null)}
                  className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedFestival.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedFestival.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {selectedFestival.date}
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <Clock className="w-4 h-4 inline mr-2" />
                    {selectedFestival.duration}
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    State: {selectedFestival.state}
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    Category: {selectedFestival.category}
                  </div>
                </div>

                {selectedFestival.significance && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Significance</h3>
                    <p className="text-gray-600 mb-4">
                      {selectedFestival.significance}
                    </p>
                  </>
                )}

                {selectedFestival.traditions && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">Traditions</h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                      {selectedFestival.traditions.map((t, i) => (
                        <li key={i}>{t}</li>
                      ))}
                    </ul>
                  </>
                )}

                {selectedFestival.regional_variations && (
                  <>
                    <h3 className="text-lg font-semibold mb-2">
                      Regional Variations
                    </h3>
                    <ul className="list-disc list-inside text-gray-600 mb-4">
                      {Object.entries(selectedFestival.regional_variations).map(
                        ([region, desc]) => (
                          <li key={region}>
                            <span className="font-medium">{region}:</span>{" "}
                            {desc}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => addBookmark?.(selectedFestival)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isBookmarked?.(selectedFestival.id)
                          ? "fill-red-500 text-red-500"
                          : ""
                      }`}
                    />
                    Bookmark
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FestivalsPage;
