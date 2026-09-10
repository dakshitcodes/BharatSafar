import React, { useEffect, useState } from "react";
import { Play, Star, Search } from "lucide-react";
import { motion } from "framer-motion";
import artsData from "../data/arts.json";

// Import local images from src/assets (create these files accordingly)
import bharatanatyamImg from "../assets/bharatanatyam.jpg";
import kathakImg from "../assets/kathak.jpg";
import odissiImg from "../assets/odissi.webp";
import kathakaliImg from "../assets/kathakali.jpg";
import manipuriImg from "../assets/manipuri.jpg";
import kuchipudiImg from "../assets/kuchipudi.webp";
import mohiniyattamImg from "../assets/mohiniyattam.jpg";
import sattriyaImg from "../assets/sattriya.jpg";
import chhauImg from "../assets/chhau.jpg";
import ghoomarImg from "../assets/ghoomar.jpg";
import bhangraImg from "../assets/bhangra.jpg";
import garbaImg from "../assets/garba.jpg";
import lavaniImg from "../assets/lavani.webp";
import yakshaganaImg from "../assets/yakshagana.jpg";
import thangtaImg from "../assets/thangta.jpg";
import kalaripayattuImg from "../assets/kalaripayattu.jpg";
import madhubaniImg from "../assets/madhubani.png";
import pattachitraImg from "../assets/pattachitra.jpg";
import warliImg from "../assets/warli.jpg";
import gondImg from "../assets/gond.jpg";
import tanjoreImg from "../assets/tanjore.webp";
import bluepotteryImg from "../assets/bluepottery.jpg";
import kutchImg from "../assets/kutch.jpg";
import ikatImg from "../assets/ikat.jpg";
import banarasiImg from "../assets/banarasi.webp";
import pashminaImg from "../assets/pashmina.jpg";
import chikankariImg from "../assets/chikankari.webp";
import dokraImg from "../assets/dokra.jpg";
import terracottaImg from "../assets/terracotta.jpg";
import stonecarvingImg from "../assets/stonecarving.jpeg";
import artbg from "../assets/art8.webp";

const imageMap = {
  bharatanatyam: bharatanatyamImg,
  kathak: kathakImg,
  odissi: odissiImg,
  kathakali: kathakaliImg,
  manipuri: manipuriImg,
  kuchipudi: kuchipudiImg,
  mohiniyattam: mohiniyattamImg,
  sattriya: sattriyaImg,
  chhau: chhauImg,
  ghoomar: ghoomarImg,
  bhangra: bhangraImg,
  garba: garbaImg,
  lavani: lavaniImg,
  yakshagana: yakshaganaImg,
  thangta: thangtaImg,
  kalaripayattu: kalaripayattuImg,
  madhubani: madhubaniImg,
  pattachitra: pattachitraImg,
  warli: warliImg,
  gond: gondImg,
  tanjore: tanjoreImg,
  bluepottery: bluepotteryImg,
  kutch: kutchImg,
  ikat: ikatImg,
  banarasi: banarasiImg,
  pashmina: pashminaImg,
  chikankari: chikankariImg,
  dokra: dokraImg,
  terracotta: terracottaImg,
  stonecarving: stonecarvingImg,
};

