import React, { useState, useEffect, useRef } from "react";
import { Send, Mic, Bot, User, Loader, X, Hand } from "lucide-react";
import { toast } from "react-hot-toast";

const ChatBot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Namaste! Welcome to BharatVerse! I'm your AI heritage guide. Ask me about Indian monuments, festivals, culture, or anything related to our incredible heritage!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGeminiAPI = async (message) => {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const prompt = `You are BharatVerse AI Heritage Guide, an expert on Indian culture, heritage, monuments, festivals, arts, history, and traditions. 

User question: ${message}

Please provide a comprehensive, accurate, and engaging response about Indian heritage. Keep it concise for a chat interface (2-3 sentences max). Include specific details and cultural significance when relevant.

If the question is not related to Indian heritage, politely redirect to Indian cultural topics.`;

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
          maxOutputTokens: 512,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini API request failed");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await callGeminiAPI(currentInput);

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      const fallbackResponses = [
        "That's a great question about Indian heritage! The Taj Mahal, for example, represents the pinnacle of Mughal architecture.",
        "India has such rich cultural diversity! Each state has unique traditions, festivals, and architectural marvels.",
        "Our heritage sites tell incredible stories spanning thousands of years. What specific aspect interests you most?",
        "From classical dances like Bharatanatyam to festivals like Diwali, India's cultural heritage is truly magnificent!",
      ];

      const randomResponse =
        fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: randomResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMessage]);
      toast.error("Using offline mode - limited responses available");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Voice recognition failed");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="bg-heritage-gradient text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">BharatVerse AI Guide</h3>
              <p className="text-sm text-white/80">Your heritage companion</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : "flex-row"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.sender === "user"
                      ? "bg-saffron-500 text-white"
                      : "bg-gray-300 text-gray-600"
                    }`}
                >
                  {message.sender === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <div className={`chat-bubble ${message.sender}`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-gray-600" />
                </div>
                <div className="bg-gray-200 px-4 py-2 rounded-2xl">
                  <Loader className="animate-spin" size={16} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              onClick={startVoiceInput}
              disabled={isListening || isLoading}
              className={`p-2 rounded-lg transition-colors ${isListening
                  ? "bg-red-100 text-red-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } disabled:opacity-50`}
            >
              <Mic size={20} />
            </button>

            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about Indian heritage, monuments, festivals..."
              className="flex-1 resize-none px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none max-h-20"
              rows="1"
            />

            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-heritage p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2 text-center">
            Ask about monuments, festivals, culture, architecture, or Indian
            history
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
