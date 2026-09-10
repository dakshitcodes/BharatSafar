// API Configuration
export const API_ENDPOINTS = {
  HERITAGE_SITES: "/heritage-sites",
  FESTIVALS: "/festivals",
  ARTS: "/arts",
  HIDDEN_GEMS: "/hidden-gems",
  STATES: "/states",
  REVIEWS: "/reviews",
  AUTH: "/auth",
  USERS: "/users",
  BOOKMARKS: "/bookmarks",
  QUIZZES: "/quizzes",
  SEARCH: "/search",
};

// Indian States and UTs
export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Puducherry",
];

// Heritage Categories
export const HERITAGE_CATEGORIES = [
  "UNESCO World Heritage Site",
  "Archaeological Site",
  "Ancient Temple",
  "Historical Fort",
  "Royal Palace",
  "Religious Site",
  "Natural Heritage",
  "Cultural Landscape",
  "Monument",
  "Memorial",
  "Museum",
  "Gallery",
  "Library",
  "Other",
];

// Festival Categories
export const FESTIVAL_CATEGORIES = [
  "Hindu Festival",
  "Islamic Festival",
  "Christian Festival",
  "Sikh Festival",
  "Buddhist Festival",
  "Jain Festival",
  "Regional Festival",
  "Harvest Festival",
  "Seasonal Festival",
  "Cultural Festival",
  "Folk Festival",
  "National Festival",
  "Other",
];

// Art Categories
export const ART_CATEGORIES = [
  "Classical Dance",
  "Folk Dance",
  "Classical Music",
  "Folk Music",
  "Traditional Painting",
  "Folk Art",
  "Sculpture",
  "Traditional Craft",
  "Textile Art",
  "Pottery",
  "Jewelry Making",
  "Wood Carving",
  "Metal Work",
  "Other",
];

// Difficulty Levels
export const DIFFICULTY_LEVELS = {
  EASY: "Easy",
  MODERATE: "Moderate",
  HARD: "Hard",
  EXPERT: "Expert",
};

// Quiz Categories
export const QUIZ_CATEGORIES = [
  "heritage-monuments",
  "festivals",
  "classical-arts",
  "ancient-history",
  "regional-culture",
  "hidden-gems",
];

// User Roles
export const USER_ROLES = {
  VISITOR: "visitor",
  MEMBER: "member",
  CONTRIBUTOR: "contributor",
  MODERATOR: "moderator",
  ADMIN: "admin",
};

// Application Settings
export const APP_CONFIG = {
  NAME: "BharatVerse",
  VERSION: "1.0.0",
  DESCRIPTION: "Digital Heritage & Culture Portal of India",
  KEYWORDS: ["heritage", "culture", "india", "monuments", "festivals", "arts"],
  DEFAULT_LANGUAGE: "en",
  SUPPORTED_LANGUAGES: ["en", "hi"],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_IMAGES_PER_UPLOAD: 8,
  ITEMS_PER_PAGE: 20,
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_DURATION: 5000,
  MAP_CENTER: [20.5937, 78.9629], // Center of India
  MAP_ZOOM: 6,
};

// Color Themes
export const COLORS = {
  SAFFRON: "#FF9933",
  WHITE: "#FFFFFF",
  GREEN: "#138808",
  HERITAGE_RED: "#DC2626",
  PEACOCK_BLUE: "#0EA5E9",
  GOLD: "#F59E0B",
};

// Social Media Links
export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/bharatverse",
  TWITTER: "https://twitter.com/bharatverse",
  INSTAGRAM: "https://instagram.com/bharatverse",
  YOUTUBE: "https://youtube.com/bharatverse",
  LINKEDIN: "https://linkedin.com/company/bharatverse",
};

// External API Keys (Use environment variables in production)
export const API_KEYS = {
  GOOGLE_MAPS: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",
  YOUTUBE: import.meta.env.VITE_YOUTUBE_KEY || "",
  WEATHER: import.meta.env.VITE_WEATHER_KEY || "",
};

// Regular Expressions
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MOBILE: /^[6-9]\d{9}$/,
  PINCODE: /^[1-9][0-9]{5}$/,
  COORDINATES: /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  FORBIDDEN: "Access denied.",
  NOT_FOUND: "The requested resource was not found.",
  SERVER_ERROR: "Internal server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
  FILE_TOO_LARGE: "File size exceeds the maximum limit.",
  INVALID_FILE_TYPE: "Invalid file type.",
  LOCATION_DENIED: "Location access denied.",
  CAMERA_DENIED: "Camera access denied.",
  MICROPHONE_DENIED: "Microphone access denied.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully!",
  BOOKMARK_ADDED: "Added to bookmarks!",
  BOOKMARK_REMOVED: "Removed from bookmarks.",
  REVIEW_SUBMITTED: "Review submitted successfully!",
  SUBMISSION_SUCCESS: "Submission sent for review!",
  QUIZ_COMPLETED: "Quiz completed successfully!",
  ACCOUNT_CREATED: "Account created successfully!",
  LOGIN_SUCCESS: "Welcome back!",
  LOGOUT_SUCCESS: "Logged out successfully.",
};
