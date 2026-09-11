/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BharatSafar Premium Palette
        ivory: {
          50:  "#FDFCFA",
          100: "#FAF7F2",
          200: "#F5EFE6",
          300: "#EDE3D4",
          400: "#E2D5BF",
          500: "#D4C4A8",
        },
        gold: {
          50:  "#FBF8EE",
          100: "#F5EED0",
          200: "#EBDCA0",
          300: "#DEC570",
          400: "#D4AF50",
          500: "#C9A84C",
          600: "#B8860B",
          700: "#9A6F09",
          800: "#7D5B08",
          900: "#5C4206",
        },
        terracotta: {
          50:  "#FDF3EE",
          100: "#F9E2D5",
          200: "#F3C4AB",
          300: "#E99E7C",
          400: "#DB7A52",
          500: "#C2714F",
          600: "#A85840",
          700: "#8A4332",
          800: "#6D3226",
          900: "#4E2219",
        },
        charcoal: {
          50:  "#F7F5F3",
          100: "#EAE6E1",
          200: "#D4CDC4",
          300: "#B8AFA3",
          400: "#9A8E82",
          500: "#7D7068",
          600: "#635A52",
          700: "#4A4340",
          800: "#2E2A27",
          900: "#1C1917",
          950: "#0F0D0C",
        },
        forest: {
          50:  "#F0F5EA",
          100: "#DDECD0",
          200: "#BAD9A0",
          300: "#8DC16B",
          400: "#5FA43A",
          500: "#3D7A20",
          600: "#2D5016",  // primary forest
          700: "#223D12",
          800: "#192C0D",
          900: "#101C08",
        },
        // Keep saffron mapped to gold tones for backward compat with existing inline classes
        saffron: {
          50:  "#FBF8EE",
          100: "#F5EED0",
          200: "#EBDCA0",
          300: "#DEC570",
          400: "#D4AF50",
          500: "#C9A84C",
          600: "#B8860B",
          700: "#9A6F09",
          800: "#7D5B08",
          900: "#5C4206",
          950: "#3A2904",
        },
      },
      fontFamily: {
        // New BharatSafar typography
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
        // Keep legacy for backward compat
        cinzel: ["Cinzel", "serif"],
        inter: ["'DM Sans'", "system-ui", "sans-serif"],
        heritage: ["'Playfair Display'", "Georgia", "serif"],
        anton: ["'Playfair Display'", "Georgia", "serif"],
        devanagari: ["'Noto Sans Devanagari'", "sans-serif"],
      },
      backgroundImage: {
        "bs-gold": "linear-gradient(135deg, #D4AF50 0%, #C9A84C 50%, #B8860B 100%)",
        "bs-dark": "linear-gradient(135deg, #1C1917 0%, #2E2A27 100%)",
        "bs-warm": "linear-gradient(135deg, #FAF7F2 0%, #F5EFE6 100%)",
        "bs-terracotta": "linear-gradient(135deg, #C2714F 0%, #A85840 100%)",
        // Legacy
        "heritage-gradient": "linear-gradient(135deg, #C9A84C 0%, #B8860B 50%, #9A6F09 100%)",
      },
      boxShadow: {
        "bs-sm": "0 2px 8px 0 rgba(28, 25, 23, 0.08)",
        "bs-md": "0 4px 20px 0 rgba(28, 25, 23, 0.12)",
        "bs-lg": "0 8px 40px 0 rgba(28, 25, 23, 0.16)",
        "bs-xl": "0 16px 60px 0 rgba(28, 25, 23, 0.20)",
        "bs-gold": "0 4px 20px 0 rgba(201, 168, 76, 0.30)",
        "bs-glow": "0 0 40px 0 rgba(201, 168, 76, 0.20)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.5s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(201, 168, 76, 0)" },
        },
      },
      transitionTimingFunction: {
        "bs": "cubic-bezier(0.4, 0, 0.2, 1)",
        "bs-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      screens: {
        "xs": "480px",
      },
    },
  },
  plugins: [],
};
