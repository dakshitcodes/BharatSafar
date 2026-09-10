import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "https://bharatverse11-new-recommender-system-nlp2.hf.space";

// We can serve images directly from the API now since we mounted the static folder
const FALLBACK_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Flag_of_India.svg/640px-Flag_of_India.svg.png";

function getImageURL(item) {
  if (!item?.image) return FALLBACK_IMAGE;
  // item.image comes as "/images/filename.jpg" from the API
  return `${API_BASE}${item.image}`;
}

export default function RecommendationsPage({ onBack }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingMode, setTypingMode] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // 👇👇 NEW ADDED STATES
  const [lastScroll, setLastScroll] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current > lastScroll && current > 120) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }

      setLastScroll(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScroll]);

  // Disable body scroll when no results
  useEffect(() => {
    if (results.length === 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [results]);

  const ideaBank = [
    "Spicy South Indian breakfast",
    "Beautiful forts of Rajasthan",
    "Best temples in Tamil Nadu",
    "Traditional Indian sweets",
    "Popular Indian street foods",
    "UNESCO heritage sites of India",
    "Ancient stepwells of Gujarat",
    "Best Punjab Dhaba food",
    "Indian tea trail destinations",
    "Wildlife sanctuaries in India",
    "Majestic waterfalls of India",
    "Ayurvedic retreats in Kerala",
    "Top beaches of Andaman",
    "Traditional tribal art of India",
    "Indian folk dances and origin",
    "India's major silk weaving centres",
    "Best mountain monasteries",
    "Ancient caves of Maharashtra",
    "Best vegetarian Indian cuisine",
    "Temple architecture styles",
    "Lost kingdoms of India",
    "Best Indian spices",
    "Rare Indian recipes",
    "Most unique Indian festivals",
    "History of Mughal cuisine",
    "Amazing science of Ayurveda",
    "Best pilgrimage circuits",
    "Sacred rivers of India",
    "Iconic paintings of India",
    "Traditional carpets of Kashmir",
    "Indian miniature illustrations",
    "Ancient astronomical observatories",
    "Historic battle sites of India",
    "Royal palaces of Jaipur",
    "Colonial-era architecture",
    "Handmade craft villages of India",
    "Yoga origins and spiritual sites",
    "Largest stepwells of Rajasthan",
    "Food from the Himalayas",
    "Top Indian rail journey experiences",
    // New Additions
    "Rishikesh Yoga and Rafting",
    "Hornbill Festival Nagaland",
    "Chettinad Chicken Spicy",
    "Hampi Ancient Ruins",
    "Varkala Beach Sunset",
    "Mysore Palace Illumination",
    "Khajuraho Temple Carvings",
    "Ranthambore Tiger Safari",
    "Konark Sun Temple",
    "Hyderabadi Biryani",
    "Kashmir Rogan Josh",
    "Lonavala Weekend Trip",
    "Darjeeling Toy Train",
    "Ghoomar Dance Rajasthan",
    "Kathakali Performance Kerala",
    "Jim Corbett Wildlife",
    "Golden Temple Amritsar",
    "Vada Pav Mumbai Street Food",
    "Dal Baati Churma Rajasthan",
    "Sanchi Stupa History",
    "Spiti Valley Adventure",
    "Alleppey Houseboat Stay",
    "Meenakshi Temple Madurai",
    "Nagarhole Wildlife Safari",
    "Tawang Monastery Arunachal",
    "Pushkar Camel Fair",
    "Goa Beach Party",
    "Kolkata Durga Puja",
    "Varanasi Ganga Aarti",
    "Ladakh Bike Trip",
  ];

  useEffect(() => {
    const stored = localStorage.getItem("salahkar_favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const toggleFavorite = (item) => {
    const exists = favorites.some((f) => f.name === item.name);
    const updated = exists
      ? favorites.filter((f) => f.name !== item.name)
      : [...favorites, item];

    setFavorites(updated);
    localStorage.setItem("salahkar_favorites", JSON.stringify(updated));
  };

  const isFavorite = (item) => favorites.some((f) => f.name === item.name);

  useEffect(() => {
    if (!typingMode || !input.trim()) return setSuggestions([]);
    setSuggestions(
      ideaBank.filter((s) => s.toLowerCase().includes(input.toLowerCase()))
    );
  }, [input, typingMode]);

  async function search(query = input) {
    if (!query.trim()) return;

    setLoading(true);
    setTypingMode(false);
    setSuggestions([]);
    setResults([]);

    const url = `${API_BASE}/recommend?query=${encodeURIComponent(query)}&k=8`;

    try {
      let res = await fetch(url);
      if (!res.ok) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        res = await fetch(url);
      }

      const data = await res.json();

      const seen = new Set();
      const cleaned = data.results
        .filter((item) => item.name && item.name !== "name")
        .filter((item) => {
          if (seen.has(item.name)) return false;
          seen.add(item.name);
          return true;
        })
        .slice(0, 8)
        .map((item) => ({
          ...item,
          image: getImageURL(item),
        }));

      setResults(cleaned);
    } catch {
      alert("⚠ Server waking… retry in 5 sec");
    }

    setLoading(false);
  }

  const handleExplore = () => {
    if (input.trim()) {
      search();
    } else {
      const randomTopic = ideaBank[Math.floor(Math.random() * ideaBank.length)];
      setInput(randomTopic);
      search(randomTopic);
    }
  };

  return (
    <>
      {/* Background Video */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: videoLoaded ? 1 : 0,
            scale: videoLoaded ? 1 : 1.1,
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <video
            className="w-full h-full object-cover object-center"
            src="https://res.cloudinary.com/bharatverse/video/upload/v1766520904/bg_video_slgnkx.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
          />
        </motion.div>
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 👇👇 UPDATED: Smart Hide/Show Navigation */}
      <motion.div
        animate={{ y: showNav ? 0 : -200 }}
        transition={{ duration: 0.45 }}
        className="fixed top-6 left-0 right-0 z-[60] px-4 md:px-6 flex justify-between items-start pointer-events-none"
      >
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="pointer-events-auto bg-white/10 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-white/20 flex items-center justify-center group"
          title="Go Back"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:-translate-x-1 transition-transform"
          >
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
          </svg>
        </motion.button>

        <motion.button
          onClick={() => setShowCollection(!showCollection)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="pointer-events-auto text-yellow-400 p-2 rounded-full transition-all flex items-center justify-center outline-none focus:outline-none drop-shadow-md hover:drop-shadow-xl"
          style={{ WebkitTapHighlightColor: "transparent" }}
          title="My Collection"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill={favorites.length > 0 ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M19 14c1.49-1.28 3.6-2.36 4.57-4.57.53-1.14.9-2.28 1.15-3.46.22-1.05.34-2.14.34-3.23 0-3.32-2.69-6-6-6-2.63 0-4.85 1.71-5.65 4.12C12.85 7.71 10.63 6 8 6 4.69 6 2 8.68 2 12c0 1.09.12 2.18.34 3.23.25 1.18.62 2.32 1.15 3.46C4.4 20.64 6.51 21.72 8 23c2.98-2.54 6.78-4.96 11-5"
              style={{ display: "none" }}
            />{" "}
            {/* Hidden complex path, using simple heart */}
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </motion.button>
      </motion.div>

      {/* Collection Sidebar */}
      <AnimatePresence>
        {showCollection && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCollection(false)}
              className="fixed inset-0 bg-black/50 z-[70]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-full sm:w-96 bg-gradient-to-br from-amber-100 to-yellow-50 shadow-2xl z-[80] overflow-y-auto"
            >
              <div className="sticky top-0 bg-amber-400 p-6 shadow-lg flex justify-between items-center">
                <h2
                  className="text-2xl font-bold text-black"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  ✨ My Heritage Treasury
                </h2>
                <button
                  onClick={() => setShowCollection(false)}
                  className="text-3xl text-black hover:scale-110 transition outline-none focus:outline-none"
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                {favorites.length === 0 ? (
                  <p className="text-center text-gray-600 mt-20">
                    No favorites yet. Start exploring! 💛
                  </p>
                ) : (
                  favorites.map((fav, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl shadow-lg p-4 border-2 border-yellow-400 flex items-center gap-4"
                    >
                      <img
                        src={fav.image}
                        alt={fav.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-lg">
                          {fav.name}
                        </h3>
                        <p className="text-sm text-gray-600">{fav.category}</p>
                        <p className="text-xs text-gray-500">📍 {fav.region}</p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(fav)}
                        className="text-2xl hover:scale-125 transition transform outline-none focus:outline-none"
                        style={{ WebkitTapHighlightColor: "transparent" }}
                      >
                        ❌
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div
        className={`min-h-screen text-white flex flex-col items-center px-4 relative z-0 pt-24 md:pt-36 pb-16 ${
          results.length === 0 ? "justify-center -mt-16" : ""
        }`}
      >
        {/* Title Animation */}
        <div className="relative flex flex-col items-center mb-4">
          <motion.div
            className="absolute inset-0 blur-3xl opacity-30"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300"></div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.9, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.4 }}
            className="relative font-black text-center tracking-[0.38em] text-[clamp(40px,8vw,130px)]
                        bg-clip-text text-transparent bg-gradient-to-br from-[#fffaeb] via-[#ffd85a] to-[#e8a627] animate-titleShine leading-tight"
            style={{ fontFamily: "'Cinzel', 'Trajan Pro', serif" }}
          >
            SALAHKAR
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-2 h-1 rounded-full bg-gradient-to-r from-transparent via-[#ffd93d] to-transparent shadow-[0_0_20px_rgba(255,217,61,0.6)]"
            style={{ width: "calc(100% - 4rem)" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.6 }}
          className="mt-2 mb-6 text-center max-w-3xl px-6"
        >
          <motion.p
            animate={{ opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-[clamp(14px,4vw,19px)] font-bold tracking-wide leading-relaxed text-white"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Discover the essence of Bharat — where timeless heritage meets
            intelligent exploration
          </motion.p>
        </motion.div>

        {/* Search Bar */}
        <div className="relative w-full max-w-2xl z-50">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-300 via-yellow-500 to-amber-300 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setTypingMode(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && search()}
              placeholder="Ask Salahkar (e.g., 'Peaceful temples in South India')"
              className="relative w-full p-4 md:p-5 pl-8 pr-16 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400/50 shadow-2xl text-base md:text-lg transition-all"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            />
            <button
              onClick={() => search()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-amber-500 hover:bg-amber-400 text-black rounded-full transition-all shadow-lg hover:shadow-amber-500/50"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute w-full bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl mt-4 overflow-hidden shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar"
              >
                {suggestions.map((s, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setInput(s);
                      search(s);
                    }}
                    className="p-4 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-none flex items-center gap-3 text-gray-200 hover:text-amber-300"
                  >
                    <span className="text-amber-500">✨</span> {s}
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Explore Button */}
        <motion.button
          onClick={handleExplore}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(251, 191, 36, 0.6)",
          }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          className="mt-8 px-8 py-3 md:px-10 md:py-4 lg:px-16 lg:py-5 bg-gradient-to-r from-amber-600 via-[#FFD700] to-amber-600 text-black font-black rounded-full shadow-[0_10px_30px_rgba(217,119,6,0.4)] hover:shadow-[0_20px_40px_rgba(217,119,6,0.6)] transition-all flex items-center justify-center gap-3 text-lg md:text-xl tracking-[0.15em] relative overflow-hidden outline-none focus:outline-none focus:ring-0 border border-yellow-300/50"
          style={{
            fontFamily: "'Cinzel', serif",
            textShadow: "0 1px 2px rgba(255,255,255,0.5)",
          }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{
              background: [
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              ],
              x: ["-100%", "200%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 1,
            }}
          />
          <span className="relative z-10 uppercase">Explore Divine Bharat</span>
        </motion.button>

        {/* Results Grid */}
        <div className="mt-16 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8 px-4 pb-20">
          <AnimatePresence>
            {loading
              ? [...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-96 bg-white/5 rounded-3xl animate-pulse border border-white/10"
                  />
                ))
              : results.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 80,
                      scale: 0.8,
                      rotateX: 45,
                      rotateY: -25,
                      z: -100,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      rotateX: 0,
                      rotateY: 0,
                      z: 0,
                    }}
                    transition={{
                      delay: index * 0.12,
                      type: "spring",
                      stiffness: 80,
                      damping: 20,
                      mass: 1.2,
                      opacity: { duration: 0.8, ease: "easeOut" },
                    }}
                    whileHover={{
                      y: -25,
                      scale: 1.08,
                      rotateY: 8,
                      rotateX: -5,
                      z: 50,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    className="group relative bg-black/40 backdrop-blur-md rounded-[2rem] overflow-hidden transition-all duration-500"
                    style={{
                      boxShadow:
                        "0 15px 40px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,215,0,0.1)",
                      transformStyle: "preserve-3d",
                      perspective: "1000px",
                    }}
                  >
                    {/* Creative Background Elements */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10" />
                      <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/20 rounded-full blur-[80px] mix-blend-screen" />
                      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px] mix-blend-screen" />
                    </div>

                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 p-[1px] rounded-[2rem] bg-gradient-to-br from-transparent via-amber-500/50 to-transparent opacity-30 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Glowing border effect on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-[2rem] pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{
                        opacity: [0, 1, 0.8, 1, 0],
                        boxShadow: [
                          "inset 0 0 0px rgba(212, 175, 55, 0)",
                          "inset 0 0 30px rgba(212, 175, 55, 0.5)",
                          "inset 0 0 50px rgba(212, 175, 55, 0.6)",
                          "inset 0 0 30px rgba(212, 175, 55, 0.5)",
                          "inset 0 0 0px rgba(212, 175, 55, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    <div className="relative h-64 overflow-hidden">
                      <motion.img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                        initial={{ scale: 1.2, filter: "blur(10px)" }}
                        animate={{ scale: 1, filter: "blur(0px)" }}
                        transition={{
                          duration: 1,
                          delay: index * 0.12 + 0.3,
                          ease: "easeOut",
                        }}
                        whileHover={{
                          scale: 1.2,
                          rotate: 2,
                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                          },
                        }}
                        onError={(e) => (e.target.src = FALLBACK_IMAGE)}
                      />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.12 + 0.5 }}
                      />

                      {/* Traditional mandala pattern overlay */}
                      <motion.div
                        className="absolute inset-0 transition-opacity duration-700"
                        initial={{ opacity: 0 }}
                        whileHover={{
                          opacity: 0.15,
                          transition: { duration: 0.5 },
                        }}
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 15l3 9h9l-7.5 6 3 9-7.5-6-7.5 6 3-9-7.5-6h9z' fill='%23d4af37' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                          backgroundSize: "60px 60px",
                        }}
                      />

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        initial={{ scale: 0 }}
                        animate={{
                          scale: 1,

                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: index * 0.12 + 0.6,
                          },
                        }}
                        whileHover={{
                          scale: 1.1,

                          transition: {
                            scale: { duration: 0.2 },
                          },
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute top-4 right-4 p-3 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-md transition-all text-white shadow-lg z-20 outline-none focus:outline-none focus:ring-0 border-none"
                      >
                        {isFavorite(item) ? "💛" : "🤍"}
                      </motion.button>
                    </div>

                    <div className="p-6 relative">
                      {/* Floating Category Badge with animation */}
                      <motion.div
                        className="absolute -top-5 left-6"
                        initial={{ y: -20, opacity: 0, scale: 0.5 }}
                        animate={{
                          y: 0,
                          opacity: 1,
                          scale: 1,
                          transition: {
                            type: "spring",
                            stiffness: 200,
                            damping: 15,
                            delay: index * 0.12 + 0.4,
                          },
                        }}
                      >
                        <motion.span
                          className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-black text-xs font-black px-4 py-1.5 rounded-full shadow-lg uppercase tracking-widest border-2 border-yellow-300/70 inline-block"
                          whileHover={{
                            scale: 1.1,
                            boxShadow: "0 0 25px rgba(251, 191, 36, 0.6)",
                            transition: { duration: 0.3 },
                          }}
                        >
                          {item.category}
                        </motion.span>
                      </motion.div>

                      <motion.h3
                        className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 mb-3 leading-tight drop-shadow-lg"
                        style={{ fontFamily: "'Cinzel', serif" }}
                        initial={{ opacity: 0, x: -30, filter: "blur(5px)" }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          filter: "blur(0px)",
                          transition: {
                            delay: index * 0.12 + 0.5,
                            duration: 0.6,
                            ease: "easeOut",
                          },
                        }}
                      >
                        {item.name}
                      </motion.h3>

                      <motion.div
                        className="flex items-center gap-2 text-amber-300 text-sm mb-4 font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: index * 0.12 + 0.6,
                            duration: 0.5,
                          },
                        }}
                      >
                        <motion.svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          initial={{ scale: 0 }}
                          animate={{
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 200,
                              delay: index * 0.12 + 0.65,
                            },
                          }}
                        >
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </motion.svg>
                        {item.region}
                      </motion.div>

                      <motion.p
                        className="text-gray-200 text-sm line-clamp-3 leading-relaxed font-light tracking-wide"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          transition: {
                            delay: index * 0.12 + 0.7,
                            duration: 0.6,
                          },
                        }}
                      >
                        {item.domain}
                      </motion.p>

                      {/* Decorative bottom border with shimmer */}
                      <motion.div
                        className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
                        initial={{ scaleX: 0, opacity: 0 }}
                        whileHover={{
                          scaleX: 1,
                          opacity: 1,
                          transition: { duration: 0.6, ease: "easeOut" },
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
