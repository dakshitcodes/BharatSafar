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
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 pointer-events-none"
          style={{ zIndex: 1 }}
        ></div>
        {/* Content */}
        <div className="text-center px-4 relative" style={{ zIndex: 2 }}>
          <h1 className="text-5xl md:text-6xl font-heritage font-bold text-white drop-shadow-lg mb-6">
            Indian Festivals
          </h1>
          <p className="text-lg md:text-2xl max-w-3xl mx-auto text-white/90 drop-shadow-md font-medium">
            Experience the vibrant colors, traditions, and celebrations of
            India’s diverse cultural heritage
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search festivals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
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
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
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
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
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
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
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
            className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
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
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative">
                <img
                  src={festival.images?.[0] || "/placeholder.jpg"}
                  alt={festival.title}
                  className="w-full h-48 object-cover"
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

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{festival.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {festival.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {festival.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {festival.duration}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    {festival.rating} ({festival.reviews_count})
                  </span>
                  <button
                    onClick={() => setSelectedFestival(festival)}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    Learn More →
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
