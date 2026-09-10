import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Client } from "@gradio/client";

// --- Imports ---
// Video moved to public/storytelling_bg.mp4 to avoid bundle size issues
// --- Image Helper ---
const getStoryImage = (id) => {
  const baseUrl =
    "https://huggingface.co/spaces/bharatverse11/story_audio_backend/resolve/main/Storytelling";
  const extensionMap = {
    1: "webp",
    2: "webp",
    14: "webp",
    21: "webp",
    23: "webp",
    26: "webp",
    30: "webp",
    31: "webp",
    37: "webp",
    40: "webp",
    41: "webp",
    45: "webp",
    47: "webp",
    49: "webp",
    50: "webp",
    52: "webp",
    53: "webp",
    104: "webp",
    105: "webp",
    106: "webp",
    18: "png",
    22: "png",
    103: "png",
    107: "png",
    108: "png",
    33: "avif",
    48: "avif",
    36: "jpeg",
  };
  // Default to jpg for 7, 9, 11, 16, 20, 24, 25, 32, 34, 35, 38, 39, 42, 43, 44, 46, 51, 54, 55, 101, 102
  const ext = extensionMap[id] || "jpg";
  return `${baseUrl}/${id}.${ext}`;
};

// --- Custom Audio Player Component ---
const CustomAudioPlayer = ({ src, onPlayStateChange, onReplay }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(0);

  // Notify parent of progress changes for sync
  useEffect(() => {
    if (onPlayStateChange && audioRef.current) {
      onPlayStateChange({
        isPlaying,
        currentTime: audioRef.current.currentTime || 0,
        duration: audioRef.current.duration || 0,
      });
    }
  }, [isPlaying, progress, onPlayStateChange]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setDuration(total);
      if (total > 0) {
        setProgress((current / total) * 100);
        // Direct callback optimization
        if (onPlayStateChange) {
          onPlayStateChange({
            isPlaying,
            currentTime: current,
            duration: total,
          });
        }
      }
    }
  };

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-indigo-500/20 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-5 w-full max-w-xl mx-auto mt-6 relative overflow-hidden group/player">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-50 text-indigo-500 text-xs"></div>

      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setIsPlaying(true);
          if (
            audioRef.current &&
            audioRef.current.currentTime < 1 &&
            onReplay
          ) {
            onReplay();
          }
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        autoPlay
      />

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 border-2 border-amber-200/50 relative z-10 hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] outline-none focus:outline-none focus:ring-0"
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="ml-1"
          >
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        )}
      </button>

      {/* Progress & Visualizer Area */}
      <div className="flex-grow flex flex-col gap-2 min-w-0 relative z-10">
        <div className="flex justify-between text-[9px] text-indigo-300/80 font-bold tracking-[0.2em] uppercase font-cinzel">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse"></span>{" "}
            Audio Narration
          </span>
          <span>{isPlaying ? "Translating..." : "Paused"}</span>
        </div>

        <div
          className="h-10 bg-black/40 rounded-lg relative overflow-hidden cursor-pointer group/progress border border-white/10 shadow-inner"
          onClick={(e) => {
            if (audioRef.current) {
              const seekTime =
                (e.nativeEvent.offsetX / e.target.offsetWidth) *
                audioRef.current.duration;
              audioRef.current.currentTime = seekTime;
            }
          }}
        >
          {/* Visualizer Dots Background */}
          <div className="absolute inset-0 flex items-center gap-[2px] px-2 opacity-40">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className={`w-0.5 rounded-full bg-cyan-400/50 transition-all duration-300 ${
                  isPlaying ? "animate-music-bar" : "h-1"
                }`}
                style={{
                  animationDelay: `${i * 0.05}s`,
                  height: isPlaying ? "20%" : "10%",
                }}
              ></div>
            ))}
          </div>

          {/* Active Progress Bar */}
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-600/50 to-amber-500/50 backdrop-blur-sm border-r border-amber-400 transition-all duration-100 ease-linear flex items-center overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full -skew-x-12 animate-shine opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Speed Control */}
      <button
        onClick={() => {
          const speeds = [1, 1.25, 1.5, 2];
          const nextSpeedIndex = (speeds.indexOf(speed) + 1) % speeds.length;
          const nextSpeed = speeds[nextSpeedIndex];
          setSpeed(nextSpeed);
          if (audioRef.current) {
            audioRef.current.playbackRate = nextSpeed;
          }
        }}
        className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cyan-300 text-xs font-bold transition-all flex items-center justify-center flex-shrink-0 hover:border-cyan-400/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
        title="Playback Speed"
      >
        {speed}x
      </button>
    </div>
  );
};

