import React, { useState, useEffect } from "react";
import { Menu, X, User, Crown, MapPin } from "lucide-react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { createOrUpdateUser } from "../services/userService";

const Header = ({ currentPage, onPageChange, searchQuery, onSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      createOrUpdateUser(clerkUser);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "states", label: "States" },
    { id: "heritage", label: "Heritage" },
    { id: "festivals", label: "Festivals" },
    { id: "arts", label: "Arts" },
    { id: "gems", label: "Hidden Gems" },
    { id: "quiz", label: "Quiz" },
    { id: "chat", label: "AI Guide" },
    { id: "map", label: "Map" },
    { id: "itinerary", label: "Plan Itinerary", icon: "MapPin" },
  ];

  return (
    <>
      <div className="h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-orange-400 fixed top-0 w-full z-50" />
      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent fixed top-1 w-full z-50 opacity-60" />
      <div className="fixed top-1.5 w-full z-40 h-0.5 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />

      <header className="fixed top-0 w-full z-40 bg-gradient-to-r from-white via-amber-50/90 to-white backdrop-blur-xl border-b-2 border-amber-200 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-50/30 to-transparent opacity-50 pointer-events-none" />
        <div className="flex items-center justify-between h-20 px-6 relative">
          <div className="flex-shrink-0 flex items-center min-w-0 pl-2">
            <button
              onClick={() => {
                onPageChange("home");
                setIsMenuOpen(false);
              }}
              className="flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-xl"
              aria-label="Bharatverse Home"
            >

              <div className="flex flex-col items-start">
                <h1 className="text-2xl font-anton font-bold text-orange-600 tracking-widest transition-colors duration-300 uppercase">
                  BharatVerse
                </h1>
                <p className="text-xs text-amber-700 font-semibold tracking-wide -mt-1 opacity-90">
                  Discover India's Heritage
                </p>
              </div>
            </button>
          </div>

          <nav className="hidden xl:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-amber-50 via-white to-amber-50 rounded-2xl p-2 backdrop-blur-sm border border-amber-200/50 shadow-lg">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onPageChange(link.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 border ${currentPage === link.id
                    ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg transform scale-105 border-amber-300"
                    : "text-amber-800 hover:text-amber-900 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 hover:shadow-md border-transparent hover:border-amber-200 hover:scale-102"
                    }`}
                  aria-current={currentPage === link.id ? "page" : undefined}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center space-x-3 flex-shrink-0 pl-2">
            {isSignedIn && clerkUser ? (
              <div className="flex items-center space-x-2 min-w-0">
                <button
                  onClick={() => onPageChange("account")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl text-amber-800 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 border border-transparent hover:border-amber-200 hover:shadow-md max-w-[160px] min-w-0"
                  title="Go to Account"
                >
                  <User size={18} />
                  <span className="hidden sm:inline font-semibold text-sm truncate max-w-[90px] min-w-0">
                    {clerkUser.firstName ||
                      clerkUser.emailAddresses[0]?.emailAddress ||
                      "Account"}
                  </span>
                </button>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                {isLoaded && (
                  <>
                    <SignInButton>
                      <button className="px-4 py-2 text-sm font-bold text-amber-800 hover:text-amber-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-xl hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 border border-transparent hover:border-amber-200 hover:shadow-md">
                        Login
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="px-5 py-2 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-700 hover:via-orange-700 hover:to-red-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transform hover:scale-105 border border-amber-400">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className="xl:hidden p-3 rounded-xl text-amber-700 hover:text-amber-800 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 border border-transparent hover:border-amber-200 hover:shadow-md"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="xl:hidden bg-gradient-to-r from-amber-50/95 via-white/95 to-amber-50/95 backdrop-blur-xl border-t border-amber-200/60 shadow-lg">
            <div className="max-w-7xl mx-auto px-2 py-6">
              <div className="grid grid-cols-2 gap-2">
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => {
                      onPageChange(link.id);
                      setIsMenuOpen(false);
                    }}
                    className={`px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 border ${currentPage === link.id
                      ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-lg border-amber-300"
                      : "text-amber-800 hover:text-amber-900 hover:bg-gradient-to-r hover:from-amber-100 hover:to-orange-100 border-amber-200 hover:border-amber-300 hover:shadow-md"
                      }`}
                    aria-current={currentPage === link.id ? "page" : undefined}
                  >
                    {link.icon === "MapPin" && <MapPin size={14} />}
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
