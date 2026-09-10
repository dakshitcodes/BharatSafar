import React, { useState, useEffect } from "react";
import {
  MapPin,
  Eye,
  Star,
  Upload,
  Search,
  Heart,
  Share2,
  Camera,
  Navigation,
} from "lucide-react";
import { motion } from "framer-motion";
import hiddenGemsData from "../data/hiddengems.json";

// Import all images
import chandBaoriImg from "../assets/hidden-gems/chand-baori.jpg";
import mawlynnongImg from "../assets/hidden-gems/mawlynnong.jpg";
import lepakshiImg from "../assets/hidden-gems/lepakshi.jpg";
import dhanushkodiImg from "../assets/hidden-gems/dhanushkodi.avif";
import bhangarhImg from "../assets/hidden-gems/bhangarh.webp";
import ziroValleyImg from "../assets/hidden-gems/ziro-valley.jpg";
import khajjiarImg from "../assets/hidden-gems/khajjiar.jpg";
import gandikotaImg from "../assets/hidden-gems/gandikota.jpeg";
import majuliImg from "../assets/hidden-gems/majuli.jpg";
import chitrakoteImg from "../assets/hidden-gems/chitrakote.jpeg";
import hampiImg from "../assets/hidden-gems/hampi.jpg";
import valleyOfFlowersImg from "../assets/hidden-gems/valley-of-flowers.jpg";
import rannOfKutchImg from "../assets/hidden-gems/rann-of-kutch.jpg";
import spitiValleyImg from "../assets/hidden-gems/spiti-valley.jpg";
import agumbeImg from "../assets/hidden-gems/agumbe.jpg";
import tawangImg from "../assets/hidden-gems/tawang.jpeg";
import nubraValleyImg from "../assets/hidden-gems/nubra-valley.jpg";
import dzukouValleyImg from "../assets/hidden-gems/dzukou-valley.jpeg";
import lonarCraterImg from "../assets/hidden-gems/lonar-crater.jpeg";
import magneticHillImg from "../assets/hidden-gems/magnetic-hill.jpg";
import rootBridgesImg from "../assets/hidden-gems/root-bridges.jpg";
import kolukkumalaiImg from "../assets/hidden-gems/kolukkumalai.jpg";

// Image mapping object
const imageMap = {
  "chand-baori.jpg": chandBaoriImg,
  "mawlynnong.jpg": mawlynnongImg,
  "lepakshi.jpg": lepakshiImg,
  "dhanushkodi.avif": dhanushkodiImg,
  "bhangarh.webp": bhangarhImg,
  "ziro-valley.jpg": ziroValleyImg,
  "khajjiar.jpg": khajjiarImg,
  "gandikota.jpeg": gandikotaImg,
  "majuli.jpg": majuliImg,
  "chitrakote.jpeg": chitrakoteImg,
  "hampi.jpg": hampiImg,
  "valley-of-flowers.jpg": valleyOfFlowersImg,
  "rann-of-kutch.jpg": rannOfKutchImg,
  "spiti-valley.jpg": spitiValleyImg,
  "agumbe.jpg": agumbeImg,
  "tawang.jpeg": tawangImg,
  "nubra-valley.jpg": nubraValleyImg,
  "dzukou-valley.jpeg": dzukouValleyImg,
  "lonar-crater.jpeg": lonarCraterImg,
  "magnetic-hill.jpg": magneticHillImg,
  "root-bridges.jpg": rootBridgesImg,
  "kolukkumalai.jpg": kolukkumalaiImg,
};

