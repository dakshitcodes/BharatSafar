import React, { useState, useEffect } from "react";
import {
  Globe,
  MapPin,
  Eye,
  Navigation,
  Camera,
  Compass,
  Mountain,
  Waves,
  Building,
  Crown,
  Sparkles,
  ArrowRight,
  Play,
  RotateCcw,
  Maximize,
  Award,
  Star,
  Users,
  Clock,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


const TourPage360 = ({ onPageChange }) => {
  const [activeLocation, setActiveLocation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [viewStats, setViewStats] = useState({
    totalViews: 0,
    activeViewers: 0,
  });

  // 360° Tour locations data
  const locations = [
    {
      id: 1,
      name: "Andaman Islands",
      subtitle: "Paradise of Crystal Waters",
      description:
        "Discover the pristine beauty of India's tropical paradise with turquoise waters, coral reefs, and untouched beaches in stunning 360°.",
      embedUrl: "https://www.airpano.com/embed.php?3D=andaman_islands",
      icon: Waves,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-700",
      bgColor: "bg-cyan-50",
      category: "Natural Wonder",
      highlights: ["Pristine Beaches", "Coral Reefs", "Marine Life"],
      bestTime: "October - March",
      titleFont: "font-serif text-6xl",
    },
    {
      id: 2,
      name: "Goa",
      subtitle: "Coastal Charm & Portuguese Heritage",
      description:
        "Experience the vibrant beaches, colonial architecture, and laid-back atmosphere of India's favorite coastal destination.",
      embedUrl: "https://www.airpano.com/embed.php?3D=goa-north-1",
      icon: Waves,
      color: "from-orange-500 to-red-500",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50",
      category: "Beach Destination",
      highlights: [
        "Golden Beaches",
        "Portuguese Churches",
        "Vibrant Nightlife",
      ],
      bestTime: "November - February",
      titleFont: "font-sans text-5xl tracking-wide",
    },
    {
      id: 3,
      name: "Fatehpur Sikri",
      subtitle: "The Ghost City of Mughal Empire",
      description:
        "Step into the abandoned Mughal capital, a UNESCO World Heritage site showcasing the finest Indo-Islamic architecture.",
      embedUrl: "https://www.airpano.com/embed.php?3D=fatehpur-sikri-india",
      icon: Building,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
      category: "UNESCO World Heritage",
      highlights: ["Buland Darwaza", "Jama Masjid", "Panch Mahal"],
      bestTime: "October - March",
      titleFont: "font-heritage text-4xl font-bold",
    },
    {
      id: 4,
      name: "Jaipur",
      subtitle: "The Pink City of Rajasthan",
      description:
        "Explore the royal grandeur of Rajasthan's capital, with its magnificent palaces, forts, and vibrant bazaars.",
      embedUrl: "https://www.airpano.com/embed.php?3D=jaipur-india",
      icon: Crown,
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-700",
      bgColor: "bg-pink-50",
      category: "Royal Heritage",
      highlights: ["Amber Palace", "City Palace", "Hawa Mahal"],
      bestTime: "October - March",
      titleFont: "font-mono text-5xl font-black tracking-wider",
    },
    {
      id: 5,
      name: "Varanasi",
      subtitle: "The Spiritual Heart of India",
      description:
        "Witness the eternal city on the banks of Ganges, where spirituality, tradition, and life converge in timeless harmony.",
      embedUrl: "https://www.airpano.com/embed.php?3D=india_varanasi",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
      category: "Sacred City",
      highlights: ["Ganges Ghats", "Ancient Temples", "Spiritual Rituals"],
      bestTime: "October - March",
      titleFont: "font-serif text-6xl italic font-light",
    },
    {
      id: 6,
      name: "Swaminarayan Akshardham",
      subtitle: "Modern Marvel of Ancient Art",
      description:
        "Marvel at the world's largest comprehensive Hindu temple, showcasing traditional Indian architecture and culture.",
      embedUrl: "https://www.airpano.com/embed.php?3D=akshardham-india",
      icon: Award,
      color: "from-emerald-500 to-green-600",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
      category: "Modern Temple",
      highlights: [
        "Intricate Carvings",
        "Musical Fountain",
        "Cultural Exhibitions",
      ],
      bestTime: "Year Round",
      titleFont: "font-sans text-4xl font-extrabold uppercase tracking-widest",
    },
    {
      id: 7,
      name: "Delhi",
      subtitle: "Where History Meets Modernity",
      description:
        "Experience India's capital - a fascinating blend of ancient heritage and contemporary dynamism in one magnificent city.",
      embedUrl: "https://www.airpano.com/embed.php?3D=delhi-india",
      icon: Building,
      color: "from-gray-500 to-slate-600",
      textColor: "text-gray-700",
      bgColor: "bg-gray-50",
      category: "Capital City",
      highlights: ["Red Fort", "India Gate", "Modern Architecture"],
      bestTime: "October - March",
      titleFont: "font-sans text-7xl font-thin tracking-tight",
    },
  ];

  // Stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewStats({
        totalViews: Math.floor(Math.random() * 1000) + 15000,
        activeViewers: Math.floor(Math.random() * 50) + 120,
      });
    }, 3000);

    setTimeout(() => setIsLoading(false), 1000);

    return () => clearInterval(interval);
  }, []);

  const currentLocation = locations[activeLocation];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 text-white overflow-hidden min-h-screen flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://res.cloudinary.com/bharatverse/video/upload/v1766498471/zfs7izglmckzknou6jvl.mp4" controls />
        </video>

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/30"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-8">
              <RotateCcw className="mr-4 animate-spin-slow" size={60} />
              <h1 className="text-6xl md:text-8xl font-heritage font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                360° Virtual Tours
              </h1>
            </div>

            <p className="text-2xl md:text-3xl max-w-5xl mx-auto opacity-90 leading-relaxed mb-12">
              Embark on breathtaking aerial journeys across India's most
              spectacular destinations
            </p>

            {/* Live Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300 mb-2 flex items-center justify-center">
                  <Eye className="mr-2" size={32} />
                  {viewStats.totalViews.toLocaleString()}
                </div>
                <div className="text-sm opacity-80">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-300 mb-2 flex items-center justify-center">
                  <Users className="mr-2" size={32} />
                  {viewStats.activeViewers}
                </div>
                <div className="text-sm opacity-80">Live Viewers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-300 mb-2 flex items-center justify-center">
                  <MapPin className="mr-2" size={32} />
                  {locations.length}
                </div>
                <div className="text-sm opacity-80">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-300 mb-2 flex items-center justify-center">
                  <Award className="mr-2" size={32} />
                  4K
                </div>
                <div className="text-sm opacity-80">Ultra HD</div>
              </div>
            </div>

            <button
              onClick={() => setActiveLocation(0)}
              className="bg-gradient-to-r from-saffron-500 to-heritage-red-500 text-white px-10 py-4 rounded-2xl font-bold text-xl hover:scale-105 transition-all duration-300 shadow-2xl flex items-center space-x-3 mx-auto"
            >
              <Play size={24} />
              <span>Start Virtual Journey</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onPageChange("home")}
              className="flex items-center space-x-2 text-gray-600 hover:text-saffron-600 transition-colors"
            >
              <ChevronLeft size={20} />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center space-x-4 overflow-x-auto">
              {locations.map((location, index) => {
                const IconComponent = location.icon;
                return (
                  <button
                    key={location.id}
                    onClick={() => setActiveLocation(index)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap ${activeLocation === index
                        ? `bg-gradient-to-r ${location.color} text-white shadow-lg scale-105`
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`}
                  >
                    <IconComponent size={16} />
                    <span className="text-sm">{location.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 360° Tour Sections */}
      <div className="container mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {locations.map((location, index) => {
            const IconComponent = location.icon;

            if (index !== activeLocation) return null;

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.6 }}
                className="mb-20"
              >
                {/* Location Header */}
                <div
                  className={`${location.bgColor} rounded-3xl p-12 mb-12 shadow-2xl`}
                >
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center space-x-4 mb-6">
                        <div
                          className={`w-16 h-16 bg-gradient-to-r ${location.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        >
                          <IconComponent className="text-white" size={32} />
                        </div>
                        <div>
                          <span
                            className={`${location.textColor} text-sm font-bold uppercase tracking-wider`}
                          >
                            {location.category}
                          </span>
                        </div>
                      </div>

                      <h2
                        className={`${location.titleFont} ${location.textColor} mb-4 leading-tight`}
                      >
                        {location.name}
                      </h2>

                      <h3 className="text-2xl font-medium text-gray-600 mb-6">
                        {location.subtitle}
                      </h3>

                      <p className="text-gray-700 text-lg leading-relaxed mb-8">
                        {location.description}
                      </p>

                      {/* Location Details */}
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Star className="mr-2 text-saffron-500" size={18} />
                            Highlights
                          </h4>
                          <ul className="space-y-2">
                            {location.highlights.map((highlight, idx) => (
                              <li
                                key={idx}
                                className="text-gray-600 flex items-center"
                              >
                                <ArrowRight
                                  size={14}
                                  className="mr-2 text-saffron-500"
                                />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-gray-800 mb-3 flex items-center">
                            <Clock
                              className="mr-2 text-saffron-500"
                              size={18}
                            />
                            Best Time to Visit
                          </h4>
                          <p className="text-gray-600">{location.bestTime}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        className={`w-48 h-48 bg-gradient-to-r ${location.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse`}
                      >
                        <Globe className="text-white" size={80} />
                      </div>
                      <p className="text-gray-600">
                        Ready for 360° exploration
                      </p>
                    </div>
                  </div>
                </div>

                {/* 360° Viewer */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <div className="p-8 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <RotateCcw className="text-white" size={20} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">
                            360° Virtual Experience
                          </h3>
                          <p className="text-gray-600">
                            Click and drag to explore • Full screen available
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Live</span>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                          <Maximize size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    {isLoading && (
                      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
                        <div className="text-center">
                          <RotateCcw
                            className="animate-spin text-saffron-500 mx-auto mb-4"
                            size={48}
                          />
                          <p className="text-gray-600">
                            Loading 360° experience...
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={location.embedUrl}
                        title={`360° ${location.name} Virtual Tour`}
                        width="100%"
                        height="600"
                        frameBorder="0"
                        marginHeight="0"
                        marginWidth="0"
                        scrolling="no"
                        allowFullScreen
                        className="rounded-b-3xl"
                        onLoad={() => setIsLoading(false)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex justify-center space-x-4 mt-12">
          <button
            onClick={() => setActiveLocation(Math.max(0, activeLocation - 1))}
            disabled={activeLocation === 0}
            className="px-6 py-3 bg-gray-200 text-gray-600 rounded-2xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Previous Destination
          </button>

          <button
            onClick={() =>
              setActiveLocation(
                Math.min(locations.length - 1, activeLocation + 1)
              )
            }
            disabled={activeLocation === locations.length - 1}
            className="px-6 py-3 bg-gradient-to-r from-saffron-500 to-heritage-red-500 text-white rounded-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Next Destination
          </button>
        </div>
      </div>

      {/* Call to Action */}
      <section className="py-20 text-white bg-gradient-to-br from-slate-900 via-purple-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-heritage font-bold mb-8">
            Ready for More Adventures?
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Explore more of India's incredible heritage through our
            comprehensive cultural platform
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => onPageChange("heritage")}
              className="bg-gradient-to-r from-saffron-500 to-heritage-red-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition-all duration-300 flex items-center space-x-3 justify-center"
            >
              <Building size={24} />
              <span>Explore Heritage Sites</span>
            </button>

            <button
              onClick={() => onPageChange("quiz")}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white/30 transition-all duration-300 flex items-center space-x-3 justify-center"
            >
              <Award size={24} />
              <span>Test Your Knowledge</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TourPage360;
