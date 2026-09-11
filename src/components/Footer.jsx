import React from "react";
import {
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa";
import { MapPin, Mail, ArrowRight } from "lucide-react";

const Footer = ({ onPageChange }) => {
  const currentYear = new Date().getFullYear();

  const exploreLinks = [
    { label: "States of India", page: "states" },
    { label: "Heritage Sites", page: "heritage" },
    { label: "Hidden Gems", page: "gems" },
    { label: "Interactive Map", page: "map" },
    { label: "360° Virtual Tours", page: "360tour" },
  ];

  const cultureLinks = [
    { label: "Festivals", page: "festivals" },
    { label: "Arts & Crafts", page: "arts" },
    { label: "Rituals & Customs", page: "riti-riwaj" },
    { label: "Storytelling", page: "storytelling" },
    { label: "Quiz & Learn", page: "quiz" },
  ];

  const planLinks = [
    { label: "Itinerary Planner", page: "itinerary" },
    { label: "AI Recommendations", page: "salahkar" },
    { label: "AI Heritage Guide", page: "chat" },
    { label: "Upload Your Gem", page: "upload" },
  ];

  const socialLinks = [
    { icon: FaInstagram, href: "https://instagram.com/bharatsafar", label: "Instagram", hoverColor: "hover:text-pink-400" },
    { icon: FaTwitter, href: "https://twitter.com/bharatsafar", label: "Twitter / X", hoverColor: "hover:text-sky-400" },
    { icon: FaYoutube, href: "https://youtube.com/bharatsafar", label: "YouTube", hoverColor: "hover:text-red-500" },
    { icon: FaLinkedin, href: "https://linkedin.com/company/bharatsafar", label: "LinkedIn", hoverColor: "hover:text-blue-400" },
  ];

  const FooterLinkGroup = ({ title, links }) => (
    <div>
      <h3 className="text-xs font-sans font-semibold text-charcoal-400 uppercase tracking-widest mb-5">
        {title}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.page}>
            <button
              onClick={() => onPageChange && onPageChange(link.page)}
              className="text-sm font-sans text-charcoal-200 hover:text-gold-400 transition-colors duration-200 text-left"
            >
              {link.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-charcoal-900 text-white mt-0" role="contentinfo">
      {/* Gold accent line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Wordmark (Aesthetic Name) */}
            <div className="flex flex-col items-start leading-none mb-6">
              <div className="font-display font-bold text-2xl text-white tracking-tight">
                Bharat<span className="text-gold-400">Safar</span>
              </div>
              <div className="text-[11px] text-charcoal-400 font-sans font-medium tracking-widest uppercase mt-1">
                Discover India Differently
              </div>
            </div>

            <p className="text-sm font-sans text-charcoal-300 leading-relaxed mb-6 max-w-sm">
              A premium platform for discovering India's incredible cultural heritage
              through immersive experiences, AI-powered guides, and interactive storytelling.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mb-8">
              {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg bg-charcoal-800 flex items-center justify-center text-charcoal-300 ${hoverColor} hover:bg-charcoal-700 transition-all duration-200`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>

            {/* Newsletter mini */}
            <div>
              <p className="text-xs font-sans font-semibold text-charcoal-400 uppercase tracking-widest mb-3">
                Stay Updated
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex gap-2"
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  aria-label="Email address for newsletter"
                  className="flex-1 bg-charcoal-800 border border-charcoal-700 rounded-lg px-3 py-2.5 text-sm font-sans text-charcoal-100 placeholder-charcoal-500 focus:outline-none focus:border-gold-500 transition-colors min-w-0"
                />
                <button
                  type="submit"
                  className="bg-gold-600 hover:bg-gold-500 text-charcoal-900 px-3 py-2.5 rounded-lg transition-colors duration-200 flex-shrink-0"
                  aria-label="Subscribe to newsletter"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Explore Links */}
          <FooterLinkGroup title="Explore" links={exploreLinks} />

          {/* Culture Links */}
          <FooterLinkGroup title="Culture" links={cultureLinks} />

          {/* Plan Links */}
          <FooterLinkGroup title="Plan & Experience" links={planLinks} />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-charcoal-500 text-sm mb-8">
          <MapPin size={14} />
          <span className="font-sans">Made in India, for the world.</span>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-charcoal-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-sans text-charcoal-500">
            © {currentYear} BharatSafar. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm font-sans text-charcoal-500 hover:text-gold-400 transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-sm font-sans text-charcoal-500 hover:text-gold-400 transition-colors duration-200">
              Terms of Use
            </a>
            <a href="#" className="text-sm font-sans text-charcoal-500 hover:text-gold-400 transition-colors duration-200">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