const HiddenGemsPage = ({ onPageChange, addBookmark, isBookmarked }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [filteredGems, setFilteredGems] = useState(hiddenGemsData);
  const [selectedGem, setSelectedGem] = useState(null);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  const categories = [
    { id: "all", name: "All Hidden Gems", count: hiddenGemsData.length },
    {
      id: "temple",
      name: "Ancient Temples",
      count: hiddenGemsData.filter((g) => g.category === "temple").length,
    },
    {
      id: "fort",
      name: "Forgotten Forts",
      count: hiddenGemsData.filter((g) => g.category === "fort").length,
    },
    {
      id: "village",
      name: "Heritage Villages",
      count: hiddenGemsData.filter((g) => g.category === "village").length,
    },
    {
      id: "nature",
      name: "Natural Heritage",
      count: hiddenGemsData.filter((g) => g.category === "nature").length,
    },
    {
      id: "art",
      name: "Local Art Forms",
      count: hiddenGemsData.filter((g) => g.category === "art").length,
    },
    {
      id: "craft",
      name: "Traditional Crafts",
      count: hiddenGemsData.filter((g) => g.category === "craft").length,
    },
  ];

  const regions = [
    { id: "all", name: "All Regions" },
    { id: "north", name: "North India" },
    { id: "south", name: "South India" },
    { id: "west", name: "West India" },
    { id: "east", name: "East India" },
    { id: "northeast", name: "Northeast India" },
    { id: "central", name: "Central India" },
  ];

  // Get first 3 gems for featured section
  const featuredGems = hiddenGemsData.slice(0, 3);

  useEffect(() => {
    let filtered = hiddenGemsData.filter(
      (gem) =>
        gem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gem.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gem.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "all") {
      filtered = filtered.filter((gem) => gem.category === selectedCategory);
    }

    if (selectedRegion !== "all") {
      filtered = filtered.filter((gem) => gem.region === selectedRegion);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.submittedAt || b.createdAt) -
            new Date(a.submittedAt || a.createdAt)
          );
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return a.title.localeCompare(b.title);
        case "distance":
          return 0; // geolocation sorting not implemented
        default:
          return 0;
      }
    });

    setFilteredGems(filtered);
  }, [searchTerm, selectedCategory, selectedRegion, sortBy]);

  const getCategoryIcon = (category) => {
    const icons = {
      temple: "Temple",
      fort: "Fort",
      village: "Village",
      nature: "Nature",
      art: "Art",
      craft: "Craft",
    };
    return icons[category] || "Hidden Gem";
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500 text-white";
      case "moderate":
        return "bg-yellow-500 text-white";
      case "difficult":
        return "bg-red-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getGemImage = (imageName) => {
    return imageMap[imageName] || "https://via.placeholder.com/400x300";
  };

  return (
    <div className="min-h-screen ">
      {/* Hero Header */}
      <div
        className="relative h-screen overflow-hidden flex items-center justify-center !bg-transparent"
        style={{ background: "transparent" }}
      >
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          src="https://res.cloudinary.com/bharatverse/video/upload/v1766504297/bharatverse_assets/hedrfunin0ecgzhw6dey.mp4"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark Overlay for Better Text Readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50 pointer-events-none"
          style={{ zIndex: 1 }}
        ></div>

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-heritage font-bold mb-6 text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.95)]">
              Hidden Gems of India
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white font-medium drop-shadow leading-relaxed">
              Discover India's best-kept secrets, off-the-beaten-path treasures,
              <br />
              and lesser-known heritage sites waiting to be explored
            </p>
          </motion.div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        {/* Submit Your Gem CTA */}
        <div className="mb-12 mt-12">
          <div className="heritage-card p-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-heritage font-bold mb-2 text-black">
                  Know a Hidden Gem? Share it!
                </h3>
                <p className="text-emerald-500">
                  Help fellow travelers discover amazing places by submitting
                  your hidden gems
                </p>
              </div>
              <button
                onClick={() => setShowSubmissionForm(true)}
                className="mt-4 md:mt-0 bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2"
              >
                <Upload size={20} />
                <span>Submit Hidden Gem</span>
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="heritage-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-6">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search hidden gems..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
              >
                <option value="recent">Recently Added</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical</option>
                <option value="distance">Nearest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hidden Gems Grid */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGems.map((gem, index) => (
              <motion.div
                key={gem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="heritage-card cursor-pointer group"
                onClick={() => setSelectedGem(gem)}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={getGemImage(gem.images[0])}
                    alt={gem.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addBookmark({ ...gem, type: "gem" });
                        }}
                      >
                        <Heart size={16} />
                      </button>

                      <div className="flex space-x-2">
                        <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                          <Camera size={16} />
                        </button>
                        <button className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
                      {getCategoryIcon(gem.category)}
                    </span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getDifficultyColor(
                        gem.difficulty
                      )}`}
                    >
                      {gem.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      {gem.state}
                    </span>
                    {gem.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">
                          {gem.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-heritage font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                    {gem.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {gem.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{gem.distance || "Distance unknown"}</span>
                    </div>

                    <div className="flex items-center space-x-1">
                      <Eye size={14} />
                      <span>{gem.visits || 0} views</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gem Detail Modal */}
        {selectedGem && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <img
                  src={getGemImage(selectedGem.images[0])}
                  alt={selectedGem.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                <button
                  onClick={() => setSelectedGem(null)}
                  className="absolute top-4 right-4 text-white hover:text-red-400 text-2xl"
                >
                  ×
                </button>

                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <h2 className="text-3xl font-heritage font-bold mb-2">
                    {selectedGem.title}
                  </h2>
                  <div className="flex items-center space-x-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                      <MapPin size={14} />
                      <span>{selectedGem.state}</span>
                    </span>
                    <span className="bg-emerald-500/80 px-3 py-1 rounded-full text-sm">
                      Hidden Gem
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      About This Hidden Gem
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {selectedGem.description}
                    </p>

                    {selectedGem.cultural_significance && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">
                          Cultural Significance
                        </h3>
                        <p className="text-gray-700 leading-relaxed mb-6">
                          {selectedGem.cultural_significance}
                        </p>
                      </>
                    )}

                    {selectedGem.best_time_visit && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">
                          Best Time to Visit
                        </h3>
                        <p className="text-gray-700">
                          {selectedGem.best_time_visit}
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">How to Reach</h3>
                    {selectedGem.how_to_reach ? (
                      <div className="space-y-3 mb-6">
                        <div className="bg-emerald-50 p-4 rounded-lg">
                          <p className="text-emerald-800">
                            {selectedGem.how_to_reach}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 mb-6">
                        Contact local guides for detailed directions.
                      </p>
                    )}

                    <h3 className="text-xl font-semibold mb-4">Local Tips</h3>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start space-x-3">
                        <span className="text-emerald-500 mt-1 font-bold">
                          •
                        </span>
                        <p className="text-gray-700 text-sm">
                          {selectedGem.local_tips ||
                            "Carry water and snacks as facilities may be limited."}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-emerald-500 mt-1 font-bold">
                          •
                        </span>
                        <p className="text-gray-700 text-sm">
                          {selectedGem.accessibility ||
                            "Suitable for moderate fitness levels."}
                        </p>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-emerald-500 mt-1 font-bold">
                          •
                        </span>
                        <p className="text-gray-700 text-sm">
                          {selectedGem.connectivity ||
                            "Limited mobile network - inform someone about your visit."}
                        </p>
                      </div>
                    </div>

                    {selectedGem.nearby_attractions && (
                      <>
                        <h3 className="text-xl font-semibold mb-4">
                          Nearby Attractions
                        </h3>
                        <div className="space-y-2">
                          {selectedGem.nearby_attractions.map(
                            (attraction, index) => (
                              <div
                                key={index}
                                className="bg-gray-50 p-3 rounded-lg"
                              >
                                <span className="text-gray-800 text-sm">
                                  {attraction}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => addBookmark({ ...selectedGem, type: "gem" })}
                    className="btn-heritage px-6 py-3 flex items-center space-x-2"
                  >
                    <Heart size={18} />
                    <span>Save to Wishlist</span>
                  </button>

                  <button
                    onClick={() => onPageChange("map")}
                    className="bg-emerald-100 text-emerald-700 px-6 py-3 rounded-xl font-semibold hover:bg-emerald-200 transition-colors flex items-center space-x-2"
                  >
                    <Navigation size={18} />
                    <span>Get Directions</span>
                  </button>

                  <button className="bg-blue-100 text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-200 transition-colors flex items-center space-x-2">
                    <Share2 size={18} />
                    <span>Share with Friends</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* No Results */}
        {filteredGems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <h3 className="text-2xl font-heritage font-bold text-gray-900 mb-4">
              No Hidden Gems Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              Try adjusting your search terms or filters to discover more hidden
              treasures.
            </p>
            <button
              onClick={() => setShowSubmissionForm(true)}
              className="btn-heritage px-6 py-3 flex items-center space-x-2 mx-auto"
            >
              <Upload size={18} />
              <span>Submit Your Hidden Gem</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heritage font-bold">
                  Submit a Hidden Gem
                </h2>
                <button
                  onClick={() => setShowSubmissionForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-8">
                  Help other travelers discover amazing places by sharing your
                  hidden gem discoveries.
                </p>
                <button
                  onClick={() => {
                    setShowSubmissionForm(false);
                    onPageChange("upload");
                  }}
                  className="btn-heritage px-8 py-4"
                >
                  Go to Submission Form
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-heritage font-bold mb-6">
            Become a Hidden Gem Explorer
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our community of explorers discovering and sharing India's
            best-kept secrets
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onPageChange("upload")}
              className="bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Submit Your Discovery
            </button>
            <button
              onClick={() => onPageChange("map")}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/30 transition-colors"
            >
              Explore on Map
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HiddenGemsPage;
