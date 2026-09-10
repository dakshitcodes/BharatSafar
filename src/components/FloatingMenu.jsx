import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, X, ChevronRight, Sparkles } from "lucide-react";

const FloatingMenu = ({ onPageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredOption, setHoveredOption] = useState(null);

  const menuOptions = [
    {
      name: "Rituals",
      icon: "🙏",
      description: "Indian Customs & Rituals",
      page: "riti-riwaj",
      color: "from-purple-500 via-pink-500 to-red-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      borderColor: "border-purple-200",
      shadowColor: "shadow-purple-500/20",
    },
    {
      name: "Storytelling",
      icon: "📖",
      description: "Cultural Stories & Legends",
      page: "storytelling",
      color: "from-blue-500 via-cyan-500 to-teal-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50",
      borderColor: "border-blue-200",
      shadowColor: "shadow-blue-500/20",
    },
  ];

  const handleMenuClick = (page) => {
    onPageChange(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Background Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className="relative w-16 h-16 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group z-50"
        aria-label="Open Menu"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0, scale: 0.8 }}
              animate={{ rotate: 90, scale: 1 }}
              exit={{ rotate: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <X className="text-white" size={28} strokeWidth={2.5} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: -90, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              exit={{ rotate: -90, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <Book className="text-white" size={28} strokeWidth={2} />
              {/* Notification Dot */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pulse Ring */}
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border-2 border-amber-300 opacity-50"
        />

        {/* Tooltip */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileHover={{ opacity: 1, x: -80 }}
            transition={{ duration: 0.3 }}
            className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap pointer-events-none"
          >
            Explore Culture
          </motion.div>
        )}
      </motion.button>

      {/* Popup Menu - Enhanced */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-24 left-6 bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-100 w-80 z-50 backdrop-blur-sm"
          >
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 p-6 relative overflow-hidden">
              {/* Animated Background Pattern */}
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 opacity-10"
              >
                <Sparkles size={100} className="absolute top-2 right-2" />
              </motion.div>

              <div className="relative z-10">
                <h3 className="text-white font-bold text-2xl mb-1 flex items-center gap-2">
                  <span className="text-3xl">🌏</span>
                  Explore Culture
                </h3>
                <p className="text-white/80 text-sm">
                  Discover India's Sacred Traditions
                </p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {menuOptions.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleMenuClick(option.page)}
                  onMouseEnter={() => setHoveredOption(idx)}
                  onMouseLeave={() => setHoveredOption(null)}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full bg-gradient-to-r ${option.color} text-white rounded-2xl p-4 text-left transition-all duration-300 hover:shadow-xl relative overflow-hidden group`}
                >
                  {/* Background Shimmer Effect */}
                  <motion.div
                    animate={{
                      x: hoveredOption === idx ? 300 : -300,
                    }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 bg-white/10"
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <motion.span
                        animate={{
                          scale: hoveredOption === idx ? 1.3 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl"
                      >
                        {option.icon}
                      </motion.span>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg leading-tight">
                          {option.name}
                        </h4>
                        <p className="text-xs text-white/80 mt-1 line-clamp-1">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <motion.div
                      animate={{
                        x: hoveredOption === idx ? 8 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronRight
                        size={24}
                        className="text-white/90"
                        strokeWidth={2.5}
                      />
                    </motion.div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

            {/* Footer with Stats
            <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-purple-50 rounded-xl p-3 text-center border border-purple-200"
                >
                  <p className="text-2xl font-bold text-purple-600">29</p>
                  <p className="text-xs text-gray-600">States</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-blue-50 rounded-xl p-3 text-center border border-blue-200"
                >
                  <p className="text-2xl font-bold text-blue-600">100+</p>
                  <p className="text-xs text-gray-600">Rituals</p>
                </motion.div>
              </div>

              <motion.button
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full text-sm text-gray-600 hover:text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Close Menu
              </motion.button>
            </div> */}

            {/* Decorative Corner Element */}
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingMenu;
