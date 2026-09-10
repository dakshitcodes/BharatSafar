import React, { useState, useEffect } from "react";
import {
  User,
  Heart,
  Trophy,
  MapPin,
  Calendar,
  Star,
  Settings,
  LogOut,
  Download,
  Share2,
  Edit3,
  Camera,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import {
  getUserData,
  updateUserProfile,
  getUserStats,
} from "../services/userService";
import { getUserQuizStats, getUserQuizHistory } from "../services/quizService";
import { getUserBadges } from "../services/badgeService";
import { getUserBookmarks } from "../services/bookmarkService";

const AccountPage = () => {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [badges, setBadges] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [profileData, setProfileData] = useState({
    full_name: "",
    bio: "",
    avatar_url: "",
  });
  const [stats, setStats] = useState({
    totalPoints: 0,
    level: 1,
    nextLevelPoints: 1000,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "bookmarks", label: "Bookmarks", icon: Heart },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "history", label: "History", icon: Calendar },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const interestOptions = [
    "Ancient Monuments",
    "Classical Dance",
    "Folk Arts",
    "Festivals",
    "Temple Architecture",
    "Mughal Heritage",
    "Regional Cuisine",
    "Traditional Crafts",
    "Historical Sites",
    "Natural Heritage",
  ];

  // Fetch user data on component mount
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) {
      setLoading(false);
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);

        // Get user from Supabase
        const user = await getUserData(clerkUser.id);
        setUserData(user);

        if (user) {
          // Set profile data
          setProfileData({
            full_name: user.full_name || "",
            bio: user.bio || "",
            avatar_url: user.avatar_url || "",
          });

          // Load all user data in parallel
          const [stats, userBadges, userBookmarks, history] = await Promise.all(
            [
              getUserQuizStats(user.id),
              getUserBadges(user.id),
              getUserBookmarks(user.id),
              getUserQuizHistory(user.id),
            ]
          );

          setQuizStats(stats);
          setBadges(userBadges);
          setBookmarks(userBookmarks);
          setQuizHistory(history);

          // Calculate stats
          const calculatedStats = {
            totalPoints: user.total_points || 0,
            level: Math.floor((user.total_points || 0) / 1000) + 1,
            nextLevelPoints: 1000 - ((user.total_points || 0) % 1000),
          };
          setStats(calculatedStats);
        }

        setLoading(false);
      } catch (err) {
        console.error("❌ Error loading user data:", err);
        setLoading(false);
      }
    };

    loadUserData();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Handle profile update
  const handleProfileUpdate = async () => {
    if (!userData) return;

    try {
      const result = await updateUserProfile(userData.id, {
        full_name: profileData.full_name,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
      });

      if (result) {
        setUserData(result);
        setIsEditing(false);
        alert("✅ Profile updated successfully!");
      }
    } catch (err) {
      console.error("❌ Error updating profile:", err);
      alert("❌ Error updating profile");
    }
  };

  // Export user data
  const exportUserData = () => {
    const dataToExport = {
      profile: profileData,
      stats: stats,
      quizStats: quizStats,
      bookmarks: bookmarks,
      badges: badges,
      quizHistory: quizHistory,
    };

    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `bharatverse-data-${profileData.full_name
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    alert("✅ Data exported successfully!");
  };

  // Not signed in
  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Please Log In
          </h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to view your account.
          </p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {profileData.avatar_url ? (
                  <img
                    src={profileData.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  clerkUser?.firstName?.charAt(0).toUpperCase() || "U"
                )}
              </div>

              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-600 transition-colors">
                  <Camera size={18} />
                </button>
              )}

              {/* Level Badge */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                {stats.level}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        full_name: e.target.value,
                      })
                    }
                    className="text-3xl font-bold bg-transparent border-b-2 border-orange-500 outline-none w-full"
                  />
                  <textarea
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    placeholder="Tell us about your heritage interests..."
                    className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
                    rows="2"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileData.full_name || clerkUser?.firstName || "User"}
                  </h1>
                  <p className="text-lg text-gray-600 mb-2">
                    {clerkUser?.emailAddresses[0]?.emailAddress}
                  </p>
                  {profileData.bio && (
                    <p className="text-gray-700 mb-4">{profileData.bio}</p>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleProfileUpdate}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-lg hover:shadow-lg transition flex items-center justify-center space-x-2"
                  >
                    <Edit3 size={18} />
                    <span>Edit Profile</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.totalPoints}
            </div>
            <div className="text-gray-600 text-sm">Total Points</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((1000 - stats.nextLevelPoints) / 1000) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {bookmarks.length}
            </div>
            <div className="text-gray-600 text-sm">Bookmarks</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {quizStats?.total_quizzes || 0}
            </div>
            <div className="text-gray-600 text-sm">Quizzes Taken</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {badges.length}
            </div>
            <div className="text-gray-600 text-sm">Badges Earned</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-1 px-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-4 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                {/* Progress Overview */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">
                    Your Heritage Journey
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                      <h4 className="font-semibold mb-3 text-blue-800">
                        Quiz Performance
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-blue-600">Average Score:</span>
                          <span className="font-semibold text-blue-800">
                            {quizStats?.average_score || 0}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">
                            Quizzes Completed:
                          </span>
                          <span className="font-semibold text-blue-800">
                            {quizStats?.total_quizzes || 0}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-600">Highest Score:</span>
                          <span className="font-semibold text-blue-800">
                            {quizStats?.highest_score || 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl">
                      <h4 className="font-semibold mb-3 text-green-800">
                        Your Stats
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-green-600">Bookmarks:</span>
                          <span className="font-semibold text-green-800">
                            {bookmarks.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">
                            Heritage Level:
                          </span>
                          <span className="font-semibold text-green-800">
                            {stats.level}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-600">Badges:</span>
                          <span className="font-semibold text-green-800">
                            {badges.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookmarks Tab */}
            {activeTab === "bookmarks" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Your Bookmarks ({bookmarks.length})
                </h3>

                {bookmarks.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarks.map((bookmark) => (
                      <div
                        key={bookmark.id}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition"
                      >
                        {bookmark.image_url && (
                          <img
                            src={bookmark.image_url}
                            alt={bookmark.title}
                            className="w-full h-32 object-cover"
                          />
                        )}
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-1 rounded-full">
                              Bookmarked
                            </span>
                          </div>
                          <h4 className="font-semibold mb-1 line-clamp-1">
                            {bookmark.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {bookmark.location}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {bookmark.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={48} className="text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Bookmarks Yet
                    </h4>
                    <p className="text-gray-600">
                      Start exploring heritage sites and save your favorites!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === "achievements" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Your Badges</h3>
                {badges.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="p-6 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-lg"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="text-4xl animate-bounce">
                            {badge.badge_icon}
                          </div>

                          <div className="flex-1">
                            <h4 className="font-semibold mb-2 text-yellow-800">
                              {badge.badge_name}
                            </h4>
                            <p className="text-sm text-gray-600 mb-3">
                              {badge.description}
                            </p>
                            <span className="inline-flex items-center px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-medium">
                              ✅ Unlocked
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Trophy size={48} className="text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Badges Yet
                    </h4>
                    <p className="text-gray-600">
                      Complete quizzes to earn badges!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div>
                <h3 className="text-xl font-semibold mb-6">
                  Recent Quiz Results
                </h3>

                {quizHistory.length > 0 ? (
                  <div className="space-y-4">
                    {quizHistory.slice(0, 10).map((quiz, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                      >
                        <div>
                          <h5 className="font-medium text-gray-900">
                            {quiz.quiz_type || "Heritage Quiz"}
                          </h5>
                          <p className="text-sm text-gray-600">
                            {new Date(quiz.completed_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              quiz.percentage >= 80
                                ? "text-green-600"
                                : quiz.percentage >= 60
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {Math.round(quiz.percentage)}%
                          </div>
                          <div className="text-sm text-gray-500">
                            {quiz.score}/{quiz.total_questions}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar
                      size={48}
                      className="text-gray-300 mx-auto mb-4"
                    />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      No Quiz History
                    </h4>
                    <p className="text-gray-600">
                      Take your first quiz to start tracking your progress!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                <h3 className="text-xl font-semibold">Settings</h3>

                {/* Data Management */}
                <div>
                  <h4 className="font-semibold mb-4">Data Management</h4>
                  <div className="space-y-4">
                    <button
                      onClick={exportUserData}
                      className="flex items-center space-x-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors w-full"
                    >
                      <Download size={18} />
                      <span>Export My Data</span>
                    </button>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h4 className="font-semibold mb-4">Account Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong>{" "}
                      {clerkUser?.emailAddresses[0]?.emailAddress}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Member Since:</strong>{" "}
                      {userData?.created_at
                        ? new Date(userData.created_at).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Total Points:</strong> {stats.totalPoints}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
