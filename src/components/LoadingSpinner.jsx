import React from "react";

const LoadingSpinner = ({ size = "md", fullscreen = false }) => {
  const sizeMap = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Dual ring spinner with gold accent */}
      <div className={`relative ${sizeMap[size]}`}>
        <div className={`${sizeMap[size]} rounded-full border-2 border-ivory-200 absolute inset-0`} />
        <div
          className={`${sizeMap[size]} rounded-full border-2 border-transparent border-t-gold-500 border-r-gold-400 absolute inset-0 animate-spin`}
          style={{ animationDuration: "0.7s" }}
        />
      </div>
      {size === "lg" && (
        <div className="font-display text-sm text-charcoal-400 tracking-widest">
          Bharat<span className="text-gold-600">Safar</span>
        </div>
      )}
    </div>
  );

  if (fullscreen) {
    return (
      <div className="fixed inset-0 bg-ivory-100 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;
