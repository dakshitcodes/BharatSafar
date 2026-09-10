import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  MapPin,
  TrendingUp,
  Grid,
  List,
  Star,
  Users,
  Calendar,
  ChevronRight,
  X,
  Phone,
  Globe,
  Award,
  Map,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Import the states data JSON
import statesData from "../data/states_data.json";

// Import all state images
import andhraPradeshImg from "../assets/andhra-pradesh.jpeg";
import arunachalPradeshImg from "../assets/arunachal-pradesh.avif";
import assamImg from "../assets/assam.jpg";
import biharImg from "../assets/bihar.jpg";
import chhattisgarhImg from "../assets/chhattisgarh.jpg";
import goaImg from "../assets/goa.jpeg";
import gujaratImg from "../assets/gujarat.jpeg";
import haryanaImg from "../assets/haryana.jpeg";
import himachalPradeshImg from "../assets/himachal-pradesh.webp";
import jharkhandImg from "../assets/jharkhand.jpeg";
import karnatakaImg from "../assets/karnataka.jpeg";
import keralaImg from "../assets/kerala.jpeg";
import madhyaPradeshImg from "../assets/madhya-pradesh.jpg";
import maharashtraImg from "../assets/maharashtra.jpeg";
import manipurImg from "../assets/manipur.jpeg";
import meghalayaImg from "../assets/meghalaya.png";
import mizoramImg from "../assets/mizoram.jpeg";
import nagalandImg from "../assets/nagaland.jpg";
import odishaImg from "../assets/odisha.jpg";
import punjabImg from "../assets/punjab.jpeg";
import rajasthanImg from "../assets/rajasthan.jpg";
import sikkimImg from "../assets/sikkim.jpeg";
import tamilNaduImg from "../assets/tamil-nadu.jpeg";
import telanganaImg from "../assets/telangana.webp";
import tripuraImg from "../assets/tripura.jpg";
import uttarPradeshImg from "../assets/uttar-pradesh.jpg";
import uttarakhandImg from "../assets/uttarakhand.jpg";
import westBengalImg from "../assets/west-bengal.jpg";

// Import all union territory images
import andamanNicobarImg from "../assets/andaman-and-nicobar-islands.jpeg";
import chandigarhImg from "../assets/chandigarh.webp";
import dadraNavarHaveliDamanDiuImg from "../assets/dadra-and-nagar-haveli-and-daman-and-diu.jpg";
import delhiImg from "../assets/delhi.jpeg";
import jammuKashmirImg from "../assets/jammu-and-kashmir.jpeg";
import ladakhImg from "../assets/ladakh.jpg";
import lakshadweepImg from "../assets/lakshadweep.jpg";
import puducherryImg from "../assets/puducherry.jpg";

//page video
import statesBg from "../assets/st2.jpg";
import video from "../assets/video1.mp4";

// ... other imports

