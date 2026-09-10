import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RefreshCw,
  ArrowLeft,
  Target,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignIn } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { saveQuizResult } from "../services/quizService";
import { checkAndAwardBadges } from "../services/badgeService";
import { getUserQuizStats, getUserQuizHistory } from "../services/quizService";

const Quiz = ({
  isSignedIn,
  quizData,
  category,
  onComplete,
  onGoBack,
  selectedQuiz,
  checkAchievements,
}) => {
  const { user: clerkUser, isLoaded } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const questions = quizData?.questions || [];

  useEffect(() => {
    if (quizStarted && !showResult && !quizCompleted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult && quizStarted) {
      handleNextQuestion();
    }
  }, [timeLeft, quizStarted, showResult, quizCompleted]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setTimeLeft(30);
    setQuizCompleted(false);
    setStartTime(Date.now());
    setResultData(null);
    setSaveError(null);
  };

  const selectOption = (optionIndex) => {
    if (showResult) return;
    setSelectedOption(optionIndex);
  };

  const handleNextQuestion = () => {
    const currentQ = questions[currentQuestion];
    const isCorrect = selectedOption === currentQ.correct;

    if (isCorrect) {
      setScore(score + 1);
    }

    const answerData = {
      questionId: currentQ.id,
      question: currentQ.question,
      selectedOption,
      selectedAnswer:
        selectedOption !== null
          ? currentQ.options[selectedOption]
          : "No answer",
      correct: currentQ.correct,
      correctAnswer: currentQ.options[currentQ.correct],
      isCorrect,
      timeUsed: 30 - timeLeft,
    };

    setAnswers((prevAnswers) => [...prevAnswers, answerData]);
    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setShowResult(false);
        setTimeLeft(30);
      } else {
        setQuizCompleted(true);
        const totalTime = Math.floor((Date.now() - startTime) / 1000);
        const finalScore = isCorrect ? score + 1 : score;
        const percentage = Math.round((finalScore / questions.length) * 100);

        setResultData({
          score: finalScore,
          total: questions.length,
          answers: [...answers, answerData],
          category: category?.title || "Quiz",
          totalTime,
          percentage,
        });
      }
    }, 2500);
  };

  const saveQuizToDatabase = async () => {
    if (!resultData || !clerkUser || !isLoaded) {
      setSaveError("Unable to save quiz. Please try again.");
      return false;
    }

    try {
      setIsSaving(true);
      setSaveError(null);

      const userData = await getUserData(clerkUser.id);
      if (!userData) {
        setSaveError("User profile not found.");
        setIsSaving(false);
        return false;
      }

      const saveResult = await saveQuizResult(
        userData.id,
        category?.title || "Quiz",
        resultData.score,
        resultData.total,
        resultData.answers
      );

      if (!saveResult) {
        setSaveError("Failed to save quiz.");
        setIsSaving(false);
        return false;
      }

      const updatedStats = await getUserQuizStats(userData.id);
      if (updatedStats) {
        await checkAndAwardBadges(userData.id, updatedStats);
      }

      setIsSaving(false);
      return true;
    } catch (err) {
      setSaveError("Error saving quiz.");
      setIsSaving(false);
      return false;
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setTimeLeft(30);
    setQuizStarted(false);
    setAnswers([]);
    setQuizCompleted(false);
    setStartTime(null);
    setResultData(null);
    setIsSaving(false);
    setSaveError(null);
  };

  const goBack = async () => {
    if (resultData && quizCompleted) {
      await saveQuizToDatabase(); // Save results on exit
    }
    if (onComplete) onComplete(resultData);
    if (onGoBack) onGoBack();
  };

  const getScoreColor = () => {
    const percentage = resultData?.percentage || 0;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = () => {
    const percentage = resultData?.percentage || 0;
    if (percentage >= 90) return "Outstanding! You're a heritage expert! 🏆";
    if (percentage >= 80) return "Excellent knowledge of Indian heritage! 🌟";
    if (percentage >= 70) return "Great job! You know your culture well! 👏";
    if (percentage >= 60)
      return "Good effort! Keep learning about our heritage! 📚";
    return "Keep exploring and learning about Indian culture! 🚀";
  };

  const getBadgeForScore = () => {
    const percentage = resultData?.percentage || 0;
    if (percentage >= 90)
      return { name: "Heritage Master", icon: "🏆", color: "text-yellow-600" };
    if (percentage >= 80)
      return { name: "Culture Expert", icon: "🌟", color: "text-blue-600" };
    if (percentage >= 70)
      return { name: "Knowledge Seeker", icon: "📚", color: "text-green-600" };
    if (percentage >= 60)
      return { name: "Explorer", icon: "🗺️", color: "text-purple-600" };
    return { name: "Beginner", icon: "🌱", color: "text-gray-600" };
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Quiz Not Available
          </h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sorry, this quiz is currently not available. Please try another
            category.
          </p>
          <button
            onClick={goBack}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-lg flex items-center space-x-2 mx-auto hover:shadow-lg transition"
          >
            <ArrowLeft size={20} />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !isLoaded) {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{
          backgroundImage: 'url("https://res.cloudinary.com/bharatverse/image/upload/v1766498817/hpnpenprlb8qhkslxfyj.webp")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
          minHeight: "100vh",
          minWidth: "100vw",
          zIndex: 10,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.14)",
            backdropFilter: "blur(1px)",
            zIndex: 13,
          }}
        />
        <div
          className="relative z-30 flex flex-col items-center justify-center"
          style={{
            maxWidth: "352px",
            width: "100%",
          }}
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{
              boxShadow: "0 4px 24px 2px rgba(80,41,5,0.12)",
              background: "rgba(255,255,255,0.78)",
              border: "1.5px solid rgba(224,169,26,0.10)",
              backdropFilter: "blur(11px)",
              padding: "22px 13px",
            }}
          >
            <SignIn afterSignInUrl="/quiz" />
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6"
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button
              onClick={goBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Categories</span>
            </button>
          </div>

          <div className="text-center mb-12">
            <div
              className={`w-24 h-24 bg-gradient-to-r ${
                category?.color || "from-blue-500 to-purple-500"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <Trophy className="text-white" size={40} />
            </div>

            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
              {category?.title || "Heritage Quiz"}
            </h2>

            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {category?.description ||
                "Test your knowledge about Indian heritage, monuments, festivals, and culture."}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-lg mx-auto border border-gray-100">
            <h3 className="font-bold mb-6 text-xl flex items-center justify-center space-x-2">
              <Target className="text-orange-600" size={20} />
              <span>Quiz Details</span>
            </h3>
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-blue-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {questions.length}
                </div>
                <div className="text-sm text-blue-800">Questions</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  30s
                </div>
                <div className="text-sm text-orange-800">Per Question</div>
              </div>
              <div className="bg-green-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {category?.estimatedTime || "15 min"}
                </div>
                <div className="text-sm text-green-800">Duration</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {category?.difficulty || "Mixed"}
                </div>
                <div className="text-sm text-purple-800">Difficulty</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
            <h3 className="font-semibold mb-4">Instructions:</h3>
            <div className="space-y-2 text-sm text-gray-600 text-left">
              <p>⏱️ Each question has a 30-second time limit</p>
              <p>📝 Select your answer before time runs out</p>
              <p>🏆 Earn badges based on your performance</p>
              <p>📚 Learn from detailed explanations</p>
              <p>🎯 Your results will be saved to your profile</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={startQuiz}
              className="text-lg px-10 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              Start Quiz 🚀
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={goBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{category?.title}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="text-lg font-semibold text-gray-800">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-gray-500" />
              <span
                className={`font-mono text-lg font-bold ${
                  timeLeft <= 10
                    ? "text-red-600 animate-pulse"
                    : "text-gray-700"
                }`}
              >
                {timeLeft}s
              </span>
            </div>

            <div className="text-lg font-semibold text-gray-700">
              Score: {score}/{currentQuestion + (showResult ? 1 : 0)}
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mb-10">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
            className={`bg-gradient-to-r ${
              category?.color || "from-blue-500 to-purple-500"
            } h-3 rounded-full transition-all duration-500`}
          />
        </div>

        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => {
              let buttonClass =
                "w-full text-left transition-all duration-300 transform hover:scale-102 p-4 rounded-lg border-2 font-semibold ";

              if (showResult) {
                if (index === currentQ.correct) {
                  buttonClass +=
                    "bg-green-100 border-green-500 text-green-900 shadow-lg";
                } else if (
                  index === selectedOption &&
                  index !== currentQ.correct
                ) {
                  buttonClass +=
                    "bg-red-100 border-red-500 text-red-900 shadow-lg";
                } else {
                  buttonClass +=
                    "bg-gray-50 border-gray-200 text-gray-600 cursor-default";
                }
              } else if (selectedOption === index) {
                buttonClass +=
                  "bg-orange-100 border-orange-500 text-orange-900 shadow-md";
              } else {
                buttonClass +=
                  "bg-gray-50 border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-orange-50";
              }

              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => selectOption(index)}
                  className={buttonClass}
                  disabled={showResult}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0 font-bold">
                      {showResult && index === currentQ.correct && (
                        <CheckCircle className="text-green-600" size={24} />
                      )}
                      {showResult &&
                        index === selectedOption &&
                        index !== currentQ.correct && (
                          <XCircle className="text-red-600" size={24} />
                        )}
                      {!showResult && selectedOption === index && (
                        <div className="w-4 h-4 bg-orange-500 rounded-full" />
                      )}
                      {!showResult && selectedOption !== index && (
                        <span className="text-gray-500">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span className="flex-1">{option}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl"
              >
                <h4 className="font-bold text-blue-800 mb-3 flex items-center space-x-2">
                  <Award size={18} />
                  <span>Explanation</span>
                </h4>
                <p className="text-blue-700 leading-relaxed">
                  {currentQ.explanation ||
                    "No explanation provided for this question."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            disabled={selectedOption === null && !showResult}
            className="px-10 py-4 text-lg bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            {showResult
              ? currentQuestion + 1 === questions.length
                ? "View Results"
                : "Next Question"
              : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
