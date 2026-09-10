import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Mic,
  Bot,
  User,
  Loader,
  Lightbulb,
  MapPin,
  Book,
  Star,
  MicOff,
  Volume2,
  VolumeX,
  Building,
  Calendar,
  Music,
  History,
  ChefHat,
  Palette,
  Sparkles,
  MessageCircle,
  Hand,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const ChatPage = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Namaste! Welcome to BharatVerse AI Heritage Guide! I'm here to help you discover India's incredible cultural heritage. Ask me about monuments, festivals, traditions, history, or anything related to Indian culture!",
      timestamp: new Date().toISOString(),
      type: "greeting",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const quickQuestions = [
    {
      icon: Building,
      text: "Tell me about the Taj Mahal",
      category: "Monument",
    },
    {
      icon: Calendar,
      text: "What is Diwali and how is it celebrated?",
      category: "Festival",
    },
    { icon: Music, text: "Explain Bharatanatyam dance form", category: "Arts" },
    {
      icon: History,
      text: "Share the history of Mughal architecture",
      category: "History",
    },
    {
      icon: ChefHat,
      text: "What are some traditional Indian dishes?",
      category: "Cuisine",
    },
    {
      icon: Palette,
      text: "Tell me about Madhubani paintings",
      category: "Art",
    },
  ];

  const conversationStarters = [
    "What can you tell me about...",
    "I'm planning to visit...",
    "Can you explain the significance of...",
    "What's the history behind...",
    "How is... celebrated in India?",
    "What are some hidden gems in...",
  ];

  // Initialize speech recognition
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-IN"; // Indian English

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        toast.success("Voice input captured!");
      };

      recognitionRef.current.onerror = (event) => {
        setIsListening(false);
        toast.error("Voice recognition failed: " + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const sendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call Google Gemini API
      const response = await callGeminiAPI(messageText);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: response,
        timestamp: new Date().toISOString(),
        suggestions: getBotSuggestions(messageText, response),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Speak the response if voice is enabled
      if (voiceEnabled && "speechSynthesis" in window) {
        speakText(response);
      }
    } catch (error) {
      console.error("Chat error:", error);

      const botResponse = generateFallbackResponse(messageText);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: botResponse,
        timestamp: new Date().toISOString(),
        type: "fallback",
      };

      setMessages((prev) => [...prev, botMessage]);
      toast.error("Using offline mode - limited responses");
    } finally {
      setIsLoading(false);
    }
  };

  const callGeminiAPI = async (message) => {
    console.log(import.meta.env.VITE_GEMINI_API_KEY);
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

    const prompt = `You are BharatVerse AI Heritage Guide, an expert on Indian culture, heritage, monuments, festivals, arts, history, and traditions. 

User question: ${message}

Please provide a comprehensive, accurate, and engaging response about Indian heritage. Include specific details, historical context, and cultural significance when relevant. Keep the response informative yet conversational, and feel free to suggest related topics the user might find interesting.

If the question is not related to Indian heritage, politely redirect the conversation back to Indian cultural topics.`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const generateFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("taj mahal")) {
      return "The Taj Mahal is one of the most beautiful monuments in the world! Built by Shah Jahan in memory of his beloved wife Mumtaz Mahal between 1632-1653, this ivory-white marble mausoleum is located in Agra, Uttar Pradesh. It's a UNESCO World Heritage Site and represents the finest example of Mughal architecture, combining Indian, Islamic, and Persian architectural styles.";
    }

    if (
      lowerMessage.includes("diwali") ||
      lowerMessage.includes("festival of lights")
    ) {
      return "Diwali, the Festival of Lights, is one of the most celebrated festivals in India! It celebrates the victory of light over darkness and good over evil. The festival lasts for 5 days and includes lighting oil lamps (diyas), decorating homes with rangoli, bursting firecrackers, exchanging sweets, and worshipping Goddess Lakshmi for prosperity.";
    }

    if (
      lowerMessage.includes("bharatanatyam") ||
      lowerMessage.includes("dance")
    ) {
      return "Bharatanatyam is one of India's oldest and most revered classical dance forms! Originating from Tamil Nadu temples over 2000 years ago, it combines storytelling through intricate hand gestures (mudras), facial expressions (abhinaya), and rhythmic footwork (adavus). It's considered a spiritual practice that connects the dancer with the divine.";
    }

    if (lowerMessage.includes("food") || lowerMessage.includes("cuisine")) {
      return "Indian cuisine is incredibly diverse and flavorful! Each region has its unique dishes - from spicy curries in the south to rich gravies in the north, from street food like chaat to elaborate thalis. Popular dishes include biryani, butter chicken, dosa, samosa, and countless vegetarian options. Indian food is known for its use of aromatic spices like turmeric, cumin, and cardamom.";
    }

    if (
      lowerMessage.includes("hello") ||
      lowerMessage.includes("hi") ||
      lowerMessage.includes("namaste")
    ) {
      return "Namaste! Welcome to your personal Indian Heritage guide! I'm here to help you explore India's incredible cultural diversity. You can ask me about monuments, festivals, art forms, history, cuisine, traditions, or any specific place you'd like to visit. What interests you most about Indian heritage?";
    }

    const genericResponses = [
      `That's a fascinating topic about Indian heritage! ${message} touches on the rich cultural tapestry of India. While I'd love to provide more detailed information, I can share that India's heritage spans thousands of years with diverse traditions, magnificent architecture, and vibrant festivals.`,
      `Thank you for asking about "${message}"! India's cultural heritage is incredibly vast and diverse. Each region has unique traditions, art forms, and historical significance. Would you like to know about any specific monument, festival, or cultural practice?`,
      `I appreciate your interest in "${message}"! Indian heritage encompasses ancient civilizations, magnificent monuments, classical arts, vibrant festivals, and diverse traditions. Is there a particular aspect of Indian culture you'd like to explore further?`,
    ];

    return genericResponses[
      Math.floor(Math.random() * genericResponses.length)
    ];
  };

  const getBotSuggestions = (userMessage, botResponse) => {
    const suggestions = [];

    if (userMessage.toLowerCase().includes("taj mahal")) {
      suggestions.push(
        "Tell me about other Mughal monuments",
        "How to visit Taj Mahal?",
        "Similar monuments in India"
      );
    } else if (userMessage.toLowerCase().includes("diwali")) {
      suggestions.push(
        "Other Indian festivals",
        "How to celebrate Diwali?",
        "Regional Diwali traditions"
      );
    } else if (userMessage.toLowerCase().includes("dance")) {
      suggestions.push(
        "Other classical dances",
        "Where to learn Bharatanatyam?",
        "Indian folk dances"
      );
    }

    return suggestions.slice(0, 3);
  };

  const startVoiceInput = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
      toast.success("Listening... Speak now!");
    }
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    sendMessage(question);
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="relative h-[600px] w-full flex items-start justify-start overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/bharatverse/video/upload/v1766498836/zqbrec6oay46vvkmtfxq.mp4"
        />
        <div className="relative z-10 flex flex-col items-start justify-start pl-8 md:pl-16 pt-12">
          <div className="bg-black/40 rounded-2xl px-8 py-8 shadow-2xl backdrop-blur-md space-y-4 w-fit max-w-3xl text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-6xl md:text-7xl font-heritage font-extrabold tracking-wider bg-gradient-to-r from-orange-400 via-yellow-300 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] mb-2 select-none"
            >
              Namaste
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="text-2xl md:text-3xl font-light text-white/90 max-w-xl drop-shadow-lg tracking-tight"
            >
              Your AI-powered gateway to India's timeless heritage, culture, and
              traditions
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Questions */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <Lightbulb className="mr-2 text-saffron-600" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">
              Quick Questions to Get Started
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickQuestions.map((question, index) => {
              const IconComponent = question.icon;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleQuickQuestion(question.text)}
                  className="relative group p-6 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-xl hover:shadow-2xl hover:border-orange-300 transition-all duration-300 overflow-hidden"
                >
                  {/* Animated gradient border */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>

                  <div className="relative z-10 flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                      <IconComponent className="text-white" size={26} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors mb-1">
                        {question.text}
                      </p>
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {question.category}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Chat Container */}
        <div className="heritage-card max-w-4xl mx-auto h-[600px] flex flex-col relative overflow-hidden">
          {/* OM SYMBOL WATERMARK - VISIBLE VERSION */}

          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 1200,
                  y: Math.random() * 1600,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 1200,
                  y: Math.random() * 1600,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-orange-400 via-pink-400 to-red-400"
                style={{
                  boxShadow: `0 0 ${
                    Math.random() * 10 + 5
                  }px rgba(255, 152, 0, 0.6)`,
                  filter: "blur(0.5px)",
                }}
              />
            ))}
          </div>

          {/* Messages Container - FIXED */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-20">
            {/* SVG PATTERN - NOW VISIBLE */}
            <div className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
              <svg
                className="w-full h-full"
                viewBox="0 0 1200 1600"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="archPattern"
                    x="0"
                    y="0"
                    width="250"
                    height="250"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M30,100 Q125,30 220,100"
                      stroke="#FF9800"
                      fill="none"
                      strokeWidth="2"
                    />
                    <line
                      x1="50"
                      y1="100"
                      x2="50"
                      y2="220"
                      stroke="#FF9800"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="125"
                      y1="100"
                      x2="125"
                      y2="220"
                      stroke="#FF9800"
                      strokeWidth="1.5"
                    />
                    <line
                      x1="200"
                      y1="100"
                      x2="200"
                      y2="220"
                      stroke="#FF9800"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="125"
                      cy="60"
                      r="8"
                      fill="none"
                      stroke="#FF9800"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="1200" height="1600" fill="url(#archPattern)" />
              </svg>
            </div>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex  ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  } relative z-30`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : "flex-row"
                    }`}
                  >
                    <div
                      className={`px-6 py-4 max-w-md rounded-3xl shadow-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-saffron-500 to-orange-500 text-white rounded-tr-none"
                          : "bg-white/90 backdrop-blur-md text-gray-800 border border-gray-200 rounded-tl-none"
                      }`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ rotate: 360 }}
                        transition={{ type: "spring" }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                          message.sender === "user"
                            ? "bg-gradient-to-br from-orange-500 to-pink-500"
                            : "bg-gradient-to-br from-blue-500 to-purple-600"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User size={20} className="text-white" />
                        ) : (
                          <Bot size={20} className="text-white" />
                        )}
                      </motion.div>
                    </div>

                    <div className={`chat-bubble ${message.sender}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>

                      {/* Suggestions */}
                      {message.suggestions && (
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="text-saffron-500" size={14} />
                            <p className="text-xs text-gray-500">
                              You might also ask:
                            </p>
                          </div>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickQuestion(suggestion)}
                              className="block w-full text-left text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-xs opacity-60 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="bg-white rounded-2xl px-4 py-3 shadow-md">
                    <div className="flex items-center space-x-2">
                      <Loader
                        className="animate-spin text-indigo-500"
                        size={16}
                      />
                      <span className="text-sm text-gray-600">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            {/* Conversation Starters */}
            {messages.length === 1 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="text-saffron-500" size={16} />
                  <p className="text-sm text-gray-600">Try starting with:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(starter)}
                      className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              {/* Voice Input Button */}
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                disabled={isLoading}
                className={`p-3 rounded-full transition-colors ${
                  isListening
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } disabled:opacity-50`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about Indian heritage, monuments, festivals, arts, or traditions..."
                  className="w-full resize-none px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none max-h-32"
                  rows="1"
                  style={{
                    height: "auto",
                    minHeight: "48px",
                    maxHeight: "128px",
                  }}
                />

                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                  {inputMessage.length}/1000
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="btn-heritage p-3 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send message"
              >
                <Send size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                {isListening && (
                  <span className="text-red-500 animate-pulse flex items-center">
                    <Mic className="mr-1" size={14} />
                    Listening...
                  </span>
                )}
                {isSpeaking && (
                  <span className="text-blue-500 animate-pulse flex items-center">
                    <Volume2 className="mr-1" size={14} />
                    Speaking...
                  </span>
                )}
              </div>

              <div>Press Enter to send • Voice input available</div>
            </div>
          </div>
        </div>

        {/* Features Section - PREMIUM VERSION */}
        <div className="mt-16 mb-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-heritage font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 bg-clip-text text-transparent">
              Why Choose BharatVerse AI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience India's heritage like never before with our intelligent
              guide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Card 1 - Smart Suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -15,
                boxShadow: "0 30px 60px rgba(59, 130, 246, 0.2)",
              }}
              transition={{ duration: 0.5 }}
              className="relative group p-8 rounded-3xl bg-white/80 backdrop-blur-md border-2 border-blue-100 shadow-xl hover:border-blue-300 overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon with animation */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <Lightbulb className="text-white" size={32} />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  Smart Suggestions
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Get personalized follow-up questions and topic suggestions
                  based on your interests
                </p>

                {/* Arrow icon that animates on hover */}
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center space-x-2 text-blue-600 font-semibold"
                ></motion.div>
              </div>
            </motion.div>

            {/* Card 2 - Location Aware */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -15,
                boxShadow: "0 30px 60px rgba(34, 197, 94, 0.2)",
              }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative group p-8 rounded-3xl bg-white/80 backdrop-blur-md border-2 border-green-100 shadow-xl hover:border-green-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <MapPin className="text-white" size={32} />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  Location Aware
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Discover heritage sites near you with real-time location-based
                  recommendations
                </p>

                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center space-x-2 text-green-600 font-semibold"
                ></motion.div>
              </div>
            </motion.div>

            {/* Card 3 - Expert Knowledge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -15,
                boxShadow: "0 30px 60px rgba(147, 51, 234, 0.2)",
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative group p-8 rounded-3xl bg-white/80 backdrop-blur-md border-2 border-purple-100 shadow-xl hover:border-purple-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <Book className="text-white" size={32} />
                </motion.div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                  Expert Knowledge
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Trained on authentic heritage content and verified expert
                  sources from across India
                </p>

                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center space-x-2 text-purple-600 font-semibold"
                ></motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
