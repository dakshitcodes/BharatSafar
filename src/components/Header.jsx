import React, { useState, useEffect } from "react";
import { Menu, X, User, Search, ChevronDown } from "lucide-react";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";
import { createOrUpdateUser } from "../services/userService";

const Header = ({ currentPage, onPageChange, searchQuery, onSearchChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      createOrUpdateUser(clerkUser);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on page change
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [currentPage]);

  const navLinks = [
    { id: "home", label: "Home" },
    {
      id: "explore",
      label: "Explore",
      dropdown: [
        { id: "states", label: "States of India" },
        { id: "heritage", label: "Heritage Sites" },
        { id: "gems", label: "Hidden Gems" },
        { id: "map", label: "Interactive Map" },
      ],
    },
    {
      id: "culture",
      label: "Culture",
      dropdown: [
        { id: "festivals", label: "Festivals" },
        { id: "arts", label: "Arts & Crafts" },
        { id: "riti-riwaj", label: "Rituals & Customs" },
        { id: "storytelling", label: "Storytelling" },
      ],
    },
    {
      id: "plan",
      label: "Plan Your Trip",
      dropdown: [
        { id: "itinerary", label: "Itinerary Planner" },
        { id: "360tour", label: "360° Virtual Tours" },
        { id: "salahkar", label: "AI Recommendations" },
      ],
    },
    { id: "quiz", label: "Quiz" },
    { id: "chat", label: "AI Guide" },
  ];

  const handleNavClick = (id) => {
    onPageChange(id);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const isActive = (link) => {
    if (link.dropdown) {
      return link.dropdown.some((item) => item.id === currentPage);
    }
    return currentPage === link.id;
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-ivory-100/95 backdrop-blur-2xl shadow-bs-md border-b border-ivory-300/50"
            : "bg-ivory-100/80 backdrop-blur-xl border-b border-ivory-300/30"
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-18 py-3">
            {/* Logo / Wordmark */}
            <button
              onClick={() => handleNavClick("home")}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg"
              aria-label="BharatSafar — Go to homepage"
            >
              {/* Wordmark (Aesthetic Name) */}
              <div className="flex flex-col items-start leading-none">
                <span className="font-display font-bold text-2xl text-charcoal-900 tracking-tight group-hover:text-gold-700 transition-colors duration-300">
                  Bharat<span className="text-gold-600">Safar</span>
                </span>
                <span className="text-[11px] text-charcoal-400 font-sans font-medium tracking-widest uppercase mt-1">
                  Discover India
                </span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
              {navLinks.map((link) => (
                <div
                  key={link.id}
                  className="relative"
                  onMouseEnter={() => link.dropdown && setActiveDropdown(link.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {link.dropdown ? (
                    <button
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-sans font-medium transition-all duration-200 ${
                        isActive(link)
                          ? "text-gold-700 bg-gold-50"
                          : "text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-200"
                      }`}
                      aria-expanded={activeDropdown === link.id}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${activeDropdown === link.id ? "rotate-180" : ""}`}
                      />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-sans font-medium transition-all duration-200 ${
                        isActive(link)
                          ? "text-gold-700 bg-gold-50"
                          : "text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-200"
                      }`}
                      aria-current={currentPage === link.id ? "page" : undefined}
                    >
                      {link.label}
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {link.dropdown && activeDropdown === link.id && (
                    <div
                      className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-bs-lg border border-ivory-300/60 py-2 min-w-[200px] z-50"
                      role="menu"
                    >
                      {link.dropdown.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full text-left px-4 py-2.5 text-sm font-sans transition-colors duration-150 ${
                            currentPage === item.id
                              ? "text-gold-700 bg-gold-50 font-semibold"
                              : "text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-100"
                          }`}
                          role="menuitem"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Auth */}
              {isSignedIn && clerkUser ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => onPageChange("account")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-200 transition-all duration-200 text-sm font-sans font-medium"
                    title="My Account"
                  >
                    <User size={16} />
                    <span className="hidden sm:inline max-w-[90px] truncate">
                      {clerkUser.firstName || "Account"}
                    </span>
                  </button>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                isLoaded && (
                  <div className="hidden sm:flex items-center gap-2">
                    <SignInButton>
                      <button className="px-4 py-2 text-sm font-sans font-semibold text-charcoal-700 hover:text-charcoal-900 rounded-lg hover:bg-ivory-200 transition-all duration-200">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignUpButton>
                      <button className="bs-btn-primary text-sm px-4 py-2">
                        Get Started
                      </button>
                    </SignUpButton>
                  </div>
                )
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2.5 rounded-lg text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-200 transition-all duration-200"
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-ivory-300/50 bg-white/98 backdrop-blur-xl">
            <nav className="max-w-7xl mx-auto px-6 py-6 space-y-1" aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <div key={link.id}>
                  {link.dropdown ? (
                    <>
                      <div className="px-3 py-2 text-xs font-sans font-semibold text-charcoal-400 uppercase tracking-widest mt-4 first:mt-0">
                        {link.label}
                      </div>
                      {link.dropdown.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item.id)}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                            currentPage === item.id
                              ? "text-gold-700 bg-gold-50 font-semibold"
                              : "text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-100"
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <button
                      onClick={() => handleNavClick(link.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-sans font-medium transition-all duration-200 ${
                        currentPage === link.id
                          ? "text-gold-700 bg-gold-50 font-semibold"
                          : "text-charcoal-700 hover:text-charcoal-900 hover:bg-ivory-100"
                      }`}
                      aria-current={currentPage === link.id ? "page" : undefined}
                    >
                      {link.label}
                    </button>
                  )}
                </div>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 mt-4 border-t border-ivory-300">
                {isSignedIn && clerkUser ? (
                  <div className="flex items-center gap-3 px-3">
                    <UserButton afterSignOutUrl="/" />
                    <button
                      onClick={() => handleNavClick("account")}
                      className="text-sm font-sans font-medium text-charcoal-700"
                    >
                      {clerkUser.firstName || clerkUser.emailAddresses[0]?.emailAddress || "My Account"}
                    </button>
                  </div>
                ) : (
                  isLoaded && (
                    <div className="flex flex-col gap-2">
                      <SignInButton>
                        <button className="w-full py-3 text-center text-sm font-sans font-semibold text-charcoal-700 border border-ivory-300 rounded-xl hover:bg-ivory-100 transition-all">
                          Sign In
                        </button>
                      </SignInButton>
                      <SignUpButton>
                        <button className="w-full bs-btn-primary py-3">
                          Get Started — It's Free
                        </button>
                      </SignUpButton>
                    </div>
                  )
                )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
