import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  ArrowRight,
  Star,
  Users,
  MapPin,
  Calendar,
  Sparkles,
  Landmark,
  Music,
  Gem,
  Globe,
  Cpu,
  Trophy,
  Award,
  Heart,
  ChevronRight,
  Compass,
  BookOpen,
  Camera,
  Wind,
  Waves,
  Mountain,
} from "lucide-react";
import ctaBg from "../assets/cta-bg.webp";
import diwaliImg from "../assets/diwali.jpeg";
import kathakImg from "../assets/kathak.jpg";
import rootBridgeImg from "../assets/hidden-gems/root-bridges.jpg";
import goldenTempleImg from "../assets/punjab.jpeg";
import redFortImg from "../assets/redfort.jpg";
import tajMahalImg from "../assets/tajmahal.jpg";
import heroBgVideo from "../assets/home2.mp4";

const HomePage = ({ onPageChange, user, bookmarks, addBookmark }) => {
  const [stats, setStats] = useState({ sites: 0, festivals: 0, arts: 0, users: 0 });
  const [hoveredCard, setHoveredCard] = useState(null);

  // Featured heritage sites
  const featuredSites = [
    {
      id: 1,
      title: "Taj Mahal",
      state: "Uttar Pradesh",
      image: tajMahalImg,
      rating: 4.9,
      visitors: "6M+ visitors/year",
      description: "The epitome of Mughal craftsmanship — an ivory-white marble mausoleum that stands as a testament to eternal love.",
      category: "UNESCO World Heritage",
      yearBuilt: "1632–1653",
    },
    {
      id: 2,
      title: "Red Fort",
      state: "New Delhi",
      image: redFortImg,
      rating: 4.7,
      visitors: "3M+ visitors/year",
      description: "The majestic red sandstone fortress that was the seat of Mughal power for over two centuries.",
      category: "UNESCO World Heritage",
      yearBuilt: "1639–1648",
    },
    {
      id: 3,
      title: "Golden Temple",
      state: "Punjab",
      image: goldenTempleImg,
      rating: 4.9,
      visitors: "5M+ visitors/year",
      description: "Harmandir Sahib — the holiest shrine of Sikhism, its gilded reflection shimmering in the sacred Amrit Sarovar.",
      category: "Sacred Site",
      yearBuilt: "1577",
    },
  ];

  const experiences = [
    { icon: Landmark, label: "Heritage Sites", desc: "150+ monuments", page: "heritage", color: "bg-amber-50 text-amber-700" },
    { icon: Calendar, label: "Festivals", desc: "200+ celebrations", page: "festivals", color: "bg-rose-50 text-rose-700" },
    { icon: Music, label: "Arts & Crafts", desc: "180+ traditions", page: "arts", color: "bg-violet-50 text-violet-700" },
    { icon: Gem, label: "Hidden Gems", desc: "Undiscovered places", page: "gems", color: "bg-emerald-50 text-emerald-700" },
    { icon: Globe, label: "360° Tours", desc: "Virtual immersion", page: "360tour", color: "bg-sky-50 text-sky-700" },
    { icon: Cpu, label: "AI Heritage Guide", desc: "Ask anything", page: "chat", color: "bg-indigo-50 text-indigo-700" },
    { icon: Trophy, label: "Quiz & Learn", desc: "Test your knowledge", page: "quiz", color: "bg-orange-50 text-gold-700" },
    { icon: MapPin, label: "India Map", desc: "Explore by region", page: "map", color: "bg-teal-50 text-teal-700" },
  ];

  const quickDiscoveries = [
    {
      title: "Festival of Lights",
      subtitle: "Diwali — India's most luminous celebration",
      image: diwaliImg,
      action: () => onPageChange("festivals"),
    },
    {
      title: "Classical Dance",
      subtitle: "Eight sacred dance traditions of India",
      image: kathakImg,
      action: () => onPageChange("arts"),
    },
    {
      title: "Hidden Gems",
      subtitle: "Places most travelers never discover",
      image: rootBridgeImg,
      action: () => onPageChange("gems"),
    },
  ];

  const testimonials = [
    {
      quote: "BharatSafar completely transformed how I experience India's culture. The 360° tours felt like I was truly there.",
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
    },
    {
      quote: "The AI heritage guide answered questions I didn't even know I had. Incredibly detailed and culturally nuanced.",
      name: "Arjun Mehta",
      location: "Bangalore",
      rating: 5,
    },
    {
      quote: "Finally, a platform that treats India's heritage with the depth and reverence it deserves.",
      name: "Kavitha Nair",
      location: "Kerala",
      rating: 5,
    },
  ];

  // Animate stats on mount
  useEffect(() => {
    const animateValue = (start, end, duration, setter) => {
      let startTime = null;
      const step = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        setter(Math.floor(progress * (end - start) + start));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => {
      animateValue(0, 150, 2000, (v) => setStats((p) => ({ ...p, sites: v })));
      animateValue(0, 200, 2200, (v) => setStats((p) => ({ ...p, festivals: v })));
      animateValue(0, 180, 2400, (v) => setStats((p) => ({ ...p, arts: v })));
      animateValue(0, 50000, 2600, (v) => setStats((p) => ({ ...p, users: v })));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-ivory-100">
      {/* ═══════════════════════════════════════════════
          HERO — Cinematic video background
      ═══════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] overflow-hidden flex items-center justify-center">
        {/* Video Background */}
        <video
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105"
          aria-hidden="true"
        >
          <source src={heroBgVideo} type="video/mp4" />
        </video>

        {/* Layered Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 via-charcoal-900/30 to-charcoal-900/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/40 via-transparent to-charcoal-900/20" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Eyebrow label */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
            <span className="text-xs font-sans font-semibold text-white/90 tracking-widest uppercase">
              Premium Cultural Experience
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.05] tracking-tight mb-6">
            Discover India
            <span className="block italic text-gold-300 font-semibold">
              Differently.
            </span>
          </h1>

          {/* Supporting text */}
          <p className="font-sans text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed mb-10">
            Immersive 360° tours, AI-powered heritage guides, and curated journeys through 5,000 years of civilization.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onPageChange("states")}
              className="bs-btn bs-btn-lg group"
              style={{
                background: "linear-gradient(135deg, #D4AF50 0%, #C9A84C 100%)",
                color: "#1C1917",
                boxShadow: "0 4px 20px rgba(201, 168, 76, 0.4)",
              }}
            >
              Start Exploring
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => onPageChange("360tour")}
              className="bs-btn bs-btn-lg bs-btn-outline-white group"
            >
              <Play size={18} />
              360° Virtual Tour
            </button>
          </div>
        </div>

        {/* Stats strip — bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 bg-charcoal-900/70 backdrop-blur-md border-t border-white/10">
          <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { number: stats.sites, suffix: "+", label: "Heritage Sites" },
              { number: stats.festivals, suffix: "+", label: "Festivals" },
              { number: stats.arts, suffix: "+", label: "Art Forms" },
              { number: (stats.users / 1000).toFixed(0), suffix: "K+", label: "Explorers" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-2xl md:text-3xl font-bold text-gold-400">
                  {stat.number}{stat.suffix}
                </div>
                <div className="font-sans text-xs text-white/60 mt-0.5 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          EXPERIENCES GRID — 8 featured categories
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="bs-label text-gold-600 mb-3">What BharatSafar Offers</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900 leading-tight">
                Every facet of<br />
                <span className="italic font-semibold text-gold-700">India's culture.</span>
              </h2>
            </div>
            <p className="font-sans text-charcoal-500 max-w-xs leading-relaxed text-sm">
              From ancient temples to living traditions — explore India's heritage your way.
            </p>
          </div>

          {/* Experiences Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {experiences.map((exp, i) => {
              const Icon = exp.icon;
              return (
                <button
                  key={i}
                  onClick={() => onPageChange(exp.page)}
                  className="group p-5 rounded-2xl border border-ivory-300 bg-ivory-50 hover:bg-white hover:border-gold-300 hover:shadow-bs-md transition-all duration-300 text-left"
                >
                  <div className={`w-10 h-10 rounded-xl ${exp.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon size={20} />
                  </div>
                  <div className="font-sans font-semibold text-charcoal-800 text-sm mb-1 group-hover:text-gold-700 transition-colors">
                    {exp.label}
                  </div>
                  <div className="font-sans text-xs text-charcoal-400">{exp.desc}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FEATURED HERITAGE — Editorial card layout
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <p className="bs-label text-gold-600 mb-3">Iconic Destinations</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900">
                Featured<br />
                <span className="italic font-semibold text-charcoal-600">Heritage Sites</span>
              </h2>
            </div>
            <button
              onClick={() => onPageChange("heritage")}
              className="flex items-center gap-2 text-sm font-sans font-semibold text-gold-700 hover:text-gold-800 transition-colors group"
            >
              View all sites
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Cards — asymmetric editorial layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredSites.map((site, index) => (
              <div
                key={site.id}
                className={`group bs-card cursor-pointer ${index === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`}
                onMouseEnter={() => setHoveredCard(site.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Image */}
                <div className={`overflow-hidden relative ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <img
                    src={site.image}
                    alt={site.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Badge */}
                  <div className="absolute top-4 left-4 bs-badge-gold text-xs">
                    {site.category}
                  </div>

                  {/* Bookmark */}
                  {addBookmark && (
                    <button
                      onClick={(e) => { e.stopPropagation(); addBookmark({ ...site, type: "heritage" }); }}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm opacity-0 group-hover:opacity-100"
                      aria-label={`Save ${site.title}`}
                    >
                      <Heart size={14} className="text-charcoal-600 hover:text-terracotta-500 transition-colors" />
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-charcoal-400">
                      <MapPin size={13} />
                      <span className="font-sans text-xs font-medium">{site.state}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                      <Star size={12} className="text-amber-500 fill-amber-500" />
                      <span className="font-sans text-xs font-bold text-amber-700">{site.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-display text-xl font-bold text-charcoal-900 mb-2 group-hover:text-gold-700 transition-colors">
                    {site.title}
                  </h3>
                  <p className="font-sans text-sm text-charcoal-500 leading-relaxed mb-4 line-clamp-2">
                    {site.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-ivory-200">
                    <span className="font-sans text-xs text-charcoal-400">Built {site.yearBuilt}</span>
                    <button className="flex items-center gap-1 text-xs font-sans font-semibold text-gold-700 hover:text-gold-800 group/btn transition-colors">
                      Explore
                      <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          360° EXPERIENCE — Premium iframe section
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-charcoal-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="bs-label text-gold-500 mb-4">Immersive Experience</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Step Inside the Taj Mahal
            </h2>
            <p className="font-sans text-charcoal-300 max-w-xl mx-auto text-base leading-relaxed">
              Explore one of the world's greatest monuments in real 360° — powered by AirPano.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-bs-xl border border-charcoal-700 mx-auto max-w-5xl">
            <iframe
              src="https://www.airpano.com/embed.php?3D=taj-mahal-india-2"
              title="360° Taj Mahal virtual tour by AirPano"
              width="100%"
              height="540"
              frameBorder="0"
              allowFullScreen
              className="block"
            />
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => onPageChange("360tour")}
              className="bs-btn bs-btn-lg group"
              style={{ background: "linear-gradient(135deg, #D4AF50 0%, #C9A84C 100%)", color: "#1C1917" }}
            >
              Explore All 360° Tours
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          QUICK DISCOVERIES — Editorial cards
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-ivory-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="bs-label text-gold-600 mb-3">Curated for You</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900">
              Begin Your Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickDiscoveries.map((item, i) => (
              <div
                key={i}
                onClick={item.action}
                className="group bs-card cursor-pointer overflow-hidden"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && item.action()}
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-display text-xl font-bold text-white mb-1">{item.title}</h3>
                    <p className="font-sans text-sm text-white/75">{item.subtitle}</p>
                  </div>
                </div>
                <div className="p-5">
                  <button className="flex items-center gap-1.5 text-sm font-sans font-semibold text-gold-700 hover:text-gold-800 group/btn transition-colors">
                    Discover More
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PLATFORM FEATURES — Why BharatSafar
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Editorial text */}
            <div>
              <p className="bs-label text-gold-600 mb-4">Why BharatSafar</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900 leading-tight mb-6">
                Heritage, as it
                <span className="block italic font-semibold text-gold-700">was meant to be.</span>
              </h2>
              <p className="font-sans text-charcoal-500 leading-relaxed mb-8 max-w-lg">
                We believe India's culture deserves more than a Wikipedia page. BharatSafar brings together cutting-edge technology and deep cultural knowledge to create experiences that are immersive, personal, and unforgettable.
              </p>
              <div className="space-y-5">
                {[
                  {
                    icon: Globe,
                    title: "360° Virtual Tours",
                    desc: "Explore monuments with interactive panoramic views and expert narration.",
                  },
                  {
                    icon: Cpu,
                    title: "AI Heritage Guide",
                    desc: "Get instant, deeply researched answers about history, culture, and traditions.",
                  },
                  {
                    icon: Compass,
                    title: "Personalized Journeys",
                    desc: "AI-powered itineraries tailored to your interests, time, and travel style.",
                  },
                ].map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-100 transition-colors">
                        <Icon size={18} className="text-gold-700" />
                      </div>
                      <div>
                        <div className="font-sans font-semibold text-charcoal-800 mb-1">{f.title}</div>
                        <div className="font-sans text-sm text-charcoal-500 leading-relaxed">{f.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right — Stats cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: "150+", label: "Heritage Sites", sub: "Across all 28 states", color: "border-amber-200 bg-amber-50" },
                { num: "50K+", label: "Explorers", sub: "Trust BharatSafar", color: "border-emerald-200 bg-emerald-50" },
                { num: "4.9★", label: "Average Rating", sub: "From verified reviews", color: "border-violet-200 bg-violet-50" },
                { num: "200+", label: "Festivals", sub: "Documented & curated", color: "border-rose-200 bg-rose-50" },
              ].map((s, i) => (
                <div key={i} className={`rounded-2xl border p-6 ${s.color}`}>
                  <div className="font-display text-3xl font-bold text-charcoal-900 mb-1">{s.num}</div>
                  <div className="font-sans font-semibold text-charcoal-700 text-sm">{s.label}</div>
                  <div className="font-sans text-xs text-charcoal-400 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
      <section className="py-24 bg-ivory-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="bs-label text-gold-600 mb-3">Traveler Stories</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-charcoal-900">
              What explorers say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bs-card-editorial p-8 bg-white rounded-2xl shadow-bs-sm border border-ivory-200">
                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array(t.rating).fill(0).map((_, si) => (
                    <Star key={si} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="font-sans text-charcoal-600 leading-relaxed mb-6 italic">
                  "{t.quote}"
                </blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-100 flex items-center justify-center">
                    <span className="font-display font-bold text-gold-700 text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <div className="font-sans font-semibold text-charcoal-800 text-sm">{t.name}</div>
                    <div className="font-sans text-xs text-charcoal-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA — "Your India is Waiting"
      ═══════════════════════════════════════════════ */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={ctaBg}
            alt="India heritage landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal-900/75" />
        </div>

        {/* Decorative circles */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-40 h-40 border border-white rounded-full animate-spin-slow" />
          <div className="absolute bottom-10 right-16 w-28 h-28 border border-white rounded-full animate-spin-slow" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="bs-label text-gold-400 mb-5">The Journey Begins Here</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Your India is
            <span className="italic text-gold-300"> waiting.</span>
          </h2>
          <p className="font-sans text-white/75 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Join thousands of explorers discovering the incredible depth of India's heritage, culture, and traditions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onPageChange("states")}
              className="bs-btn bs-btn-lg group"
              style={{ background: "linear-gradient(135deg, #D4AF50 0%, #C9A84C 100%)", color: "#1C1917" }}
            >
              Start Exploring
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onPageChange("chat")}
              className="bs-btn bs-btn-lg bs-btn-outline-white"
            >
              Ask AI Guide
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          NEWSLETTER (shown to non-signed-in users)
      ═══════════════════════════════════════════════ */}
      {!user && (
        <section className="py-20 bg-white border-t border-ivory-200">
          <div className="max-w-xl mx-auto px-6 text-center">
            <p className="bs-label text-gold-600 mb-3">Stay Connected</p>
            <h3 className="font-display text-3xl font-bold text-charcoal-900 mb-4">
              India's stories, in your inbox.
            </h3>
            <p className="font-sans text-charcoal-500 mb-8 text-sm leading-relaxed">
              Weekly heritage discoveries, festival guides, and hidden gem reveals.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                placeholder="Your email address"
                aria-label="Email address for newsletter"
                required
                className="bs-input flex-1 min-w-0"
              />
              <button type="submit" className="bs-btn-primary bs-btn px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="font-sans text-xs text-charcoal-400 mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