// --- Improved Story Card Component ---
const StoryCard = ({ prompt, onGenerate, index }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const languages = [
    "English",
    "Hindi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Punjabi",
  ];

  return (
    <motion.div
      layoutId={`card-${prompt.id}`}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        type: "spring",
        stiffness: 60,
        damping: 15,
      }}
      whileHover={{ y: -15, scale: 1.02 }}
      className="group relative bg-[#0f0f18] rounded-[2rem] overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.8)] flex flex-col h-full border-[3px] border-amber-500 transition-all duration-500 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)]"
    >
      {/* Inner Glow Border (Subtle depth) */}
      <div className="absolute inset-0 rounded-[calc(2rem-3px)] border border-white/5 pointer-events-none z-20"></div>

      {/* Image Section */}
      <div
        className="h-64 overflow-hidden relative cursor-pointer"
        onClick={() => onGenerate(prompt, selectedLanguage)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-transparent z-10" />

        {/* Image Glow Effect */}
        <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500 z-10 pointer-events-none mix-blend-overlay"></div>

        <motion.img
          src={prompt.image}
          alt={prompt.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 opacity-100 group-hover:brightness-110"
          loading="lazy"
        />

        {/* Pulsating Image Border Glow */}
        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] group-hover:shadow-[inset_0_0_30px_rgba(245,158,11,0.3)] transition-all duration-500 z-10"></div>

        {/* Category Badge - Matches Reference Position */}
        <div className="absolute top-4 right-4 z-30">
          <span className="bg-black/60 backdrop-blur-md border border-amber-500 text-amber-500 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl">
            {prompt.category}
          </span>
        </div>

        {/* Play Icon - Matches Reference Center */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/90 text-[#0f0f18] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.6)] transform cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-amber-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ml-1"
            >
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 pt-2 flex-grow flex flex-col justify-between relative z-10 bg-[#0f0f18]">
        <div className="mb-4">
          <h3
            className="text-2xl font-black text-amber-100 mb-3 leading-tight font-serif group-hover:text-amber-400 transition-colors drop-shadow-md"
            style={{ fontFamily: "'Cinzel', serif" }}
            title={prompt.title}
          >
            {prompt.title}
          </h3>

          <p className="text-sm text-indigo-200/60 line-clamp-3 font-light leading-relaxed">
            {prompt.description}
          </p>
        </div>

        {/* Decorative Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-500/30 to-transparent mb-5"></div>

        {/* Controls - Bottom Dropdown matching Reference */}
        <div className="relative w-full group/select">
          <div className="absolute inset-0 bg-amber-500/5 rounded-lg -z-10"></div>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full appearance-none bg-transparent text-xs text-white/90 border border-amber-500/40 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 transition-all cursor-pointer hover:bg-white/5 uppercase tracking-widest font-bold"
          >
            {languages.map((lang) => (
              <option
                key={lang}
                value={lang}
                className="bg-[#0f0f18] text-amber-100"
              >
                {lang}
              </option>
            ))}
          </select>
          <svg
            className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none transition-transform group-hover/select:rotate-180"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---
const StoryTellingPage = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [story, setStory] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Typing Effect State
  const [typedLength, setTypedLength] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const textContainerRef = useRef(null);

  // EXPANDED DATASET (Updated with Folklore, Ancient AI, Mythology)
  const storyPrompts = [
    // --- Ancient Tech & Sci-Fi Mythology (New Category) ---
    {
      id: 101,
      title: "Vimanas: Ancient Flying Cities",
      image: getStoryImage(101),
      description:
        "Lost technology of aerial palaces mentioned in the Ramayana.",
      category: "Ancient Tech",
    },
    {
      id: 102,
      title: "The Astras: Celestial Weapons",
      image: getStoryImage(102),
      description:
        "Devine weapons triggered by mantras with nuclear-like power.",
      category: "Ancient Tech",
    },
    {
      id: 103,
      title: "Sushruta: The First Plastic Surgeon",
      image: getStoryImage(103),
      description: "Advanced medical science from 600 BCE India.",
      category: "Science",
    },
    {
      id: 104,
      title: "Maya Danava's Illusions",
      image: getStoryImage(104),
      description: "The architect of the Asuras and his holographic palaces.",
      category: "Folklore",
    },

    // --- Folklore & Mysticism ---
    {
      id: 105,
      title: "Yakshis: Guardians of Treasure",
      image: getStoryImage(105),
      description:
        "Mystical beings protecting hidden wealth in ancient forests.",
      category: "Folklore",
    },
    {
      id: 106,
      title: "The Curse of Ashwatthama",
      image: getStoryImage(106),
      description: "The immortal warrior wandering the earth for eternity.",
      category: "Mythology",
    },
    {
      id: 107,
      title: "Nagvansh: The Serpent Dynasty",
      image: getStoryImage(107),
      description: "Legends of the shapeshifting snake people.",
      category: "Folklore",
    },
    {
      id: 108,
      title: "Vikram and Betaal",
      image: getStoryImage(108),
      description: "Witty riddles between a wise king and a celestial spirit.",
      category: "Folklore",
    },

    // --- Core Mythology & Heritage ---
    {
      id: 1,
      title: "The Lost Kingdom of Hampi",
      image: getStoryImage(1),
      description: "Discover the secrets of the Vijayanagara Empire.",
      category: "History",
    },
    {
      id: 2,
      title: "Mysteries of Konark Sun Temple",
      image: getStoryImage(2),
      description: "A journey through time and celestial architecture.",
      category: "Heritage",
    },
    {
      id: 7,
      title: "Ramayana: The Coronation",
      image: getStoryImage(7),
      description: "The triumphant return of Lord Rama to Ayodhya.",
      category: "Mythology",
    },
    {
      id: 9,
      title: "Shivaji Maharaj: The Tiger",
      image: getStoryImage(9),
      description: "The heroic tales of the founder of the Maratha Empire.",
      category: "Valor",
    },
    {
      id: 11,
      title: "Samudra Manthan",
      image: getStoryImage(11),
      description: "The churning of the cosmic ocean for nectar.",
      category: "Mythology",
    },
    {
      id: 14,
      title: "Ajanta & Ellora Caves",
      image: getStoryImage(14),
      description: "Ancient rock-cut caves revealing Buddhist masterpieces.",
      category: "Heritage",
    },
    {
      id: 16,
      title: "Dashavatar: The 10 Avatars",
      image: getStoryImage(16),
      description: "The evolution of life through Lord Vishnu's incarnations.",
      category: "Mythology",
    },
    {
      id: 18,
      title: "Hanuman lifting Sanjeevani",
      image: getStoryImage(18),
      description: "The greatest devotee's act of strength and devotion.",
      category: "Mythology",
    },
    {
      id: 20,
      title: "Prithviraj Chauhan",
      image: getStoryImage(20),
      description: "The definition of Rajput chivalry and bravery.",
      category: "Valor",
    },

    // --- New Additions: Mystical Heritage & Folklore ---
    {
      id: 21,
      title: "The Iron Pillar of Delhi",
      image: getStoryImage(21),
      description:
        "A metallurgical marvel that has resisted rust for over 1600 years.",
      category: "Ancient Tech",
    },
    {
      id: 22,
      title: "Rani Padmavati: The Jauhar",
      image: getStoryImage(22),
      description:
        "The legendary Rajput queen known for her beauty and sacrifice.",
      category: "Valor",
    },
    {
      id: 23,
      title: "The Great Living Chola Temples",
      image: getStoryImage(23),
      description:
        "Architectural wonders dedicated to Lord Shiva in southern India.",
      category: "Heritage",
    },
    {
      id: 24,
      title: "The Ghost Village of Kuldhara",
      image: getStoryImage(24),
      description:
        "An abandoned village in Rajasthan cursed by its disappearing residents.",
      category: "Folklore",
    },
    {
      id: 25,
      title: "Karna: The Unsung Hero",
      image: getStoryImage(25),
      description:
        "The tragic warrior of Mahabharata known for his unmatched generosity.",
      category: "Mythology",
    },
    {
      id: 26,
      title: "Jhansi Ki Rani",
      image: getStoryImage(26),
      description:
        "The warrior queen who became a symbol of resistance against British rule.",
      category: "Valor",
    },

    // --- Mahabharata Saga ---
    {
      id: 30,
      title: "Abhimanyu: The Chakravyuha",
      image: getStoryImage(30),
      description:
        "The tragic yet glorious stand of Arjuna's son against seven warriors.",
      category: "Mahabharata",
    },
    {
      id: 31,
      title: "Bhishma's Vow of Celibacy",
      image: getStoryImage(31),
      description:
        "The terrible oath that changed the fate of the Kuru dynasty forever.",
      category: "Mahabharata",
    },
    {
      id: 32,
      title: "Ekalavya's Guru Dakshina",
      image: getStoryImage(32),
      description:
        "The ultimate sacrifice of a self-taught archer for his guru.",
      category: "Mahabharata",
    },
    {
      id: 33,
      title: "Draupadi: Born of Fire",
      image: getStoryImage(33),
      description:
        "The fiery princess whose humiliation sparked the great war.",
      category: "Mahabharata",
    },
    {
      id: 34,
      title: "Ghatotkacha: The Night Warrior",
      image: getStoryImage(34),
      description:
        "The half-demon son of Bhima who wreaked havoc in the night battle.",
      category: "Mahabharata",
    },
    {
      id: 35,
      title: "Shakuni's Dice Game",
      image: getStoryImage(35),
      description:
        "The cunning strategy that stripped the Pandavas of their kingdom.",
      category: "Mahabharata",
    },

    // --- Ancient Bharat (Science & Education) ---
    {
      id: 36,
      title: "Nalanda: The Global University",
      image: getStoryImage(36),
      description:
        "The ancient seat of learning that attracted scholars from across the world.",
      category: "Ancient Bharat",
    },
    {
      id: 37,
      title: "Aryabhata: Zero & The Cosmos",
      image: getStoryImage(37),
      description:
        "The mathematician who gave the world 'Zero' and calculated Earth's circumference.",
      category: "Science",
    },
    {
      id: 38,
      title: "The Harappan Civilization",
      image: getStoryImage(38),
      description:
        "Urban planning and engineering marvels of the Indus Valley.",
      category: "Ancient Bharat",
    },
    {
      id: 39,
      title: "Chanakya's Arthashastra",
      image: getStoryImage(39),
      description:
        "The ancient treatise on statecraft, economic policy, and military strategy.",
      category: "Ancient Bharat",
    },
    {
      id: 40,
      title: "The Iron Man: Sardar Patel",
      image: getStoryImage(40),
      description: "The unification of 562 princely states into one nation.",
      category: "History",
    },

    // --- Folklore & Regional Tales ---
    {
      id: 41,
      title: "Tenali Rama and the Goddess",
      image: getStoryImage(41),
      description: "The witty poet who outsmarted the goddess Kali herself.",
      category: "Folklore",
    },
    {
      id: 42,
      title: "Birbal: The Khichdi",
      image: getStoryImage(42),
      description:
        "A lesson in patience and reward from the wise courtier of Akbar.",
      category: "Folklore",
    },
    {
      id: 43,
      title: "The Legend of Padmini of Chittor",
      image: getStoryImage(43),
      description:
        "The mirror reflection that led to the siege of Chittorgarh.",
      category: "Folklore",
    },
    {
      id: 44,
      title: "Panna Dai's Sacrifice",
      image: getStoryImage(44),
      description:
        "The nursemaid who sacrificed her own son to save the future king.",
      category: "Valor",
    },
    {
      id: 45,
      title: "Lohri: The Tale of Dulla Bhatti",
      image: getStoryImage(45),
      description:
        "The Robin Hood of Punjab whose legend is sung during Lohri.",
      category: "Folklore",
    },

    // --- Heritage & Arts ---
    {
      id: 46,
      title: "Kathakali: The Story Play",
      image: getStoryImage(46),
      description: "The classical dance-drama of Kerala with vibrant makeup.",
      category: "Heritage",
    },
    {
      id: 47,
      title: "The Living Root Bridges",
      image: getStoryImage(47),
      description: "Bio-engineering marvels of the Khasi people in Meghalaya.",
      category: "Heritage",
    },
    {
      id: 48,
      title: "Madhubani: Art of Mithila",
      image: getStoryImage(48),
      description: "Traditional folk art practiced by women in Bihar.",
      category: "Heritage",
    },
    {
      id: 49,
      title: "Kalaripayattu: Mother of Martial Arts",
      image: getStoryImage(49),
      description: "The ancient battlefield training system from Kerala.",
      category: "Heritage",
    },
    {
      id: 50,
      title: "The Ghats of Varanasi",
      image: getStoryImage(50),
      description: "The spiritual heart of India where life and death meet.",
      category: "Heritage",
    },

    // --- Other Legends ---
    {
      id: 51,
      title: "Mirabai's Devotion",
      image: getStoryImage(51),
      description:
        "The royal princess who gave up everything for Lord Krishna.",
      category: "Bhakti",
    },
    {
      id: 52,
      title: "Ahilyabai Holkar: The Philosopher Queen",
      image: getStoryImage(52),
      description: "The noble ruler who rebuilt temples across India.",
      category: "History",
    },
    {
      id: 53,
      title: "Bhagat Singh: Inquilab Zindabad",
      image: getStoryImage(53),
      description: "The revolutionary who smiled at the gallows for freedom.",
      category: "Valor",
    },
    {
      id: 54,
      title: "Chandragupta Maurya",
      image: getStoryImage(54),
      description: "The founder of the Mauryan Empire and unifier of India.",
      category: "History",
    },
    {
      id: 55,
      title: "Raja Raja Chola",
      image: getStoryImage(55),
      description:
        "The Chola emperor who expanded India's naval power to Southeast Asia.",
      category: "History",
    },
  ];

  // Backend Interaction
  const generateStory = async (prompt, language) => {
    setLoading(true);
    setSelectedTopic(prompt);
    setStory(null);
    setAudioUrl(null);
    setTypedLength(0);
    const hfToken = ""; // Configured in Secrets

    try {
      const client = await Client.connect("bharatverse11/story_audio_backend");
      const result = await client.predict("/predict", [
        prompt.title,
        prompt.description,
        language || "English",
        hfToken,
      ]);

      console.log("Backend Response:", result);

      if (result.data) {
        setStory(result.data[0]);
        setTypedLength(1);
        const generatedAudio = result.data[1];
        if (generatedAudio && generatedAudio.url) {
          setAudioUrl(generatedAudio.url);
        } else if (typeof generatedAudio === "string") {
          setAudioUrl(generatedAudio);
        }
      }
    } catch (error) {
      console.error("Error generating story:", error);
      setStory(
        "Sorry, the story weaver is taking a nap. Please try again later. (Error: " +
          error.message +
          ")"
      );
      setTypedLength(9999);
    } finally {
      setLoading(false);
    }
  };

  // Precise Typing Sync Logic
  const handleAudioStateChange = (state) => {
    // Handle boolean (legacy) or object (new sync) (fallback safe)
    if (typeof state === "boolean") {
      setIsAudioPlaying(state);
      return;
    }

    const { isPlaying, currentTime, duration } = state;
    setIsAudioPlaying(isPlaying);

    if (story && duration > 0) {
      // Calculate exact character position based on audio progress
      const progressRatio = currentTime / duration;
      // Ensure we don't exceed length
      const targetLength = Math.floor(progressRatio * story.length);
      setTypedLength(targetLength);
    }
  };

  // Auto-scroll effect
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop =
        textContainerRef.current.scrollHeight;
    }
  }, [typedLength]);

  const closeStory = () => {
    setSelectedTopic(null);
    setStory(null);
    setAudioUrl(null);
    setTypedLength(0);
    setIsAudioPlaying(false);
  };

  return (
    <div className="min-h-screen text-white relative overflow-hidden font-sans selection:bg-amber-500/30">
      {/* --- Animated Immersive Background --- */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="https://res.cloudinary.com/bharatverse/video/upload/v1766508692/bharatverse_assets/tth6brua8hbhf6ikazap.mp4"
        />
        <div className="absolute inset-0 bg-black/30 mix-blend-multiply"></div>

        {/* Deep nebula effects overlay */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[150px] mix-blend-screen animate-blob"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-amber-900/20 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute top-6 left-6 z-50">
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.9 }}
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-black/40 border border-amber-500/20 hover:border-amber-500/50 backdrop-blur-md transition-all text-amber-100/80 hover:text-white shadow-lg hover:bg-amber-500/10"
          title="Back to Cosmos"
        >
          <svg
            className="w-6 h-6 text-amber-500 group-hover:text-amber-400 transition-colors"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </motion.button>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12">
        {/* --- Content Container --- */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-24 relative z-10"
        >
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)] tracking-[0.15em] leading-tight"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              CHRONICLES{" "}
              <span className="text-amber-500 font-normal opacity-80">OF</span>{" "}
              BHARAT
            </motion.h1>
          </div>

          <div className="h-px w-full max-w-xs mx-auto mb-12 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent blur-[1px]"></div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto"
            ></motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            className="text-2xl md:text-3xl lg:text-4xl text-amber-100/90 font-light mb-8 max-w-5xl mx-auto leading-relaxed drop-shadow-md"
            style={{ fontFamily: "'Philosopher', sans-serif" }}
          >
            Journey through the{" "}
            <span className="text-amber-400 font-semibold italic border-b border-amber-500/30 pb-0.5">
              Eternal Sagas
            </span>
            . From cosmic{" "}
            <span className="text-cyan-300 font-medium">Vimanas</span> to sacred{" "}
            <span className="text-rose-300 font-medium">Temples</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="inline-block"
          >
            <span className="inline-block px-8 py-2 rounded-full border border-amber-500/30 bg-black/40 backdrop-blur-sm text-xs md:text-sm font-cinzel tracking-[0.3em] text-amber-300/80 uppercase shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              Select a Chronicle to Begin
            </span>
          </motion.div>
        </motion.div>

        {/* --- Cards Grid --- */}
        <AnimatePresence>
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 pb-20">
            {storyPrompts.map((prompt, index) => (
              <StoryCard
                key={prompt.id}
                prompt={prompt}
                index={index}
                onGenerate={generateStory}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* --- Immersive Story Overlay --- */}
        <AnimatePresence>
          {selectedTopic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/40"
            >
              <div
                className="absolute inset-0 bg-black/60 transition-opacity"
                onClick={!loading ? closeStory : null}
              />

              {/* Animated Background Glow behind the card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[85vh] -z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 blur-[100px] animate-pulse rounded-[3rem]"></div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="bg-[#05050a] w-full max-w-5xl h-[85vh] rounded-[2rem] overflow-hidden shadow-2xl relative z-20 flex flex-col md:flex-row border border-amber-500/20 box-border group/card"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Holographic Border Glow */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-500 rounded-[2rem] opacity-30 group-hover/card:opacity-60 blur-sm transition-opacity duration-1000 -z-10"></div>
                {/* Decorative "Golden Frame" Border similar to reference */}
                <div className="absolute inset-3 border border-amber-500/10 rounded-3xl pointer-events-none z-30 mix-blend-screen"></div>

                {/* Close Button */}
                {/* Close Button */}
                <button
                  onClick={closeStory}
                  className="absolute top-3 right-5 z-[60] w-10 h-10 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white/50 hover:text-white transition-all backdrop-blur border border-white/10 active:scale-90 group shadow-lg outline-none focus:outline-none focus:ring-0"
                >
                  <svg
                    className="w-5 h-5 transition-transform group-hover:rotate-90"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Left: Hero / Title Area (Royal Portrait Style) */}
                <div className="hidden md:flex w-5/12 h-full relative flex-col justify-end p-10 overflow-hidden bg-[#020205]">
                  {/* Full Color Background Image with Vignette */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020205] via-[#020205]/20 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#020205]/50 to-transparent z-10" />
                    <img
                      src={selectedTopic.image}
                      alt=""
                      className="w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110"
                    />
                  </div>

                  {/* Ornamental Divider */}
                  <div className="relative z-20 mb-6 w-16 h-1 bg-amber-500 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.8)]"></div>

                  <div className="relative z-20">
                    <h2
                      className="text-3xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-500 mb-6 leading-[1.1] tracking-tight drop-shadow-xl"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {selectedTopic.title.toUpperCase()}
                    </h2>

                    <div className="flex items-center gap-3">
                      <span className="h-px w-8 bg-amber-500/50"></span>
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-[0.3em] shadow-black drop-shadow-md font-serif">
                        {selectedTopic.category}
                      </span>
                      <span className="h-px w-8 bg-amber-500/50"></span>
                    </div>
                  </div>
                </div>

                {/* Right: Content Area (Scroll Style) */}
                <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col h-full bg-[#05050a] overflow-hidden shadow-inner shadow-indigo-500/10">
                  {/* Magical Nebula Background */}
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#0f0f18] to-[#020205] opacity-90"></div>
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(99,102,241,0.15)_0%,_transparent_50%)] animate-[spin_60s_linear_infinite]"></div>
                    <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(245,158,11,0.1)_0%,_transparent_50%)] animate-[spin_45s_linear_infinite_reverse]"></div>
                    {/* Floating Stars */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          "radial-gradient(white 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                      }}
                    ></div>
                  </div>

                  {/* Subtle Ancient Circuitry Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
                    style={{
                      backgroundImage: `linear-gradient(45deg, #fbbf24 1px, transparent 1px), linear-gradient(135deg, #fbbf24 1px, transparent 1px)`,
                      backgroundSize: "40px 40px",
                    }}
                  ></div>

                  {/* Ambient Glows */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse animation-delay-2000"></div>

                  {/* Mobile Header */}
                  <div className="md:hidden mb-8 mt-4 relative z-10 border-b border-white/10 pb-6">
                    <h2
                      className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-500 mb-2 leading-tight"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {selectedTopic.title}
                    </h2>
                    <span className="text-xs text-amber-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {selectedTopic.category}
                    </span>
                  </div>

                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full relative z-10">
                      {/* Minimalist Divine Loader - Bold Edition */}
                      <div className="relative w-32 h-32 flex items-center justify-center">
                        {/* Outer Active Ring - Bold Amber */}
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-0 border-4 border-amber-500/10 rounded-full border-t-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                        />

                        {/* Inner Counter Ring - Bold Indigo */}
                        <motion.div
                          animate={{ rotate: -360 }}
                          transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute inset-4 border-4 border-indigo-500/10 rounded-full border-b-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]"
                        />

                        {/* Center Artifact - Pulsing Core */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.5, 0.8, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                            className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-700 rounded-full blur-md"
                          ></motion.div>
                          <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] relative z-10 animate-pulse"></div>
                        </div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="mt-10 text-center"
                      >
                        <h3 className="text-xl md:text-2xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-400 to-amber-100 tracking-[0.2em] uppercase drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                          Accessing
                        </h3>
                        <p className="text-sm font-bold text-indigo-300/80 tracking-[0.5em] uppercase mt-2">
                          Ancient Scrolls
                        </p>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="flex flex-col h-full relative z-10"
                    >
                      <div
                        ref={textContainerRef}
                        className="flex-grow overflow-y-auto pr-6 custom-scrollbar mb-8 mask-image-b transform transition-all"
                        style={{
                          maskImage:
                            "linear-gradient(to bottom, black 90%, transparent 100%)",
                          scrollBehavior: "smooth",
                        }}
                      >
                        <div className="prose prose-invert lg:prose-xl max-w-none">
                          <p className="text-lg md:text-[1.2rem] leading-[2.2] text-amber-50/90 font-serif whitespace-pre-line tracking-wide text-justify font-light opacity-90 drop-shadow-sm">
                            <span className="float-left text-6xl md:text-7xl font-black mr-6 mt-2 mb-2 leading-none font-cinzel drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 border-2 border-amber-500/20 p-4 rounded-xl bg-black/30 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                              {story?.charAt(0)}
                            </span>
                            {story?.slice(1, typedLength)}
                            <span className="inline-block w-2 h-6 ml-1 bg-amber-500/80 animate-pulse rounded-full align-middle shadow-[0_0_10px_orange]"></span>
                          </p>
                        </div>
                      </div>

                      {audioUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 }}
                          className="mt-auto pt-6 border-t border-amber-500/10 relative"
                        >
                          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
                          <CustomAudioPlayer
                            src={audioUrl}
                            onPlayStateChange={handleAudioStateChange}
                            onReplay={() => setTypedLength(0)}
                          />
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- CSS Animations --- */}
      <style>
        {" "}
        {`
                @keyframes music-bar {
                    0%, 100% { height: 10%; }
                    50% { height: 90%; }
                }
                .animate-music-bar {
                    animation: music-bar 0.5s ease-in-out infinite alternate;
                }
                .animate-blob { animation: blob 10s infinite; }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: linear-gradient(to bottom, #f59e0b, #d97706); 
                    border-radius: 4px; 
                    border: 1px solid rgba(255,255,255,0.1); 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #fbbf24; }
                
                /* Global focus removal */
                *:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}
      </style>
    </div>
  );
};

export default StoryTellingPage;
