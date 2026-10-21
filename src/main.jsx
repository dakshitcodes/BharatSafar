import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import "leaflet/dist/leaflet.css";

// Get Clerk Publishable Key from environment
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("❌ Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local");
}

// Register Service Worker (optional, for PWA)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("✅ Service Worker registered:", registration);
      })
      .catch((registrationError) => {
        console.warn(
          "⚠️ Service Worker registration failed:",
          registrationError
        );
      });
  });
}

// Clerk localization overrides to show "BharatSafar" instead of "BharatVerse"
const clerkLocalization = {
  signIn: {
    start: {
      title: "Sign in to BharatSafar",
      subtitle: "Welcome back! Please sign in to continue",
    },
  },
  signUp: {
    start: {
      title: "Create your BharatSafar account",
      subtitle: "Welcome! Please fill in the details to get started",
    },
  },
};

// Clerk appearance configuration matching BharatSafar theme
const clerkAppearance = {
  variables: {
    colorPrimary: "#C9A84C",
    colorText: "#1C1917",
    colorTextSecondary: "#78716C",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FAF7F2",
    colorInputBorder: "rgba(212, 199, 175, 0.6)",
    borderRadius: "0.875rem",
    fontFamily: '"Plus Jakarta Sans", sans-serif',
  },
  elements: {
    card: {
      boxShadow: "0 20px 40px -15px rgba(28, 25, 23, 0.15)",
      border: "1px solid rgba(212, 199, 175, 0.4)",
      borderRadius: "1.25rem",
    },
    headerTitle: {
      color: "#1C1917",
      fontSize: "1.4rem",
      fontWeight: "700",
      fontFamily: '"Cinzel", "Playfair Display", serif',
    },
    headerSubtitle: {
      color: "#78716C",
    },
    formButtonPrimary: {
      background: "linear-gradient(135deg, #DFBE6A, #C9A84C)",
      color: "#1C1917",
      fontWeight: "600",
      "&:hover": {
        background: "linear-gradient(135deg, #C9A84C, #A8862A)",
      },
    },
    socialButtonsBlockButton: {
      border: "1px solid rgba(212, 199, 175, 0.6)",
      backgroundColor: "#FFFFFF",
      color: "#1C1917",
      "&:hover": {
        backgroundColor: "rgba(212, 199, 175, 0.15)",
      },
    },
    footerActionLink: {
      color: "#C85A32",
      fontWeight: "600",
      "&:hover": {
        color: "#A24322",
      },
    },
  },
};

// Render React App with Clerk Provider
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      localization={clerkLocalization}
      appearance={clerkAppearance}
    >
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
