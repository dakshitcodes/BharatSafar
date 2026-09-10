import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Trophy,
  Clock,
  Star,
  Target,
  Award,
  BookOpen,
  Landmark,
  Calendar,
  Music,
  Scroll,
  Globe,
  Gem,
  Users,
  TrendingUp,
  Medal,
  Crown,
  Sparkles,
  Brain,
  Zap,
  BookMarked,
  GraduationCap,
  MapPin,
  Eye,
  Shield,
  ChevronRight,
  Loader,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Quiz from "../components/Quiz";
import quizQuestionsData from "../data/quiz_questions.json";
import { getUserQuizStats, getUserQuizHistory } from "../services/quizService";
import { getUserBadges } from "../services/badgeService";
import { getUserData } from "../services/userService";
import heritageQuizHero from "../assets/quiz-page.jpg";

const QuizPage = ({ onPageChange, isSignedIn }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    bestScore: 0,
    totalPoints: 0,
    badges: [],
    quizHistory: [],
  });

  const quizCategories = [
    {
      id: "heritage-monuments",
      title: "Heritage Monuments",
      description:
        "Test your knowledge about India's magnificent monuments and architectural marvels",
      difficulty: "Mixed",
      questions:
        quizQuestionsData["heritage-monuments"]?.questions?.length || 0,
      icon: Landmark,
      color: "from-orange-500 to-red-500",
      estimatedTime: "10 min",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      id: "festivals",
      title: "Indian Festivals",
      description:
        "Explore the vibrant world of Indian festivals and celebrations",
      difficulty: "Easy",
      questions: quizQuestionsData["festivals"]?.questions?.length || 0,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
      estimatedTime: "8 min",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      id: "classical-arts",
      title: "Classical Arts",
      description:
        "Challenge yourself on traditional dances, music, and art forms",
      difficulty: "Hard",
      questions: quizQuestionsData["classical-arts"]?.questions?.length || 0,
      icon: Music,
      color: "from-blue-500 to-indigo-500",
      estimatedTime: "12 min",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      id: "ancient-history",
      title: "Ancient History",
      description:
        "Journey through India's ancient civilizations and historical events",
      difficulty: "Hard",
      questions: quizQuestionsData["ancient-history"]?.questions?.length || 0,
      icon: Scroll,
      color: "from-green-500 to-teal-500",
      estimatedTime: "15 min",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      id: "regional-culture",
      title: "Regional Culture",
      description:
        "Discover the diverse cultural traditions across Indian states",
      difficulty: "Medium",
      questions: quizQuestionsData["regional-culture"]?.questions?.length || 0,
      icon: Globe,
      color: "from-yellow-500 to-orange-500",
      estimatedTime: "11 min",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      id: "hidden-gems",
      title: "Hidden Gems",
      description: "Explore lesser-known heritage sites and cultural treasures",
      difficulty: "Expert",
      questions: quizQuestionsData["hidden-gems"]?.questions?.length || 0,
      icon: Gem,
      color: "from-emerald-500 to-cyan-500",
      estimatedTime: "10 min",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
  ];

  // Load user stats on component mount
  useEffect(() => {
    const loadUserQuizData = async () => {
      if (isLoaded && isSignedIn && clerkUser) {
        try {
          console.log("📥 Loading user quiz data from Supabase...");

          // Get user from database
          const userData = await getUserData(clerkUser.id);

          if (!userData) {
            console.error("❌ User not found in database");
            setLoading(false);
            return;
          }

          // Load all quiz data in parallel
          const [stats, history, userBadges] = await Promise.all([
            getUserQuizStats(userData.id),
            getUserQuizHistory(userData.id),
            getUserBadges(userData.id),
          ]);

          // Calculate badges array for display
          const badgeNames = userBadges.map((b) => b.badge_name);

          setUserStats({
            totalQuizzes: stats?.total_quizzes || 0,
            averageScore: stats?.average_score || 0,
            bestScore: stats?.highest_score || 0,
            totalPoints: userData.total_points || 0,
            badges: badgeNames,
            quizHistory: history || [],
          });

          console.log("✅ Quiz data loaded successfully");
        } catch (error) {
          console.error("❌ Error loading quiz data:", error);

          // Use default stats if error
          setUserStats({
            totalQuizzes: 0,
            averageScore: 0,
            bestScore: 0,
            totalPoints: 0,
            badges: [],
            quizHistory: [],
          });
        }
      }
      setLoading(false);
    };

    loadUserQuizData();
  }, [isLoaded, isSignedIn, clerkUser]);

  // Handle quiz completion
  const handleQuizComplete = async (results) => {
    if (!clerkUser || !isSignedIn || !isLoaded) {
      console.error("❌ User not authenticated");
      return;
    }

    console.log("✅ Quiz completed, refreshing stats...");

    try {
      // Get fresh user data
      const userData = await getUserData(clerkUser.id);

      if (!userData) {
        console.error("❌ User not found");
        return;
      }

      // Load updated stats
      const [stats, history, userBadges] = await Promise.all([
        getUserQuizStats(userData.id),
        getUserQuizHistory(userData.id),
        getUserBadges(userData.id),
      ]);

      const badgeNames = userBadges.map((b) => b.badge_name);

      setUserStats({
        totalQuizzes: stats?.total_quizzes || 0,
        averageScore: stats?.average_score || 0,
        bestScore: stats?.highest_score || 0,
        totalPoints: userData.total_points || 0,
        badges: badgeNames,
        quizHistory: history || [],
      });

      console.log("✅ Stats refreshed after quiz completion");
    } catch (error) {
      console.error("❌ Error refreshing stats:", error);
    }

    setSelectedQuiz(null);
  };

  const checkAchievements = (results, totalQuizzes, timeSpent) => {
    const newBadges = [];

    if (results.percentage === 100) {
      newBadges.push("Perfectionist");
    }

    if (results.percentage >= 80 && selectedQuiz?.id === "heritage-monuments") {
      newBadges.push("Heritage Master");
    }

    if (totalQuizzes >= 5) {
      newBadges.push("Culture Guru");
    }

    if (timeSpent < 300) {
      newBadges.push("Speed Demon");
    }

    if (totalQuizzes >= 10) {
      newBadges.push("Dedicated Learner");
    }

    return newBadges;
  };

  const achievements = [
    {
      id: "first-quiz",
      name: "First Steps",
      description: "Complete your first quiz",
      icon: Target,
      color: "text-blue-600",
      unlocked: userStats.totalQuizzes >= 1,
    },
    {
      id: "perfectionist",
      name: "Perfectionist",
      description: "Score 100% on any quiz",
      icon: Crown,
      color: "text-yellow-600",
      unlocked: userStats.badges.includes("Perfectionist"),
    },
    {
      id: "heritage-master",
      name: "Heritage Master",
      description: "Score 80%+ on Heritage quiz",
      icon: Medal,
      color: "text-orange-600",
      unlocked: userStats.badges.includes("Heritage Master"),
    },
    {
      id: "culture-guru",
      name: "Culture Guru",
      description: "Complete 5 different quizzes",
      icon: Brain,
      color: "text-purple-600",
      unlocked: userStats.badges.includes("Culture Guru"),
    },
    {
      id: "speed-demon",
      name: "Speed Demon",
      description: "Complete a quiz in under 5 minutes",
      icon: Zap,
      color: "text-red-600",
      unlocked: userStats.badges.includes("Speed Demon"),
    },
    {
      id: "dedicated-learner",
      name: "Dedicated Learner",
      description: "Take 10+ quizzes",
      icon: BookMarked,
      color: "text-green-600",
      unlocked: userStats.badges.includes("Dedicated Learner"),
    },
  ];

  const leaderboard = [
    {
      rank: 1,
      name: "Rajesh Kumar",
      points: 2840,
      badge: Trophy,
      color: "text-yellow-500",
    },
    {
      rank: 2,
      name: "Priya Sharma",
      points: 2650,
      badge: Medal,
      color: "text-gray-400",
    },
    {
      rank: 3,
      name: "Amit Patel",
      points: 2580,
      badge: Award,
      color: "text-amber-600",
    },
    {
      rank: 4,
      name: "Sunita Gupta",
      points: 2450,
      badge: Star,
      color: "text-blue-500",
    },
    {
      rank: 5,
      name: "Rahul Singh",
      points: 2380,
      badge: Sparkles,
      color: "text-purple-500",
    },
    {
      rank: 6,
      name: clerkUser?.firstName
        ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`
        : "You",
      points: userStats.totalPoints,
      badge: Target,
      color: "text-green-500",
      isCurrentUser: true,
    },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100 border-green-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "hard":
        return "text-red-600 bg-red-100 border-red-200";
      case "expert":
        return "text-purple-600 bg-purple-100 border-purple-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return <Shield size={14} className="text-green-600" />;
      case "medium":
        return <Eye size={14} className="text-yellow-600" />;
      case "hard":
        return <Zap size={14} className="text-red-600" />;
      case "expert":
        return <Crown size={14} className="text-purple-600" />;
      default:
        return <Target size={14} className="text-gray-600" />;
    }
  };

  const handleGoBackToCategories = () => {
    setSelectedQuiz(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} />
          <p className="text-gray-600">Loading your quiz data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!selectedQuiz && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          {/* Hero Header */}
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16 md:py-20 relative overflow-hidden">
            {/* subtle decorative icons (optional – you already have them) */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-10 left-10">
                <Brain size={90} className="text-white" />
              </div>
              <div className="absolute bottom-10 right-10">
                <BookOpen size={70} className="text-white" />
              </div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="grid md:grid-cols-2 gap-10 items-center">
                {/* Left: text */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="flex items-center mb-4">
                    <GraduationCap size={50} className="text-yellow-300 mr-3" />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heritage font-bold leading-tight">
                      Heritage Quiz
                    </h1>
                  </div>
                  <p className="text-lg md:text-xl max-w-xl opacity-90 leading-relaxed">
                    Test your knowledge of India&apos;s monuments, festivals,
                    classical arts and timeless traditions. Earn points, unlock
                    badges, and become a true heritage explorer.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      🇮🇳 Pan‑India culture
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      🏆 Gamified learning
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      🎓 For students & enthusiasts
                    </span>
                  </div>
                </motion.div>

                {/* Right: image card */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="hidden md:block"
                >
                  <div className="relative">
                    <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-white/5 backdrop-blur">
                      <img
                        src={heritageQuizHero}
                        alt="Indian heritage collage with monuments and festivals"
                        className="w-full h-80 object-cover"
                      />
                    </div>

                    {/* small overlay card */}
                    <div className="absolute -bottom-6 left-6 bg-white text-gray-800 rounded-2xl shadow-lg px-4 py-3 flex items-center space-x-3">
                      <MapPin className="text-saffron-600" size={20} />
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Discover India
                        </p>
                        <p className="text-sm font-bold">
                          25+ heritage quiz themes
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* yha tk */}

          {/* Quiz History */}
          {userStats.quizHistory.length > 0 && (
            <div className="container mx-auto px-4 py-12 mb-16">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                Your Recent Quizzes
              </h2>
              <div className="space-y-4">
                {userStats.quizHistory.slice(0, 5).map((quiz, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {quiz.quiz_type}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {new Date(quiz.completed_at).toLocaleDateString()} at{" "}
                        {new Date(quiz.completed_at).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-amber-600">
                        {Math.round(quiz.percentage)}%
                      </div>
                      <div className="text-sm text-gray-600">
                        {quiz.score}/{quiz.total_questions}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz Categories Section */}
          <div className="container mx-auto px-4 py-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
                <Target className="mr-3 text-orange-600" size={40} />
                Choose Your Challenge
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Select a quiz category to test your knowledge and earn points.
                Each category offers unique challenges and learning
                opportunities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {quizCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl cursor-pointer group hover:shadow-xl transition-all duration-300 overflow-hidden"
                    onClick={() => setSelectedQuiz(category)}
                  >
                    <div
                      className={`bg-gradient-to-r ${category.color} p-6 text-white relative`}
                    >
                      <div className="absolute top-2 right-2 opacity-20">
                        <IconComponent size={80} />
                      </div>
                      <div className="flex items-center justify-between mb-4 relative z-10">
                        <div
                          className={`p-3 rounded-xl ${category.bgColor} group-hover:scale-110 transition-transform duration-300`}
                        >
                          <IconComponent
                            className={category.iconColor}
                            size={32}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          {getDifficultyIcon(category.difficulty)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                              category.difficulty
                            )}`}
                          >
                            {category.difficulty}
                          </span>
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 relative z-10">
                        {category.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed relative z-10">
                        {category.description}
                      </p>
                    </div>

                    <div className="p-6 bg-white">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
                        <div className="flex items-center space-x-2">
                          <Target size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {category.questions} Questions
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock size={16} className="text-gray-500" />
                          <span className="font-medium">
                            {category.estimatedTime}
                          </span>
                        </div>
                      </div>
                      <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-2">
                        <span>Start Quiz</span>
                        <ChevronRight
                          size={18}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Achievements Section */}
          <div className="container mx-auto px-4 py-12 mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
                <Medal className="mr-3 text-orange-600" size={40} />
                Achievements & Badges
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Unlock badges and achievements as you progress through your
                heritage knowledge journey
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {achievements.map((achievement, index) => {
                const IconComponent = achievement.icon;
                return (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl text-center p-6 group transition-all duration-300 ${achievement.unlocked
                        ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:shadow-lg"
                        : "bg-gray-50 opacity-60 hover:opacity-80"
                      }`}
                  >
                    <div
                      className={`mb-3 ${achievement.unlocked ? "animate-bounce" : ""
                        }`}
                    >
                      <IconComponent
                        size={36}
                        className={`mx-auto ${achievement.unlocked
                            ? achievement.color
                            : "text-gray-400"
                          } group-hover:scale-110 transition-transform`}
                      />
                    </div>
                    <h3
                      className={`font-bold text-sm mb-2 ${achievement.unlocked
                          ? "text-yellow-800"
                          : "text-gray-500"
                        }`}
                    >
                      {achievement.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {achievement.description}
                    </p>
                    {achievement.unlocked && (
                      <div className="mt-3">
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full flex items-center justify-center space-x-1">
                          <Sparkles size={10} />
                          <span>Unlocked!</span>
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Leaderboard Toggle */}
          <div className="text-center mb-16">
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-2xl flex items-center space-x-2 mx-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <Trophy size={24} className="animate-pulse" />
              <span>{showLeaderboard ? "Hide" : "Show"} Leaderboard</span>
            </button>
          </div>

          {/* Leaderboard */}
          <AnimatePresence>
            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-16"
              >
                <div className="container mx-auto px-4">
                  <div className="bg-white rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4 flex items-center justify-center">
                        <Trophy
                          className="mr-3 text-yellow-500 animate-pulse"
                          size={32}
                        />
                        Weekly Leaderboard
                      </h2>
                      <p className="text-gray-600">
                        See how you rank against other heritage enthusiasts
                      </p>
                    </div>
                    <div className="space-y-4">
                      {leaderboard.map((player, index) => {
                        const BadgeIcon = player.badge;
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:scale-102 ${player.isCurrentUser
                                ? "bg-gradient-to-r from-blue-100 to-indigo-100 border-2 border-blue-300 shadow-md"
                                : "bg-gray-50 hover:bg-gray-100"
                              }`}
                          >
                            <div className="flex items-center space-x-4">
                              <div
                                className={`text-2xl font-bold w-8 text-center ${index === 0
                                    ? "text-yellow-500"
                                    : index === 1
                                      ? "text-gray-400"
                                      : index === 2
                                        ? "text-amber-600"
                                        : "text-gray-600"
                                  }`}
                              >
                                #{player.rank}
                              </div>
                              <div className="p-2 rounded-lg bg-white shadow-sm">
                                <BadgeIcon size={24} className={player.color} />
                              </div>
                              <div>
                                <div
                                  className={`font-semibold text-lg ${player.isCurrentUser
                                      ? "text-blue-800"
                                      : "text-gray-900"
                                    }`}
                                >
                                  {player.name}
                                </div>
                                <div className="text-sm text-gray-600 flex items-center space-x-1">
                                  <Users size={12} />
                                  <span>Heritage Explorer</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-indigo-600 flex items-center space-x-2">
                                <TrendingUp size={20} />
                                <span>{player.points.toLocaleString()}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                points
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Study Materials */}
          <div className="container mx-auto px-4 mb-16">
            <div className="rounded-2xl p-8 bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-2xl">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-white text-3xl font-bold mb-4 flex items-center">
                    <BookOpen className="mr-3" size={36} />
                    Study Before Your Quiz
                  </h3>
                  <p className="text-green-100 mb-6 leading-relaxed">
                    Improve your scores by exploring our heritage content before
                    taking quizzes. Learn about monuments, festivals, arts, and
                    cultural traditions.
                  </p>
                  <div className="space-y-4">
                    <div className="text-white flex items-center space-x-3">
                      <BookOpen size={20} />
                      <span>Interactive heritage guides</span>
                    </div>
                    <div className="text-white flex items-center space-x-3">
                      <Star size={20} />
                      <span>Expert-curated content</span>
                    </div>
                    <div className="text-white flex items-center space-x-3">
                      <Zap size={20} />
                      <span>Quick learning modules</span>
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-6">
                    <MapPin size={80} className="mx-auto text-white" />
                  </div>
                  <button
                    onClick={() => onPageChange("heritage")}
                    className="px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-lg shadow-lg flex items-center space-x-2 mx-auto bg-white text-green-600"
                  >
                    <span>Explore Heritage Content</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedQuiz && (
        <Quiz
          isSignedIn={isSignedIn}
          quizData={quizQuestionsData[selectedQuiz.id]}
          category={selectedQuiz}
          onComplete={handleQuizComplete}
          onGoBack={handleGoBackToCategories}
          selectedQuiz={selectedQuiz}
          checkAchievements={checkAchievements}
        />
      )}
    </>
  );
};

export default QuizPage;
