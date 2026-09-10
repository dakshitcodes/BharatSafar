export const heritageData = [
  {
    id: 1,
    title: "Taj Mahal",
    state: "Uttar Pradesh",
    category: "UNESCO World Heritage Site",
    coords: { lat: 27.1751, lng: 78.0421 },
    description:
      "The Taj Mahal is an ivory-white marble mausoleum on the south bank of the Yamuna river in Agra. Built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    images: [
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1604999333679-b86d54738315?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    videos: ["yah5O7aXqfY"],
    audiobook:
      "The romantic tale of Shah Jahan and Mumtaz Mahal echoes through the marble corridors of this eternal monument to love.",
    timeline: [
      { year: 1632, event: "Construction begins under Shah Jahan" },
      { year: 1643, event: "Main tomb completed" },
      { year: 1653, event: "Complex fully completed" },
      { year: 1983, event: "UNESCO World Heritage Site designation" },
    ],
    architecture: "Indo-Islamic, Mughal",
    significance: "Symbol of eternal love, masterpiece of Mughal architecture",
    rating: 4.9,
    reviews_count: 15423,
    featured: true,
  },
  {
    id: 2,
    title: "Red Fort (Lal Qila)",
    state: "Delhi",
    category: "UNESCO World Heritage Site",
    coords: { lat: 28.6562, lng: 77.241 },
    description:
      "The Red Fort is a historic walled city in Old Delhi that served as the main residence of the Mughal Emperors for nearly 200 years.",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ],
    videos: ["B_PhA3Do-KM"],
    audiobook:
      "From the ramparts of this red sandstone fortress, Mughal emperors ruled their vast empire for two centuries.",
    timeline: [
      { year: 1638, event: "Construction started by Shah Jahan" },
      { year: 1648, event: "Construction completed" },
      { year: 2007, event: "UNESCO World Heritage Site designation" },
    ],
    architecture: "Mughal",
    significance: "Political and ceremonial center of Mughal empire",
    rating: 4.7,
    reviews_count: 12890,
    featured: true,
  },
  {
    id: 3,
    title: "Golden Temple",
    state: "Punjab",
    category: "Gurudwara",
    coords: { lat: 31.62, lng: 74.8765 },
    description:
      "The holiest Gurudwara of Sikhism, formally known as Sri Harmandir Sahib, covered in gold with a sacred pool.",
    images: [
      "https://images.unsplash.com/photo-1591280063444-d3c514eb80d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ],
    significance:
      "Spiritual center of Sikhism, symbol of equality and brotherhood",
    rating: 4.9,
    reviews_count: 18765,
    featured: true,
  },
];

export const festivalsData = [
  {
    id: 101,
    title: "Diwali",
    state: "Pan-India",
    category: "Hindu Festival",
    date: "October-November",
    description:
      "Diwali, the Festival of Lights, celebrates the victory of light over darkness and good over evil.",
    images: [
      "https://images.unsplash.com/photo-1605123552201-ffdc8e6e4cd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ],
    significance:
      "Celebrates Lord Rama's return to Ayodhya after 14 years of exile",
    traditions: [
      "Lighting oil lamps (diyas)",
      "Decorating homes with rangoli",
      "Exchanging sweets and gifts",
    ],
    rating: 4.9,
    reviews_count: 25678,
    featured: true,
  },
  {
    id: 102,
    title: "Holi",
    state: "Pan-India",
    category: "Hindu Festival",
    date: "March",
    description:
      "Holi, the Festival of Colors, celebrates the arrival of spring and the victory of good over evil.",
    images: [
      "https://images.unsplash.com/photo-1583339793403-3d9b001b6008?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
    ],
    significance: "Celebrates the love of Radha and Krishna, burning of Holika",
    traditions: [
      "Playing with colored powder (gulal)",
      "Water balloon fights",
      "Traditional sweets like gujiya",
    ],
    rating: 4.8,
    reviews_count: 18923,
    featured: true,
  },
];

export const artsData = [
  {
    id: 201,
    title: "Bharatanatyam",
    state: "Tamil Nadu",
    category: "Classical Dance",
    description:
      "Bharatanatyam is one of the oldest classical dance traditions of India, originating in Tamil Nadu temples.",
    images: [
      "https://images.unsplash.com/photo-1583521214690-73421a1829a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ],
    history:
      "Over 2000 years old, codified in the Natya Shastra by Bharata Muni",
    characteristics: [
      "Hand gestures (Mudras)",
      "Facial expressions (Abhinaya)",
      "Rhythmic footwork (Adavus)",
    ],
    rating: 4.8,
    reviews_count: 3456,
    featured: true,
  },
  {
    id: 202,
    title: "Kathak",
    state: "Uttar Pradesh",
    category: "Classical Dance",
    description:
      "Kathak is a major form of Indian classical dance that originated in North India, known for its storytelling and graceful movements.",
    images: [
      "https://images.unsplash.com/photo-1578468467746-d57c86bb2055?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ],
    history:
      "Evolved from ancient storytelling traditions, refined in Mughal courts",
    characteristics: [
      "Pirouettes (Chakkars)",
      "Rhythmic footwork (Tatkar)",
      "Expressive gestures (Hastak)",
    ],
    rating: 4.7,
    reviews_count: 2890,
    featured: true,
  },
];

export const statesData = [
  {
    name: "Uttar Pradesh",
    code: "UP",
    capital: "Lucknow",
    heritage_count: 8,
    coords: { lat: 26.8467, lng: 80.9462 },
    description: "Home to the iconic Taj Mahal and rich Mughal heritage",
  },
  {
    name: "Rajasthan",
    code: "RJ",
    capital: "Jaipur",
    heritage_count: 12,
    coords: { lat: 26.9124, lng: 75.7873 },
    description: "Land of maharajas, forts, and desert culture",
  },
  {
    name: "Karnataka",
    code: "KA",
    capital: "Bangalore",
    heritage_count: 6,
    coords: { lat: 15.3173, lng: 75.7139 },
    description: "Ancient Vijayanagar empire ruins and temple architecture",
  },
];

export const hiddenGemsData = [
  {
    id: 301,
    title: "Chand Baori",
    state: "Rajasthan",
    description:
      "Chand Baori is one of India's most spectacular stepwells, featuring 3,500 narrow steps arranged in geometric patterns.",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    ],
    coords: { lat: 27.0076, lng: 76.6056 },
    significance:
      "Architectural marvel demonstrating ancient water conservation",
    rating: 4.6,
    reviews_count: 876,
  },
];
