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
      text: "Namaste! Welcome to BharatSafar AI Guide! I'm here to help you discover India's incredible cultural heritage. Ask me about monuments, festivals, traditions, history, or anything related to Indian culture!",
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
    const API_KEY =
      import.meta.env.VITE_GEMINI_API_KEY ||
      import.meta.env.VITE_GEMINI_TRAVEL_API_KEY;

    const prompt = `You are BharatSafar AI Guide, an expert on Indian culture, heritage, monuments, festivals, arts, history, and traditions. 

User question: ${message}

Please provide a comprehensive, accurate, and engaging response about Indian heritage. Include specific details, historical context, and cultural significance when relevant. Keep the response informative yet conversational, and feel free to suggest related topics the user might find interesting.

If the question is not related to Indian heritage, politely redirect the conversation back to Indian cultural topics.`;

    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
    ];

    for (const model of candidateModels) {
      try {
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`;
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
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
          }
        }
      } catch (err) {
        console.warn(`Model ${model} request failed:`, err);
      }
    }

    throw new Error("Gemini API request failed across all models");
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
    <div className="min-h-screen bg-ivory">
      {/* Hero Header */}
      <div className="relative h-[500px] w-full flex items-center justify-start overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://res.cloudinary.com/bharatverse/video/upload/v1766498836/zqbrec6oay46vvkmtfxq.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="relative z-10 flex flex-col items-start justify-center pl-8 md:pl-16">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bs-label text-gold-light tracking-widest"
            >
              AI Heritage Guide
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-5xl md:text-7xl font-display font-bold tracking-tight text-white"
              style={{ textShadow: "0 4px 24px rgba(0,0,0,0.5)" }}
            >
              Namaste
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed"
            >
              Your AI-powered gateway to India's timeless heritage, culture, and
              traditions
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Quick Questions */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="mr-2" size={22} style={{ color: "var(--bs-gold)" }} />
            <h2 className="text-xl font-display font-semibold" style={{ color: "var(--bs-charcoal)" }}>
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
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ delay: index * 0.08 }}
                  onClick={() => handleQuickQuestion(question.text)}
                  className="relative group p-5 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300 text-left"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(250,247,242,0.97))",
                    borderColor: "rgba(212,199,175,0.3)",
                  }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(90deg, var(--bs-gold), var(--bs-terracotta), var(--bs-gold-dark))" }}
                  />
                  <div className="flex items-start space-x-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform"
                      style={{ background: "linear-gradient(135deg, var(--bs-gold-light), var(--bs-gold-dark))" }}
                    >
                      <IconComponent className="text-white" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-base mb-1 transition-colors" style={{ color: "var(--bs-charcoal)" }}>
                        {question.text}
                      </p>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{ background: "var(--bs-cream)", color: "var(--bs-charcoal-soft)" }}
                      >
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
        <div
          className="max-w-4xl mx-auto rounded-2xl flex flex-col relative overflow-hidden shadow-xl"
          style={{
            height: "650px",
            background: "var(--bs-white)",
            border: "1px solid rgba(212,199,175,0.3)",
          }}
        >
          {/* Chat Header Bar */}
          <div
            className="px-6 py-4 flex items-center space-x-3 border-b"
            style={{
              background: "linear-gradient(135deg, var(--bs-charcoal), var(--bs-charcoal-mid))",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--bs-gold-light), var(--bs-gold))" }}
            >
              <Bot size={20} style={{ color: "var(--bs-charcoal)" }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">BharatSafar AI Guide</h3>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>Powered by Gemini</p>
            </div>
            <div className="flex-1" />
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className="p-2 rounded-full transition-colors"
              style={{
                background: voiceEnabled ? "rgba(201,168,76,0.2)" : "rgba(255,255,255,0.1)",
                color: voiceEnabled ? "var(--bs-gold-light)" : "rgba(255,255,255,0.5)",
              }}
              title={voiceEnabled ? "Disable voice output" : "Enable voice output"}
            >
              {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * 800,
                  y: Math.random() * 700,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 800,
                  y: Math.random() * 700,
                  opacity: [0, 0.4, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  background: "var(--bs-gold)",
                  boxShadow: `0 0 ${Math.random() * 8 + 4}px rgba(201, 168, 76, 0.4)`,
                }}
              />
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 relative z-10">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end gap-3 max-w-[80%] ${
                      message.sender === "user"
                        ? "flex-row-reverse"
                        : "flex-row"
                    }`}
                  >
                    {/* Avatar */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                      style={{
                        background: message.sender === "user"
                          ? "linear-gradient(135deg, var(--bs-terracotta), var(--bs-gold-dark))"
                          : "linear-gradient(135deg, var(--bs-gold-light), var(--bs-gold))",
                      }}
                    >
                      {message.sender === "user" ? (
                        <User size={16} className="text-white" />
                      ) : (
                        <Bot size={16} style={{ color: "var(--bs-charcoal)" }} />
                      )}
                    </motion.div>

                    {/* Message Bubble */}
                    <div className={`chat-bubble ${message.sender}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text}
                      </p>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center space-x-1.5">
                            <Sparkles size={12} style={{ color: "var(--bs-gold)" }} />
                            <p className="text-xs" style={{ color: "var(--bs-charcoal-soft)" }}>
                              You might also ask:
                            </p>
                          </div>
                          {message.suggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuickQuestion(suggestion)}
                              className="block w-full text-left text-xs px-3 py-1.5 rounded-lg transition-colors"
                              style={{
                                background: "var(--bs-cream)",
                                color: "var(--bs-charcoal-soft)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = "var(--bs-cream-dark)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = "var(--bs-cream)";
                              }}
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}

                      <p className="text-xs opacity-50 mt-2">
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
                <div className="flex items-end gap-3">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{ background: "linear-gradient(135deg, var(--bs-gold-light), var(--bs-gold))" }}
                  >
                    <Bot size={16} style={{ color: "var(--bs-charcoal)" }} />
                  </div>
                  <div
                    className="rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm"
                    style={{ background: "var(--bs-white)", border: "1px solid #E2D5BF" }}
                  >
                    <div className="flex items-center space-x-2">
                      <Loader
                        className="animate-spin"
                        size={15}
                        style={{ color: "var(--bs-gold)" }}
                      />
                      <span className="text-sm" style={{ color: "var(--bs-charcoal-soft)" }}>
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-5 border-t" style={{ borderColor: "rgba(212,199,175,0.3)", background: "var(--bs-ivory)" }}>
            {/* Conversation Starters */}
            {messages.length === 1 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle size={14} style={{ color: "var(--bs-gold)" }} />
                  <p className="text-xs" style={{ color: "var(--bs-charcoal-soft)" }}>Try starting with:</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {conversationStarters.map((starter, index) => (
                    <button
                      key={index}
                      onClick={() => setInputMessage(starter)}
                      className="text-xs px-3 py-1 rounded-full transition-all hover:shadow-sm"
                      style={{
                        background: "var(--bs-cream)",
                        color: "var(--bs-charcoal-soft)",
                        border: "1px solid rgba(212,199,175,0.3)",
                      }}
                    >
                      {starter}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Voice Input Button */}
              <button
                onClick={isListening ? stopVoiceInput : startVoiceInput}
                disabled={isLoading}
                className="p-3 rounded-full transition-all disabled:opacity-50"
                style={{
                  background: isListening ? "#dc2626" : "var(--bs-cream)",
                  color: isListening ? "white" : "var(--bs-charcoal-soft)",
                }}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about Indian heritage, monuments, festivals..."
                  className="w-full resize-none px-4 py-3 pr-14 rounded-xl outline-none text-sm"
                  rows="1"
                  style={{
                    height: "auto",
                    minHeight: "48px",
                    maxHeight: "128px",
                    background: "var(--bs-white)",
                    border: "1.5px solid rgba(212,199,175,0.4)",
                    color: "var(--bs-charcoal)",
                    fontFamily: "var(--font-body)",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--bs-gold)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(201,168,76,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(212,199,175,0.4)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <div className="absolute bottom-2 right-3 text-xs" style={{ color: "rgba(74,67,64,0.4)" }}>
                  {inputMessage.length}/1000
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--bs-gold-light), var(--bs-gold))",
                  color: "var(--bs-charcoal)",
                }}
                title="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs" style={{ color: "var(--bs-charcoal-soft)" }}>
              <div className="flex items-center space-x-4">
                {isListening && (
                  <span className="text-red-500 animate-pulse flex items-center">
                    <Mic className="mr-1" size={12} />
                    Listening...
                  </span>
                )}
                {isSpeaking && (
                  <span className="animate-pulse flex items-center" style={{ color: "var(--bs-gold)" }}>
                    <Volume2 className="mr-1" size={12} />
                    Speaking...
                  </span>
                )}
              </div>
              <div style={{ opacity: 0.5 }}>Press Enter to send • Voice input available</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 bs-text-gradient">
              Why Choose BharatSafar AI?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "var(--bs-charcoal-soft)" }}>
              Experience India's heritage like never before with our intelligent guide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Lightbulb,
                title: "Smart Suggestions",
                desc: "Get personalized follow-up questions and topic suggestions based on your interests",
                gradient: "linear-gradient(135deg, var(--bs-gold-light), var(--bs-gold-dark))",
              },
              {
                icon: MapPin,
                title: "Location Aware",
                desc: "Discover heritage sites near you with real-time location-based recommendations",
                gradient: "linear-gradient(135deg, var(--bs-terracotta), var(--bs-gold-dark))",
              },
              {
                icon: Book,
                title: "Expert Knowledge",
                desc: "Trained on authentic heritage content and verified expert sources from across India",
                gradient: "linear-gradient(135deg, var(--bs-gold), var(--bs-terracotta))",
              },
            ].map((card, index) => {
              const CardIcon = card.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -10, boxShadow: "0 20px 50px rgba(28,25,23,0.12)" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group p-8 rounded-2xl overflow-hidden text-center"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.97), rgba(250,247,242,0.97))",
                    border: "1px solid rgba(212,199,175,0.3)",
                    boxShadow: "0 4px 20px rgba(28,25,23,0.06)",
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: "linear-gradient(90deg, var(--bs-gold), var(--bs-terracotta), var(--bs-gold-dark))" }}
                  />
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg"
                    style={{ background: card.gradient }}
                  >
                    <CardIcon className="text-white" size={28} />
                  </motion.div>
                  <h3 className="text-xl font-display font-bold mb-3" style={{ color: "var(--bs-charcoal)" }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--bs-charcoal-soft)" }}>
                    {card.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
