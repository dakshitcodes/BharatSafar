import React, { useEffect, useState } from "react";
import { Star, Filter } from "lucide-react";
import heritageData from "../data/heritage.json";

// ✅ Import your local images
import tajMahal from "../assets/tajmahal.jpg";
import qutubMinar from "../assets/qutubminar.jpeg";
import hampi from "../assets/hampi.jpg";
import konark from "../assets/konark.webp";
import ajanta from "../assets/ajanta.jpeg";
import ellora from "../assets/ellora.jpeg";
import khajuraho from "../assets/khajuraho.jpeg";
import redFort from "../assets/redfort.jpg";
import sanchi from "../assets/sanchi.jpg";
import charminar from "../assets/charminar.jpeg";
//imgbg
import HeritageBg from "../assets/st3.webp";
import tirupati from "../assets/tirupati.jpg";
import nagarjunakonda from "../assets/nagarjunakonda.jpg";
import lepakshi from "../assets/lepakshi1.jpg";
import penusila from "../assets/penusila.avif";
import chandragiri from "../assets/chandragiri.JPG";
import gandikota from "../assets/gandikota.jpg";
import golconda from "../assets/golconda.jpeg";
import srirangam from "../assets/srirangam.webp";
import meenakshi from "../assets/meenakshi.jpg";
import brihadeeswarar from "../assets/brihadeeswarar.avif";
import virupaksha from "../assets/virupaksha.webp";
import mysore from "../assets/mysore.jpeg";
import shoretemple from "../assets/shoretemple.jpg";
import warangal from "../assets/warangal.jpg";
import charminarMosque from "../assets/charminar_mosque.jpg";

// ✅ Map JSON imageKey → actual image import
const imageMap = {
  tajMahal,
  qutubMinar,
  hampi,
  konark,
  ajanta,
  ellora,
  khajuraho,
  redFort,
  sanchi,
  charminar,
  tirupati,
  nagarjunakonda,
  lepakshi,
  penusila,
  chandragiri,
  gandikota,
  golconda,
  srirangam,
  meenakshi,
  brihadeeswarar,
  virupaksha,
  mysore,
  shoretemple,
  warangal,
  charminarMosque,
};

const HeritagePage = () => {
  const [sites, setSites] = useState([]);
  const [filteredSites, setFilteredSites] = useState([]);
  const [stateFilter, setStateFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");

  // Load and enrich data
  useEffect(() => {
    const enrichedData = heritageData.map((site) => ({
      ...site,
      images: [
        imageMap[site.imageKey] || "https://via.placeholder.com/400x300",
      ],
    }));
    setSites(enrichedData);
    setFilteredSites(enrichedData);
  }, []);

  // Get unique states for filter dropdown
  const states = ["All", ...new Set(heritageData.map((s) => s.state))];

  // Handle filtering
  useEffect(() => {
    let results = [...sites];

    if (stateFilter !== "All") {
      results = results.filter((s) => s.state === stateFilter);
    }

    if (ratingFilter !== "All") {
      results = results.filter((s) => s.rating >= parseFloat(ratingFilter));
    }

    setFilteredSites(results);
  }, [stateFilter, ratingFilter, sites]);

  return (
    <>
      {/* Fullscreen Image Banner */}
      <div className="relative h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* background */}
        <img
          src={HeritageBg}
          alt="Heritage of India"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70"></div>

        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 space-y-8">
          {/* Header - large and visible */}
          <header className="text-center">
            <h1 className=" text-6xl md:text-8xl  font-heritage font-bold mb-4 text-transparent bg-gradient-to-r from-orange-400 via-orange-200 to-yellow-400 bg-clip-text drop-shadow-[0_3px_18px_rgba(0,0,0,0.6)] tracking-wide">
              Heritage of India
            </h1>
            <p className="text-2xl md:text-2xl max-w-2xl mx-auto text-white/90 font-semibold drop-shadow-md mb-6">
              Discover the timeless monuments and cultural treasures of India
              that showcase its glorious history and traditions.
            </p>
          </header>
        </div>
      </div>

      {/* Filters */}

      <div
        className="w-full flex flex-col md:flex-row items-center justify-center gap-6
  rounded-2xl bg-white/80 border border-white/30 shadow-lg px-8 py-7 mt-10"
      >
        <div className="flex items-center gap-8 text-lg font-bold text-orange-700">
          <Filter className="w-6 h-6" />
          <span className="font-bold text-xl text-orange-800">Filters:</span>
        </div>

        {/* State Filter */}
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-6 py-3 rounded-lg border-none focus:ring-2 focus:ring-orange-400 shadow focus:outline-none"
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        {/* Rating Filter */}
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-orange-400 shadow focus:outline-none"
        >
          <option value="All">All Ratings</option>
          <option value="4.5">4.5 & above</option>
          <option value="4.7">4.7 & above</option>
          <option value="4.9">4.9 only</option>
        </select>
      </div>

      {/* Main content BELOW the image banner */}
      <main className="container mx-auto px-4 py-24">
        {/* ...other content below */}
        {/* Sites Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          aria-label="List of heritage sites"
        >
          {filteredSites.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 font-semibold py-10">
              No heritage sites match your filters.
            </div>
          ) : (
            filteredSites.map((site) => (
              <article
                key={site.id}
                className="heritage-card bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={site.images[0]}
                    alt={site.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-saffron-700 bg-saffron-100 px-3 py-1 rounded-full">
                      {site.state}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-semibold">
                        {site.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {site.title}
                  </h2>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                    {site.description}
                  </p>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </>
  );
};

export default HeritagePage;
