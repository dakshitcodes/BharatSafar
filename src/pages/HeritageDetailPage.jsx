import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  Play,
  Camera,
  Globe,
  Users,
  Award,
  Info,
} from "lucide-react";
import PanoViewer from "../components/PanoViewer";
import AudioPlayer from "../components/AudioPlayer";
import ReviewSystem from "../components/ReviewSystem";
import { toast } from "react-hot-toast";

const HeritageDetailPage = ({
  item,
  onPageChange,
  user,
  addBookmark,
  removeBookmark,
  isBookmarked,
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showPanoViewer, setShowPanoViewer] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isBookmarkedLocal, setIsBookmarkedLocal] = useState(false);

  useEffect(() => {
    if (typeof isBookmarked === "function" && item?.id) {
      setIsBookmarkedLocal(isBookmarked(item.id, "heritage"));
    }
    loadReviews();
  }, [item?.id, isBookmarked]);

  // Simulated reviews fetching - consider replacing with real API call
  const loadReviews = () => {
    const sampleReviews = [
      {
        id: 1,
        author: "Rajesh Kumar",
        rating: 5,
        title: "Absolutely Magnificent!",
        content:
          "The architecture is breathtaking and the history is fascinating. A must-visit for anyone interested in Indian heritage.",
        date: "2024-01-15",
        visitDate: "2024-01",
        recommend: true,
        helpful: 12,
      },
      {
        id: 2,
        author: "Sarah Johnson",
        rating: 4,
        title: "Beautiful but crowded",
        content:
          "The monument is stunning, but it gets very crowded during peak hours. I'd recommend visiting early morning for the best experience.",
        date: "2024-02-20",
        visitDate: "2024-02",
        recommend: true,
        helpful: 8,
      },
    ];
    setReviews(sampleReviews);
  };

  const handleBookmark = () => {
    if (isBookmarkedLocal) {
      if (typeof removeBookmark === "function") {
        removeBookmark(item.id, "heritage");
      }
      setIsBookmarkedLocal(false);
      toast.success("Removed from bookmarks");
    } else {
      if (typeof addBookmark === "function") {
        addBookmark({ ...item, type: "heritage" });
      }
      setIsBookmarkedLocal(true);
      toast.success("Added to bookmarks");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: window.location.href,
        });
      } catch {
        // Share cancelled or failed, silently ignore
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleSubmitReview = (reviewData) => {
    setReviews((prev) => [reviewData, ...prev]);
    toast.success("Thank you for your review!");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "history", label: "History", icon: Calendar },
    { id: "architecture", label: "Architecture", icon: Award },
    { id: "visit", label: "Plan Visit", icon: MapPin },
    { id: "reviews", label: "Reviews", icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={item.images?.[0] || item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Navigation */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => onPageChange("heritage")}
            className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-colors"
            aria-label="Back to Heritage List"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 z-20 flex space-x-3">
          <button
            onClick={handleShare}
            className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-colors"
            aria-label="Share Heritage Site"
          >
            <Share2 size={24} />
          </button>

          <button
            onClick={handleBookmark}
            className={`p-3 backdrop-blur-sm rounded-2xl transition-colors ${isBookmarkedLocal
                ? "bg-yellow-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
              }`}
            aria-pressed={isBookmarkedLocal}
            aria-label={isBookmarkedLocal ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark size={24} />
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              {/* Info Section */}
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <span className="bg-gold-500 px-4 py-2 rounded-full text-sm font-semibold">
                    {item.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star
                      className="w-5 h-5 text-yellow-400 fill-current"
                      aria-hidden="true"
                    />
                    <span className="font-semibold">{item.rating}</span>
                    <span className="text-white/80">
                      ({item.reviews_count} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-display font-bold mb-4 heritage-text-glow">
                  {item.title}
                </h1>

                <div className="flex items-center space-x-6 text-lg mb-6">
                  <div className="flex items-center space-x-2">
                    <MapPin
                      className="text-saffron-400"
                      size={20}
                      aria-hidden="true"
                    />
                    <span>{item.state}</span>
                  </div>
                  {item.architecture && (
                    <div className="flex items-center space-x-2">
                      <Award
                        className="text-gold-400"
                        size={20}
                        aria-hidden="true"
                      />
                      <span>{item.architecture}</span>
                    </div>
                  )}
                </div>

                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  {item.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => setShowPanoViewer(true)}
                  className="btn-heritage text-lg px-8 py-4 flex items-center space-x-3"
                  aria-label="Open 360 degree viewer"
                >
                  <Globe size={24} />
                  <span>Experience in 360°</span>
                </button>

                <button
                  className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-3"
                  aria-label="View virtual photography"
                >
                  <Camera size={24} />
                  <span>Virtual Photography</span>
                </button>

                {item.audiobook && (
                  <button
                    className="bg-gold-500/20 backdrop-blur-sm border-2 border-gold-400/40 text-yellow-200 px-8 py-4 rounded-2xl font-semibold hover:bg-gold-500/30 transition-all duration-300 flex items-center space-x-3"
                    aria-label="Listen to audio story"
                  >
                    <Play size={24} />
                    <span>Listen to Story</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Viewer Modal */}
      {showPanoViewer && (
        <div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`360 degree tour of ${item.title}`}
        >
          <div className="w-full h-full max-w-6xl max-h-full">
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="text-2xl font-bold">360° Tour - {item.title}</h3>
              <button
                onClick={() => setShowPanoViewer(false)}
                className="text-white hover:text-red-400 text-2xl"
                aria-label="Close 360 degree viewer"
              >
                ×
              </button>
            </div>
            <PanoViewer
              imageUrl={item.images?.[0]}
              hotspots={[
                {
                  x: 30,
                  y: 40,
                  title: "Main Structure",
                  description: "Primary architectural feature",
                },
                {
                  x: 60,
                  y: 60,
                  title: "Detail View",
                  description: "Intricate craftsmanship",
                },
              ]}
            />
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <nav
        className="bg-white shadow-lg sticky top-16 z-10"
        aria-label="Content tabs"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-semibold whitespace-nowrap transition-colors ${activeTab === tab.id
                    ? "text-gold-700 border-b-2 border-saffron-600"
                    : "text-gray-600 hover:text-gold-700"
                  }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <tab.icon size={18} aria-hidden="true" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-6 py-12" aria-live="polite">
        {activeTab === "overview" && (
          <div className="max-w-4xl mx-auto space-y-10">
            {/* Quick Facts */}
            <div className="bs-card p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-charcoal-900">
                Quick Facts
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-xl bg-ivory-50">
                  <Calendar
                    className="w-10 h-10 text-gold-700 mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <h4 className="font-semibold text-charcoal-900 mb-1">Era</h4>
                  <p className="text-charcoal-600 text-sm font-medium">{item.era || "Ancient & Medieval Era"}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-ivory-50">
                  <Award
                    className="w-10 h-10 text-gold-700 mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <h4 className="font-semibold text-charcoal-900 mb-1">Architecture</h4>
                  <p className="text-charcoal-600 text-sm font-medium">{item.architecture || "Classical Indian"}</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-ivory-50">
                  <Users
                    className="w-10 h-10 text-gold-700 mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <h4 className="font-semibold text-charcoal-900 mb-1">Annual Visitors</h4>
                  <p className="text-charcoal-600 text-sm font-medium">{item.visitors || "1M+ Visitors"}</p>
                </div>
              </div>
            </div>

            {/* Significance */}
            <div className="bs-card p-8">
              <h3 className="text-2xl font-display font-bold mb-4 text-charcoal-900">
                Cultural &amp; Historical Significance
              </h3>
              <p className="text-charcoal-700 text-base md:text-lg leading-relaxed">
                {item.significance || item.description}
              </p>
            </div>

            {/* Audio Story */}
            {item.audiobook && (
              <div className="bs-card p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-charcoal-900">
                  Audio Story
                </h3>
                <AudioPlayer
                  src="/audio/taj-mahal-story.mp3"
                  title={`The Story of ${item.title}`}
                  description={item.audiobook}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Historical Narrative */}
            <div className="bs-card p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-ivory-200">
                <div>
                  <h3 className="text-2xl font-display font-bold text-charcoal-900">
                    Historical Chronicle &amp; Origins
                  </h3>
                  <p className="text-sm text-charcoal-500 mt-1">The origins, royal patronage, and legacy of {item.title}</p>
                </div>
                {item.era && (
                  <span className="bs-badge-gold text-xs self-start sm:self-auto">
                    {item.era}
                  </span>
                )}
              </div>
              <div className="prose prose-stone max-w-none">
                <p className="text-charcoal-700 text-base md:text-lg leading-relaxed whitespace-pre-line">
                  {item.history || item.description}
                </p>
              </div>
            </div>

            {/* Historical Timeline */}
            <div className="bs-card p-8">
              <h3 className="text-2xl font-display font-bold mb-6 text-charcoal-900">
                Key Historical Milestones
              </h3>
              {item.timeline && item.timeline.length > 0 ? (
                <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gold-200">
                  {item.timeline.map((event, index) => (
                    <div key={index} className="flex items-start space-x-4 relative">
                      <div className="w-10 h-10 rounded-full bg-gold-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-md ring-4 ring-white">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-ivory-50 p-4 rounded-xl border border-ivory-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-gold-800 font-sans tracking-wide">
                            {event.year}
                          </span>
                        </div>
                        <p className="text-charcoal-700 text-sm leading-relaxed">{event.event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-charcoal-500">Historical records for {item.title} span centuries of regional heritage and tradition.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "architecture" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bs-card p-8">
              <h3 className="text-2xl font-display font-bold mb-4 text-charcoal-900">
                Architectural Style &amp; Craftsmanship
              </h3>
              <p className="text-charcoal-700 text-base md:text-lg leading-relaxed mb-6">
                {item.title} represents a magnificent example of {item.architecture || "classical Indian architecture"}, built with indigenous engineering mastery and artistic vision.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-ivory-50 p-6 rounded-xl border border-ivory-200">
                  <h4 className="text-lg font-bold text-charcoal-900 mb-3 flex items-center gap-2">
                    <Award size={18} className="text-gold-700" />
                    Key Architectural Style
                  </h4>
                  <p className="text-charcoal-700 text-sm leading-relaxed">
                    {item.architecture || "Traditional stone masonry reflecting indigenous cultural styles"}
                  </p>
                </div>

                <div className="bg-ivory-50 p-6 rounded-xl border border-ivory-200">
                  <h4 className="text-lg font-bold text-charcoal-900 mb-3 flex items-center gap-2">
                    <Calendar size={18} className="text-gold-700" />
                    Period of Construction
                  </h4>
                  <p className="text-charcoal-700 text-sm leading-relaxed">
                    {item.era || "Constructed across key historical dynasties"}
                  </p>
                </div>
              </div>

              {item.significance && (
                <div className="mt-6 p-6 rounded-xl bg-amber-50/60 border border-amber-200/50">
                  <h4 className="font-bold text-amber-900 mb-2">Structural Mastery</h4>
                  <p className="text-charcoal-700 text-sm leading-relaxed">
                    {item.significance}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "visit" && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bs-card p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-charcoal-900">
                  Visiting Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Opening Hours</h4>
                    <p className="text-charcoal-600 text-sm">
                      {item.visiting_info?.hours || "6:00 AM – 6:00 PM (Daily)"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Best Time to Visit</h4>
                    <p className="text-charcoal-600 text-sm">
                      {item.visiting_info?.best_time || "October to March (pleasant weather)"}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Entry Fee</h4>
                    <p className="text-charcoal-600 text-sm">
                      {item.visiting_info?.entry_fee || "Standard ASI / State Heritage entry"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bs-card p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-charcoal-900">
                  Connectivity &amp; Location
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">Location</h4>
                    <p className="text-charcoal-600 text-sm">
                      {item.title}, {item.state}, India
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal-900 mb-1">How to Reach</h4>
                    <p className="text-charcoal-600 text-sm leading-relaxed">
                      {item.visiting_info?.connectivity || `Accessible by rail and road networks across ${item.state}.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nearby Attractions */}
            {item.nearby_poi && item.nearby_poi.length > 0 && (
              <div className="bs-card p-8">
                <h3 className="text-2xl font-display font-bold mb-6 text-charcoal-900">
                  Nearby Attractions
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {item.nearby_poi.map((poi, index) => (
                    <div key={index} className="p-4 rounded-xl bg-ivory-50 border border-ivory-200 text-center">
                      <h4 className="font-semibold text-charcoal-900 mb-1">{poi.name}</h4>
                      <p className="text-gold-700 text-xs font-medium">{poi.distance}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="max-w-4xl mx-auto">
            <ReviewSystem
              itemId={item.id}
              itemType="heritage"
              reviews={reviews}
              onSubmitReview={handleSubmitReview}
              user={user}
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default HeritageDetailPage;
