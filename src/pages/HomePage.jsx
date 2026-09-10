import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  ArrowRight,
  Star,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  TrendingUp,
  Landmark,
  Music,
  Shield,
  Gem,
  Building,
  Globe,
  Cpu,
  Trophy,
  RotateCcw,
  MousePointer,
  Move3D,
  Eye,
  Award,
  Heart,
  Camera,
} from "lucide-react";
import ctaBg from "../assets/cta-bg.webp"; // Use your desired image and correct path
import PanoViewer from "../components/PanoViewer";
import SearchWidget from "../components/SearchWidget";
import diwaliImg from "../assets/diwali.jpeg";
import kathakImg from "../assets/kathak.jpg";
import rootBridgeImg from "../assets/hidden-gems/root-bridges.jpg";
import goldenTempleImg from "../assets/punjab.jpeg";
import redFortImg from "../assets/redfort.jpg";
import tajMahalImg from "../assets/tajmahal.jpg";

import heroBgVideo from "../assets/home2.mp4"; // Adjust path & filename
const HomePage = ({ onPageChange, user, bookmarks, addBookmark }) => {
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState({
    sites: 0,
    festivals: 0,
    arts: 0,
    users: 0,
  });

  // 360 degree viewer state
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const panoramaRef = useRef(null);

  // Featured heritage sites
  const featuredSites = [
    {
      id: 1,
      title: "Taj Mahal",
      state: "Uttar Pradesh",
      image: tajMahalImg,
      rating: 4.9,
      visitors: "6M+ visitors",
      description:
        "The epitome of love, this ivory-white marble mausoleum stands as India's most iconic monument.",
      category: "UNESCO World Heritage Site",
      highlights: [
        "Mughal Architecture",
        "Marble Inlay Work",
        "Charbagh Garden",
      ],
      yearBuilt: "1632-1653",
      architect: "Ustad Ahmad Lahauri",
    },
    {
      id: 2,
      title: "Red Fort (Lal Qila)",
      state: "Delhi",
      image: redFortImg,
      rating: 4.7,
      visitors: "3M+ visitors",
      description:
        "The majestic fortress that served as the residence of Mughal emperors for over 200 years.",
      category: "UNESCO World Heritage Site",
      highlights: ["Red Sandstone", "Diwan-i-Aam", "Peacock Throne"],
      yearBuilt: "1639-1648",
      architect: "Ustad Ahmad Lahauri",
    },
    {
      id: 3,
      title: "Golden Temple",
      state: "Punjab",
      image: goldenTempleImg,
      rating: 4.9,
      visitors: "5M+ visitors",
      description:
        "The holiest shrine of Sikhism, gleaming in gold with its sacred pool reflecting divine beauty.",
      category: "Religious Site",
      highlights: ["Golden Dome", "Sacred Pool", "Langar (Community Kitchen)"],
      yearBuilt: "1577",
      architect: "Guru Arjan Dev",
    },
  ];

  // Trending topics with Lucide icons
  const trendingTopics = [
    {
      icon: Landmark,
      name: "Ancient Temples",
      count: "2.5K searches",
      color: "text-orange-600",
    },
    {
      icon: Calendar,
      name: "Diwali Celebrations",
      count: "1.8K searches",
      color: "text-purple-600",
    },
    {
      icon: Music,
      name: "Bharatanatyam",
      count: "1.2K searches",
      color: "text-blue-600",
    },
    {
      icon: Shield,
      name: "Rajput Forts",
      count: "980 searches",
      color: "text-red-600",
    },
    {
      icon: Gem,
      name: "Hidden Gems",
      count: "750 searches",
      color: "text-emerald-600",
    },
    {
      icon: Building,
      name: "Temple Architecture",
      count: "640 searches",
      color: "text-indigo-600",
    },
  ];

  // Quick discoveries
  const quickDiscoveries = [
    {
      title: "Festival of Lights",
      subtitle: "Diwali Celebrations Across India",
      image: diwaliImg,
      action: () => onPageChange("festivals"),
      icon: Calendar,
    },
    {
      title: "Classical Dance Forms",
      subtitle: "8 Sacred Dance Traditions",
      image: kathakImg,
      action: () => onPageChange("arts"),
      icon: Music,
    },
    {
      title: "Our Hidden Gem Places",
      subtitle: "Lesser-Known Beautiful & Amazing Places",
      image: rootBridgeImg,
      action: () => onPageChange("gems"),
      icon: Landmark,
    },
  ];

  // 360 degree viewer handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStart.x;
    const deltaY = touch.clientY - dragStart.y;

    setRotation((prev) => ({
      x: Math.max(-90, Math.min(90, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5,
    }));

    setDragStart({ x: touch.clientX, y: touch.clientY });
  };

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (start, end, duration, setter) => {
      let startTime = null;
      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        setter(value);
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    };

    setTimeout(() => {
      animateValue(0, 150, 2000, (val) =>
        setStats((prev) => ({ ...prev, sites: val }))
      );
      animateValue(0, 200, 2200, (val) =>
        setStats((prev) => ({ ...prev, festivals: val }))
      );
      animateValue(0, 180, 2400, (val) =>
        setStats((prev) => ({ ...prev, arts: val }))
      );
      animateValue(0, 50000, 2600, (val) =>
        setStats((prev) => ({ ...prev, users: val }))
      );
    }, 500);
  }, []);

  // Search functionality simulated
  const handleSearch = (query) => {
    setIsSearching(true);
    setTimeout(() => {
      onPageChange("heritage");
      setIsSearching(false);
    }, 1000);
  };

  // Handle panorama hotspot clicks (placeholder)
  const handleHotspotClick = (hotspot) => {
    console.log("Hotspot clicked:", hotspot);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with background */}
      <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroBgVideo} type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/20" />
        <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-4">
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-white text-6xl md:text-8xl font-heritage font-bold heritage-text-glow leading-tight">
              BharatVerse
            </h1>
            <p className="text-white text-xl md:text-2xl max-w-4xl opacity-90 leading-relaxed">
              Discover India's incredible cultural heritage through immersive
              360° experiences, AI-powered guides, and interactive storytelling
            </p>

            <p className="text-yellow-300 text-lg md:text-xl font-medium mt-6">
              Where Ancient Wisdom Meets Modern Technology
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 w-full max-w-4xl mx-auto pt-5">
              <button
                onClick={() => onPageChange("360tour")} // <-- Updated
                className="btn-heritage text-lg px-8 py-4 flex items-center space-x-3 hover:scale-105 transition-transform duration-300 w-full sm:w-auto justify-center"
              >
                <Play size={24} />
                <span>Start 360° Heritage Tour</span>
              </button>

              <button
                onClick={() => onPageChange("chat")}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center"
              >
                Ask Heritage AI Guide
              </button>

              <button
                onClick={() => onPageChange("quiz")}
                className="bg-gold-500/20 backdrop-blur-sm border-2 border-gold-400/40 text-yellow-200 px-8 py-4 rounded-2xl font-semibold hover:bg-gold-500/30 transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center"
              >
                Test Your Knowledge
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full text-center max-w-4xl mx-auto mt-12 pt-10">
              {[
                {
                  number: stats.sites,
                  label: "Heritage Sites",
                  icon: Landmark,
                  suffix: "+",
                },
                {
                  number: stats.festivals,
                  label: "Festivals",
                  icon: Calendar,
                  suffix: "+",
                },
                {
                  number: stats.arts,
                  label: "Art Forms",
                  icon: Music,
                  suffix: "+",
                },
                {
                  number: (stats.users / 1000).toFixed(0),
                  label: "Explorers",
                  icon: Users,
                  suffix: "K+",
                },
              ].map((stat, idx) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={idx}
                    className="text-center transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent className="text-white mr-2" size={24} />
                      <div className="text-4xl font-bold font-heritage heritage-text-glow text-white">
                        {stat.number}
                        {stat.suffix}
                      </div>
                    </div>
                    <div className="text-white/80 font-medium">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Real 360° Experience Section */}
      {/* Real 360° AirPano Taj Mahal Experience */}
      <section className="py-20 bg-gradient-to-br from-saffron-50 to-gold-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heritage font-bold heritage-text-gradient mb-6 flex items-center justify-center">
              Experience Taj Mahal in Real 360°
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Immerse yourself in the breathtaking beauty of the Taj Mahal with
              our interactive 360° panoramic view from AirPano
            </p>
          </div>

          <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg mx-auto max-w-7xl">
            <iframe
              src="https://www.airpano.com/embed.php?3D=taj-mahal-india-2"
              title="360° Taj Mahal by AirPano"
              width="100%"
              height="600"
              frameBorder="0"
              marginHeight="0"
              marginWidth="0"
              scrolling="no"
              allowFullScreen
            />
          </div>
        </div>

        <div className="flex justify-center my-12">
          <button
            onClick={() => onPageChange("360tour")}
            className="btn-heritage px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 inline-flex items-center"
          >
            <span>View More 360° Tours</span>
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </section>

      {/* Enhanced Featured Heritage Sites */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-heritage font-bold heritage-text-gradient mb-4 flex items-center">
                <Award className="mr-4 text-saffron-600" size={48} />
                Featured Heritage Sites
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl">
                Discover India's most magnificent monuments through immersive
                virtual experiences
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-saffron-100 to-heritage-red-100 px-4 py-2 rounded-full">
              <TrendingUp className="text-saffron-600" size={20} />
              <span className="text-saffron-800 font-medium text-sm">
                Most Visited This Week
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {featuredSites.map((site, index) => (
              <div
                key={site.id}
                className="heritage-card relative group cursor-default transform hover:scale-[1.02] transition-all duration-500 overflow-hidden"
                aria-label={`Explore featured heritage site: ${site.title}`}
              >
                {/* Enhanced Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-saffron-500 to-heritage-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
                  <Star size={14} />
                  <span>Featured</span>
                </div>

                {/* Enhanced Bookmark Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addBookmark({ ...site, type: "heritage" });
                  }}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-lg"
                  aria-label="Add to favorites"
                >
                  <Heart
                    size={18}
                    className="text-gray-600 hover:text-red-500 transition-colors"
                  />
                </button>

                {/* Enhanced Image Section */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={site.image}
                    alt={site.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover Overlay with Quick Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center space-x-2 text-sm bg-black/50 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <Calendar size={14} />
                      <span>Built: {site.yearBuilt}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Content Section */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-saffron-600" />
                      <span className="text-sm font-medium text-saffron-600 bg-saffron-50 px-3 py-1 rounded-full">
                        {site.state}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-bold text-yellow-700">
                        {site.rating}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-heritage font-bold text-gray-900 mb-2 group-hover:text-saffron-600 transition-colors">
                    {site.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {site.description}
                  </p>

                  {/* Enhanced Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {site.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium border border-gray-200"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Enhanced Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users size={14} />
                        <span className="text-sm font-medium">
                          {site.visitors}
                        </span>
                      </div>
                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-gray-500">
                        {site.category}
                      </span>
                    </div>

                    <button className="text-saffron-600 hover:text-saffron-700 font-semibold flex items-center space-x-1 group/btn">
                      <span className="text-sm">Explore</span>
                      <ArrowRight
                        size={14}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => onPageChange("heritage")}
              className="btn-heritage text-lg px-8 py-4 flex items-center space-x-2 mx-auto"
            >
              <Landmark size={20} />
              <span>View All Heritage Sites ({stats.sites}+)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trending Discoveries with Lucide Icons */}
      <section className="py-20 bg-gradient-to-br from-heritage-red-50 to-saffron-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heritage font-bold heritage-text-gradient mb-6 flex items-center justify-center">
              Trending Discoveries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what fellow heritage enthusiasts are exploring right now
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {trendingTopics.map((topic, index) => {
              const IconComponent = topic.icon;
              return (
                <div
                  key={index}
                  className="heritage-card text-center py-10 px-6 rounded-2xl cursor-pointer hover:shadow-xl transition-all duration-300 group"
                  onClick={() => handleSearch(topic.name)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(topic.name);
                  }}
                  aria-label={`Search for ${topic.name}`}
                >
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent
                      size={36}
                      className={`mx-auto ${topic.color} animate-float`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm group-hover:text-saffron-600 transition-colors">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-gray-600">{topic.count}</p>
                </div>
              );
            })}
          </div>

          {/* Enhanced Quick Discoveries */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickDiscoveries.map((discovery, index) => {
              const IconComponent = discovery.icon;
              return (
                <div
                  key={index}
                  className="heritage-card overflow-hidden cursor-pointer group hover:shadow-2xl transition-all duration-500"
                  onClick={discovery.action}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") discovery.action();
                  }}
                  aria-label={`Discover ${discovery.title}`}
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={discovery.image}
                      alt={discovery.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <IconComponent size={20} className="text-saffron-600" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-heritage font-bold text-gray-900 mb-2 group-hover:text-saffron-600 transition-colors">
                      {discovery.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {discovery.subtitle}
                    </p>
                    <button className="text-saffron-600 hover:text-saffron-700 font-medium flex items-center space-x-1 group/btn">
                      <span>Discover More</span>
                      <ArrowRight
                        size={16}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Showcase with Lucide Icons */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-heritage font-bold heritage-text-gradient mb-6">
              Experience Heritage Like Never Before
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Cutting-edge technology meets ancient wisdom in our immersive
              cultural platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "360° Virtual Tours",
                description:
                  "Immerse yourself in breathtaking panoramic views of sacred sites with interactive hotspots and guided narration.",
                features: [
                  "Interactive Hotspots",
                  "Audio Narration",
                  "Historical Context",
                ],
                color: "text-blue-600",
              },
              {
                icon: Cpu,
                title: "AI Heritage Guide",
                description:
                  "Get instant answers about history, architecture, and cultural significance from our intelligent multilingual guide.",
                features: [
                  "Voice Recognition",
                  "Cultural Insights",
                  "Multilingual Support",
                ],
                color: "text-purple-600",
              },
              {
                icon: Trophy,
                title: "Interactive Quizzes",
                description:
                  "Test your knowledge with engaging quizzes and earn badges for your cultural expertise and achievements.",
                features: [
                  "Adaptive Difficulty",
                  "Achievement System",
                  "Leaderboards",
                ],
                color: "text-green-600",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="heritage-card text-center py-10 px-6 group hover:shadow-2xl transition-all duration-500"
                >
                  <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent
                      size={60}
                      className={`mx-auto ${feature.color} animate-float`}
                      style={{ animationDelay: `${index * 0.3}s` }}
                    />
                  </div>
                  <h3 className="text-xl font-heritage font-bold mb-4 group-hover:text-saffron-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <div className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2"
                      >
                        <Sparkles size={14} className="text-saffron-500" />
                        <span className="text-sm text-gray-700 font-medium">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative h-[550px] flex items-center justify-center text-white overflow-hidden z-10">
        {/* Background image and overlay */}
        <div className="absolute inset-0 -z-10 w-full h-full">
          <img
            src={ctaBg}
            alt="CTA background"
            className="object-cover w-full h-full brightness-70"
            draggable="false"
          />
          {/* Optional overlay for readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Animated spinning circles, preserved from your original */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full animate-spin-slow"></div>
          <div
            className="absolute bottom-10 right-10 w-24 h-24 border-2 border-white rounded-full animate-spin-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 border-2 border-white rounded-full animate-spin-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-heritage font-bold mb-8">
            Begin Your Heritage Journey Today
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto opacity-90 leading-relaxed">
            Join millions of culture enthusiasts exploring India's incredible
            heritage through our immersive digital experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
            <button
              onClick={() => onPageChange("states")}
              className="bg-white text-heritage-red-600 px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center space-x-3 shadow-xl"
            >
              <MapPin size={24} />
              <span>Explore by States</span>
            </button>
            <button
              onClick={() => onPageChange("festivals")}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-3"
            >
              <Calendar size={24} />
              <span>Discover Festivals</span>
            </button>
          </div>

          <blockquote className="max-w-3xl mx-auto italic opacity-90 mb-4 text-lg">
            "BharatVerse opened my eyes to the incredible depth of Indian
            culture. The 360° tours made me feel like I was actually walking
            through the Taj Mahal!"
          </blockquote>
          <cite className="text-sm opacity-80">
            — Priya S., Cultural Enthusiast
          </cite>
        </div>
      </section>
      {/* Newsletter Signup */}
      {!user && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-4xl md:text-5xl font-heritage font-bold text-gray-900 mb-6">
                Stay Updated on Indian Heritage
              </h3>
              <p className="text-xl text-gray-600 mb-10">
                Get weekly updates on new heritage sites, festivals, and
                cultural discoveries
              </p>
              <form
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  required
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                />
                <button type="submit" className="btn-heritage px-8 py-3">
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4">
                No spam. Unsubscribe anytime. We respect your privacy.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
