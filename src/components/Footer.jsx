import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

// At the top of Footer.jsx
import imgBg from "./img.jpg";
import qrCode from "./qr-code.png"; // Update to match your file name

const SocialIcons = () => (
  <div className="flex space-x-4 mt-4">
    <a href="https://facebook.com" aria-label="Facebook">
      <FaFacebook className="w-7 h-7 hover:text-blue-500" />
    </a>
    <a href="https://instagram.com" aria-label="Instagram">
      <FaInstagram className="w-7 h-7 hover:text-pink-500" />
    </a>
    <a href="https://twitter.com" aria-label="Twitter">
      <FaTwitter className="w-7 h-7 hover:text-blue-400" />
    </a>
    <a href="https://youtube.com" aria-label="YouTube">
      <FaYoutube className="w-7 h-7 hover:text-red-600" />
    </a>
    <a href="https://linkedin.com" aria-label="LinkedIn">
      <FaLinkedin className="w-7 h-7 hover:text-blue-700" />
    </a>
  </div>
);

const Newsletter = () => (
  <div>
    <h2 className="text-2xl font-extrabold mb-2 text-white">Newsletter</h2>
    <p className="text-white/90 mb-4 text-base">
      Sign up for exciting news, learn more about our events and get great
      travel ideas.
    </p>

    <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-full font-bold text-lg transition-colors">
      Subscribe now
    </button>
  </div>
);

const Footer = () => {
  return (
    <footer className="relative text-white mt-20 z-0">
      <div className="absolute inset-0 -z-10 w-full h-full">
        <img
          src={imgBg}
          alt="Footer background"
          className="object-cover w-full h-full"
          draggable="false"
          style={{ opacity: 0.7 }} // you can change the opacity as needed
        />
        {/* Optional overlay for text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 py-12 bg-transparent">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Social & branding */}
          <div>
            <h1 className="text-4xl font-anton font-bold mb-4 uppercase tracking-widest text-orange-600">BharatVerse</h1>
            <p className="text-white/85 mb-6">
              Discover India's incredible cultural heritage through immersive
              experiences and interactive storytelling.
            </p>
            <h2 className="font-bold text-xl text-white">Follow us</h2>
            <SocialIcons />
          </div>
          {/* Quick Links */}
          <div>
            <h2 className="text-2xl font-extrabold mb-4 text-white">
              Quick Links
            </h2>
            <ul className="space-y-3 text-lg">
              <li>
                <a href="#" className="hover:underline">
                  Heritage Sites
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Festivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Traditional Arts
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hidden Gems
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Content Hub
                </a>
              </li>
            </ul>
          </div>
          {/* Newsletter */}
          <div>
            <Newsletter />
          </div>
          {/* QR code scan/contact */}
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-extrabold mb-2 text-white">
              Scan to chat
            </h2>
            <img
              src={qrCode}
              alt="Scan QR"
              className="w-28 h-28 bg-white rounded"
            />
          </div>
        </div>
        {/* Footer bottom bar */}
        <div className="border-t border-white/30 mt-10 pt-5 flex flex-col items-center text-center text-white/85 text-base font-semibold gap-2">
          <span>
            <a href="#">Terms of Use</a> | <a href="#">Privacy Policy</a> |{" "}
            <a href="#">Contact Us</a>
          </span>
          <span>©️ 2025 BharatVerse. Made with ❤️ by Netaji Ninjas.</span>
        </div>
      </div>
      {/* <WhatsAppButton /> */}
    </footer>
  );
};

export default Footer;