const StatesPage = ({ onPageChange }) => {
  useEffect(() => {
    document.body.classList.add("video-bg");
    return () => {
      document.body.classList.remove("video-bg");
    };
  }, []);

  // ...rest of your component code

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [filteredStates, setFilteredStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState(null);

  // Memoize allPlaces to prevent infinite loop
  const allPlaces = useMemo(
    () => [...statesData.states, ...statesData.union_territories],
    []
  );

  // Image mapping for states and union territories
  const stateImages = useMemo(
    () => ({
      "Andhra Pradesh": andhraPradeshImg,
      "Arunachal Pradesh": arunachalPradeshImg,
      Assam: assamImg,
      Bihar: biharImg,
      Chhattisgarh: chhattisgarhImg,
      Goa: goaImg,
      Gujarat: gujaratImg,
      Haryana: haryanaImg,
      "Himachal Pradesh": himachalPradeshImg,
      Jharkhand: jharkhandImg,
      Karnataka: karnatakaImg,
      Kerala: keralaImg,
      "Madhya Pradesh": madhyaPradeshImg,
      Maharashtra: maharashtraImg,
      Manipur: manipurImg,
      Meghalaya: meghalayaImg,
      Mizoram: mizoramImg,
      Nagaland: nagalandImg,
      Odisha: odishaImg,
      Punjab: punjabImg,
      Rajasthan: rajasthanImg,
      Sikkim: sikkimImg,
      "Tamil Nadu": tamilNaduImg,
      Telangana: telanganaImg,
      Tripura: tripuraImg,
      "Uttar Pradesh": uttarPradeshImg,
      Uttarakhand: uttarakhandImg,
      "West Bengal": westBengalImg,
      "Andaman and Nicobar Islands": andamanNicobarImg,
      Chandigarh: chandigarhImg,
      "Dadra and Nagar Haveli and Daman and Diu": dadraNavarHaveliDamanDiuImg,
      Delhi: delhiImg,
      "Jammu and Kashmir": jammuKashmirImg,
      Ladakh: ladakhImg,
      Lakshadweep: lakshadweepImg,
      Puducherry: puducherryImg,
    }),
    []
  );

  // Memoize regions to prevent recalculation
  const regions = useMemo(
    () => [
      { id: "all", name: "All Regions", count: allPlaces.length },
      {
        id: "north",
        name: "North India",
        count: allPlaces.filter((place) => place.region === "north").length,
      },
      {
        id: "south",
        name: "South India",
        count: allPlaces.filter((place) => place.region === "south").length,
      },
      {
        id: "west",
        name: "West India",
        count: allPlaces.filter((place) => place.region === "west").length,
      },
      {
        id: "east",
        name: "East India",
        count: allPlaces.filter((place) => place.region === "east").length,
      },
      {
        id: "northeast",
        name: "Northeast",
        count: allPlaces.filter((place) => place.region === "northeast").length,
      },
      {
        id: "central",
        name: "Central India",
        count: allPlaces.filter((place) => place.region === "central").length,
      },
      {
        id: "island",
        name: "Island Territories",
        count: allPlaces.filter((place) => place.region === "island").length,
      },
    ],
    [allPlaces]
  );

  useEffect(() => {
    setLoading(true);
    let filtered = allPlaces.filter(
      (place) =>
        place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        place.capital.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (place.languages &&
          place.languages.some((lang) =>
            lang.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
        (place.specialties &&
          place.specialties.some((sp) =>
            sp.toLowerCase().includes(searchTerm.toLowerCase())
          ))
    );

    if (selectedRegion !== "all") {
      filtered = filtered.filter((place) => place.region === selectedRegion);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "heritage_count":
          return (b.heritage_count || 0) - (a.heritage_count || 0);
        case "literacy":
          return (b.literacy_rate || 0) - (a.literacy_rate || 0);
        case "area":
          return (b.area_sq_km || 0) - (a.area_sq_km || 0);
        case "population":
          return (b.population_2011 || 0) - (a.population_2011 || 0);
        default:
          return 0;
      }
    });

    setFilteredStates(filtered);
    setTimeout(() => setLoading(false), 250);
  }, [searchTerm, selectedRegion, sortBy, allPlaces]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSelectedState(null);
      }
    };

    if (selectedState) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [selectedState]);

  const getStateImage = (stateName) => {
    return stateImages[stateName] || null;
  };

  const getRegionColor = (region) => {
    const colors = {
      north: "bg-blue-100 text-blue-800 border-blue-200",
      south: "bg-green-100 text-green-800 border-green-200",
      west: "bg-orange-100 text-orange-800 border-orange-200",
      east: "bg-purple-100 text-purple-800 border-purple-200",
      northeast: "bg-pink-100 text-pink-800 border-pink-200",
      central: "bg-yellow-100 text-yellow-800 border-yellow-200",
      island: "bg-cyan-100 text-cyan-800 border-cyan-200",
    };
    return region
      ? colors[region]
      : "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatPopulation = (population) => {
    if (!population) return "N/A";
    if (population >= 10000000) {
      return `${(population / 10000000).toFixed(1)}Cr`;
    } else if (population >= 100000) {
      return `${(population / 100000).toFixed(1)}L`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toLocaleString();
  };

  const formatArea = (area) => {
    if (!area) return "N/A";
    return `${area.toLocaleString()} km²`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}

      <div
        className="relative h-screen overflow-hidden flex items-center justify-center !bg-transparent"
        style={{ background: "transparent" }}
      >
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
          src={video}
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Dark Overlay for Better Text Readability */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60 pointer-events-none"
          style={{ zIndex: 1 }}
        ></div>

        {/* page content */}
        <div
          className="container mx-auto px-4 text-center relative"
          style={{ zIndex: 2 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-heritage font-bold mb-6 text-white drop-shadow-lg">
              Discover India
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white leading-relaxed mb-8 drop-shadow-md font-medium">
              Explore 28 vibrant states and 8 union territories, each with
              unique heritage, culture, and traditions that make India truly
              incredible
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 hover:bg-white/35 transition-all">
                <span className="font-bold text-white">28</span>
                <span className="text-white/90"> States</span>
              </div>
              <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 hover:bg-white/35 transition-all">
                <span className="font-bold text-white">8</span>
                <span className="text-white/90"> Union Territories</span>
              </div>
              <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 hover:bg-white/35 transition-all">
                <span className="font-bold text-white">40+</span>
                <span className="text-white/90"> Heritage Sites</span>
              </div>
              <div className="bg-white/25 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 hover:bg-white/35 transition-all">
                <span className="font-bold text-white">1000+</span>
                <span className="text-white/90"> Languages</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* huh */}

      <div className="container mx-auto px-4 py-12">
        {/* Search & Filters */}
        <div className="mb-12">
          <div className="heritage-card p-8 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0 lg:space-x-6">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search states, capitals, languages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none transition-all duration-200 text-lg"
                />
              </div>

              {/* Region Filter */}
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none bg-white text-lg min-w-[200px]"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name} ({region.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-saffron-500 focus:border-saffron-500 outline-none bg-white text-lg min-w-[200px]"
              >
                <option value="name">Sort by Name</option>
                <option value="heritage_count">Sort by Heritage Sites</option>
                <option value="literacy">Sort by Literacy Rate</option>
                <option value="area">Sort by Area</option>
                <option value="population">Sort by Population</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-200 ${viewMode === "grid"
                      ? "bg-white shadow-md text-saffron-600"
                      : "hover:bg-gray-200 text-gray-600"
                    }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-200 ${viewMode === "list"
                      ? "bg-white shadow-md text-saffron-600"
                      : "hover:bg-gray-200 text-gray-600"
                    }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-gray-600 text-lg">
              Showing{" "}
              <span className="font-bold text-saffron-600">
                {filteredStates.length}
              </span>{" "}
              {filteredStates.length === 1 ? "place" : "places"}
              {selectedRegion !== "all" && (
                <span>
                  {" "}
                  in{" "}
                  <span className="font-semibold text-heritage-red-600">
                    {regions.find((r) => r.id === selectedRegion)?.name}
                  </span>
                </span>
              )}
            </p>
          </div>

          {filteredStates.length > 0 && (
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} className="text-saffron-600" />
                <span>
                  <span className="font-semibold">
                    {filteredStates.reduce(
                      (sum, place) => sum + (place.heritage_count || 0),
                      0
                    )}
                  </span>{" "}
                  Heritage Sites
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={16} className="text-heritage-red-600" />
                <span>
                  <span className="font-semibold">
                    {formatPopulation(
                      filteredStates.reduce(
                        (sum, place) => sum + (place.population_2011 || 0),
                        0
                      )
                    )}
                  </span>{" "}
                  Total Population
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-600"></div>
          </div>
        )}

        {/* States Grid/List */}
        <AnimatePresence mode="wait">
          {!loading && (
            <>
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                  {filteredStates.map((place, index) => (
                    <motion.div
                      key={place.code}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="heritage-card cursor-pointer group hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                      onClick={() => setSelectedState(place)}
                    >
                      {/* State Image */}
                      <div className="h-48 overflow-hidden">
                        {getStateImage(place.name) ? (
                          <img
                            src={getStateImage(place.name)}
                            alt={place.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                              Image not available
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex flex-col items-start space-y-2">
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium border ${getRegionColor(
                                place.region
                              )}`}
                            >
                              {place.code}
                            </span>
                            {place.heritage_count > 0 && (
                              <div className="flex items-center space-x-1 text-xs text-saffron-600">
                                <Star size={12} />
                                <span className="font-semibold">
                                  {place.heritage_count} UNESCO
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-heritage font-bold text-gray-900 mb-2 group-hover:text-saffron-600 transition-colors line-clamp-1">
                          {place.name}
                        </h3>

                        {/* Description */}
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                          {place.description}
                        </p>

                        {/* Stats */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1 text-gray-500">
                              <MapPin size={12} />
                              <span className="truncate">{place.capital}</span>
                            </div>
                            <span className="text-gray-400">
                              {formatPopulation(place.population_2011)}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Literacy</span>
                            <span className="font-semibold text-green-600">
                              {place.literacy_rate?.toFixed(1)}%
                            </span>
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {place.languages &&
                            place.languages.slice(0, 2).map((lang, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                              >
                                {lang}
                              </span>
                            ))}
                          {place.languages && place.languages.length > 2 && (
                            <span className="text-xs text-gray-400">
                              +{place.languages.length - 2}
                            </span>
                          )}
                        </div>

                        {/* Action */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 capitalize">
                            {place.region} India
                          </span>
                          <ChevronRight
                            size={16}
                            className="text-gray-400 group-hover:text-saffron-600 group-hover:translate-x-1 transition-all duration-200"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {filteredStates.map((place, index) => (
                    <motion.div
                      key={place.code}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className="heritage-card cursor-pointer group hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                      onClick={() => setSelectedState(place)}
                    >
                      <div className="flex">
                        {/* State Image */}
                        <div className="w-32 h-32 flex-shrink-0">
                          {getStateImage(place.name) ? (
                            <img
                              src={getStateImage(place.name)}
                              alt={place.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                No image
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 p-8">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-2xl font-heritage font-bold text-gray-900 group-hover:text-saffron-600 transition-colors">
                                  {place.name}
                                </h3>
                                <span
                                  className={`text-xs px-3 py-1 rounded-full font-medium border ${getRegionColor(
                                    place.region
                                  )}`}
                                >
                                  {place.code}
                                </span>
                                {place.heritage_count > 0 && (
                                  <div className="flex items-center space-x-1 text-xs text-saffron-600">
                                    <Star size={12} />
                                    <span className="font-semibold">
                                      {place.heritage_count} UNESCO
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-gray-600 mb-3 leading-relaxed">
                                {place.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center space-x-1">
                                  <MapPin size={14} />
                                  <span>
                                    Capital:{" "}
                                    <span className="font-medium text-gray-700">
                                      {place.capital}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users size={14} />
                                  <span>
                                    Population:{" "}
                                    <span className="font-medium text-gray-700">
                                      {formatPopulation(place.population_2011)}
                                    </span>
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar size={14} />
                                  <span>
                                    Literacy:{" "}
                                    <span className="font-medium text-green-600">
                                      {place.literacy_rate?.toFixed(1)}%
                                    </span>
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {place.languages &&
                                  place.languages.map((lang, idx) => (
                                    <span
                                      key={idx}
                                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                    >
                                      {lang}
                                    </span>
                                  ))}
                              </div>
                            </div>
                            <ChevronRight
                              size={20}
                              className="text-gray-400 group-hover:text-saffron-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>

        {/* No Results */}
        {!loading && filteredStates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-heritage font-bold text-gray-900 mb-4">
              No Places Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              Try adjusting your search terms or filters to discover the
              incredible diversity of India.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("all");
              }}
              className="mt-6 px-6 py-3 bg-saffron-600 text-white rounded-2xl hover:bg-saffron-700 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* State Details Modal */}
      <AnimatePresence>
        {selectedState && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setSelectedState(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Image */}
              <div className="relative h-64 overflow-hidden rounded-t-2xl">
                {getStateImage(selectedState.name) ? (
                  <img
                    src={getStateImage(selectedState.name)}
                    alt={selectedState.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-saffron-200 to-heritage-red-200 flex items-center justify-center">
                    <span className="text-gray-500 text-lg">
                      No image available
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedState(null)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 rounded-full p-2 transition-all duration-200"
                  aria-label="Close modal"
                >
                  <X size={24} />
                </button>

                {/* Title and Badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-heritage font-bold text-white mb-2">
                        {selectedState.name}
                      </h2>
                      <p className="text-white/90 text-lg">
                        {selectedState.capital}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium border bg-white/20 backdrop-blur-sm text-white border-white/30`}
                      >
                        {selectedState.code}
                      </span>
                      {selectedState.heritage_count > 0 && (
                        <div className="flex items-center space-x-1 text-xs bg-saffron-600 text-white px-2 py-1 rounded-full">
                          <Award size={12} />
                          <span className="font-semibold">
                            {selectedState.heritage_count} UNESCO Site
                            {selectedState.heritage_count > 1 ? "s" : ""}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                {/* Description */}
                <div className="mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {selectedState.description}
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="text-blue-600" size={20} />
                      <span className="text-sm font-medium text-blue-800">
                        Population
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatPopulation(selectedState.population_2011)}
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="text-green-800 size={20}" />
                      <span className="text-sm font-medium text-green-800">
                        Literacy Rate
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                      {selectedState.literacy_rate?.toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="text-purple-600" size={20} />
                      <span className="text-sm font-medium text-purple-800">
                        Area
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">
                      {formatArea(selectedState.area_sq_km)}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-2">
                      <Map className="text-orange-800 size={20} " />
                      <span className="text-sm font-medium text-orange-800">
                        Region
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-orange-900 capitalize">
                      {selectedState.region}
                    </p>
                  </div>
                </div>

                {/* Details Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Languages */}
                  <div>
                    <h3 className="text-xl font-heritage font-bold text-gray-900 mb-4">
                      Languages
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedState.languages?.map((lang, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Major Attractions */}
                  <div>
                    <h3 className="text-xl font-heritage font-bold text-gray-900 mb-4">
                      Major Attractions
                    </h3>
                    <ul className="space-y-2">
                      {selectedState.major_attractions
                        ?.slice(0, 5)
                        .map((attraction, idx) => (
                          <li key={idx} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-saffron-600 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">{attraction}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  {/* Famous Food */}
                  <div>
                    <h3 className="text-xl font-heritage font-bold text-gray-900 mb-4">
                      Famous Cuisine
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedState.famous_food?.map((food, idx) => (
                        <span
                          key={idx}
                          className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                        >
                          {food}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Festivals */}
                  <div>
                    <h3 className="text-xl font-heritage font-bold text-gray-900 mb-4">
                      Festivals
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedState.festivals?.map((festival, idx) => (
                        <span
                          key={idx}
                          className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm"
                        >
                          {festival}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mt-8">
                  <h3 className="text-xl font-heritage font-bold text-gray-900 mb-4">
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedState.specialties?.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setSelectedState(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Call to Action */}
      <section className="relative py-20 text-white overflow-hidden z-10">
        <div className="absolute inset-0 -z-10 w-full h-full">
          <img
            src={statesBg}
            alt="CTA background"
            className="object-cover w-full h-full brightness-100"
            draggable="false"
          />
          {/* Optional overlay for readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heritage font-bold mb-8">
              Ready to Explore India's Rich Heritage?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed">
              From ancient temples and majestic forts to pristine beaches and
              snow-capped mountains - discover the incredible diversity that
              makes India truly extraordinary
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => onPageChange && onPageChange("heritage")}
                className="bg-white text-heritage-red-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Heritage Sites
              </button>
              <button
                onClick={() => onPageChange && onPageChange("culture")}
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-heritage-red-600 transition-all duration-200"
              >
                Discover Culture
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default StatesPage;