const ArtsPage = ({ onPageChange, addBookmark, isBookmarked }) => {
  const [arts, setArts] = useState([]);
  const [filteredArts, setFilteredArts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [activeArt, setActiveArt] = useState(null);

  const categories = [
    "All",
    ...Array.from(new Set(artsData.map((a) => a.category))),
  ];
  const states = ["All", ...Array.from(new Set(artsData.map((a) => a.state)))];

  useEffect(() => {
    const enriched = artsData.map((a) => ({
      ...a,
      images: [imageMap[a.imageKey] || "/placeholder.jpg"],
    }));
    setArts(enriched);
    setFilteredArts(enriched);
  }, []);

  useEffect(() => {
    let results = [...arts];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      results = results.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          (r.state || "").toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "all") {
      results = results.filter((r) => r.category === selectedCategory);
    }

    if (selectedState !== "all") {
      results = results.filter((r) => r.state === selectedState);
    }

    if (selectedRating !== "all") {
      results = results.filter((r) => r.rating >= parseFloat(selectedRating));
    }

    setFilteredArts(results);
  }, [searchTerm, selectedCategory, selectedState, selectedRating, arts]);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
        <img
          src={artbg}
          alt="Arts of India"
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable="false"
          style={{ filter: "brightness(0.92)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80 pointer-events-none"></div>
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4">
          <h1
            className="
  text-6xl md:text-7xl font-heritage font-extrabold mb-4
  bg-gradient-to-r from-pink-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_3px_18px_rgba(0,0,0,0.85)] tracking-wide"
          >
            Arts Of India
          </h1>

          <p className="mt-4 max-w-3xl mx-auto text-2xl md:text-3xl text-white font-medium drop-shadow leading-relaxed">
            Discover India's rich artistic heritage through classical dances,
            <br />
            folk arts, traditional crafts, and timeless cultural expressions.
          </p>
        </div>
      </section>

      {/* Filters */}
      <main className="container mx-auto px-4 py-12">
        <div className="heritage-card p-6 flex flex-wrap gap-4 justify-center mb-8">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search arts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring focus:ring-pink-400 w-full md:w-64"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300"
          >
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-2 rounded border border-gray-300"
          >
            <option value="all">All Ratings</option>
            <option value="4.5">4.5 & above</option>
            <option value="4.0">4.0 & above</option>
            <option value="3.5">3.5 & above</option>
          </select>
        </div>

        {/* Grid */}
        <section>
          {filteredArts.length === 0 ? (
            <p className="text-center text-gray-600">
              No arts found. Try adjusting filters or search.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredArts.map((art) => (
                <motion.article
                  key={art.id}
                  className="heritage-card cursor-pointer group rounded-2xl overflow-hidden shadow-md"
                  onClick={() => setActiveArt(art)}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={art.images?.[0]}
                      alt={art.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-white bg-opacity-80 rounded-full px-3 py-1 text-xs flex items-center gap-1">
                      {art.category}
                    </div>
                    {art.video && (
                      <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={48} color="white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="bg-pink-100 text-pink-700 text-xs px-2 py-0.5 rounded">
                        {art.state}
                      </span>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <Star size={14} />
                        <span className="text-sm">{art.rating}</span>
                      </div>
                    </div>
                    <h3 className="font-heritage font-semibold text-lg">
                      {art.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mt-1">
                      {art.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* Modal */}
        {activeArt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative"
            >
              <button
                onClick={() => setActiveArt(null)}
                className="absolute top-2 right-4 text-xl text-gray-500 hover:text-gray-900"
              >
                &times;
              </button>
              {activeArt.images?.[0] && (
                <img
                  src={activeArt.images[0]}
                  alt={activeArt.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-3xl font-heritage mb-2">{activeArt.title}</h2>
              <div className="mb-4 flex gap-6">
                <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded">
                  {activeArt.state}
                </span>
                <span className="bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded">
                  {activeArt.category}
                </span>
              </div>
              <p className="mb-4">{activeArt.description}</p>

              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Details</h3>
                <p className="mb-4">
                  More historical/cultural details about the art form can go
                  here.
                </p>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <button
                  className="btn-heritage px-6 py-3"
                  onClick={() => {
                    addBookmark?.({ ...activeArt, type: "art" });
                    setActiveArt(null);
                  }}
                >
                  Save to Favorites
                </button>
                <button
                  className="bg-pink-100 px-6 py-3 rounded font-semibold text-pink-700 hover:bg-pink-200"
                  onClick={() => {
                    onPageChange && onPageChange("learn");
                    setActiveArt(null);
                  }}
                >
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 text-center mt-16 rounded-xl">
          <h2 className="text-4xl font-heritage mb-4">
            Learn Traditional Indian Arts
          </h2>
          <p className="max-w-2xl mx-auto mb-8">
            Discover workshops, tutorials and cultural centers to learn more.
          </p>
          <button
            className="btn-heritage px-8 py-3"
            onClick={() => onPageChange && onPageChange("map")}
          >
            Find Learning Centers
          </button>
        </section>
      </main>
    </div>
  );
};

export default ArtsPage;
