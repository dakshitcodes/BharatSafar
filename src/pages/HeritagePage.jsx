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

const HeritagePage = ({ onPageChange }) => {
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
        <img
          src={HeritageBg}
          alt="Heritage of India"
          className="absolute inset-0 w-full h-full object-cover"
          draggable="false"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/65 via-charcoal-900/30 to-charcoal-900/75" />

        <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 space-y-6">
          <header className="text-center">
            <p className="bs-label text-gold-400 mb-4">India's Living History</p>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight tracking-tight">
              Heritage of India
            </h1>
            <p className="font-sans text-lg md:text-xl max-w-2xl mx-auto text-white/80 leading-relaxed">
              Discover the timeless monuments and cultural treasures that showcase India's glorious history.
            </p>
          </header>
        </div>
      </div>

      {/* Filters */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 items-center justify-center bg-white rounded-2xl shadow-bs-sm border border-ivory-200 py-6 px-8 mb-12">
            <div className="flex items-center gap-2 text-gold-700 mr-4">
              <Filter size={18} />
              <span className="font-display font-semibold text-lg text-charcoal-800">Filters</span>
            </div>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bs-input max-w-[200px] cursor-pointer"
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
              className="bs-input max-w-[200px] cursor-pointer"
            >
              <option value="All">All Ratings</option>
              <option value="4.5">4.5 &amp; above</option>
              <option value="4.7">4.7 &amp; above</option>
              <option value="4.9">4.9 only</option>
            </select>
          </div>
        </div>
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          aria-label="List of heritage sites"
        >
          {filteredSites.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="font-sans text-charcoal-400 text-lg">No heritage sites match your filters.</p>
            </div>
          ) : (
            filteredSites.map((site) => (
              <article
                key={site.id}
                onClick={() => onPageChange && onPageChange("heritage", site)}
                className="bs-card group overflow-hidden cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={site.images[0]}
                    alt={site.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="bs-badge-gold text-xs">{site.state}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-sans text-sm font-semibold text-charcoal-700">{site.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <h2 className="font-display text-xl font-bold text-charcoal-900 mb-2 group-hover:text-gold-700 transition-colors">
                    {site.title}
                  </h2>
                  <p className="font-sans text-charcoal-500 text-sm leading-relaxed line-clamp-3">
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
