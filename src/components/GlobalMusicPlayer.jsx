import React, { useRef, useState, useEffect } from "react";

const GlobalMusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume] = useState(0.3); // fixed 15% volume

  // Set initial volume once
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.muted = false;
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Audio play error:", err);
    }
  };

  return (
    <>
      {/* Global audio element – mounted once in App */}
      <audio ref={audioRef} src="https://res.cloudinary.com/bharatverse/video/upload/v1766498820/ajjok4u961sxgp5wfyvg.mp3" loop preload="auto" />

      {/* Fixed circular button at top-right, slightly lower than before */}
      <div className="fixed top-24 right-6 z-50 select-none">
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-2xl flex items-center justify-center hover:from-red-700 hover:to-orange-700 transition-all duration-300 hover:scale-110 border-2 border-white/20 backdrop-blur-sm"
          aria-label={
            isPlaying ? "Pause background music" : "Play background music"
          }
        >
          {isPlaying ? "🔊" : "🔈"}
        </button>
      </div>
    </>
  );
};

export default GlobalMusicPlayer;
