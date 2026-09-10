// Sample heritage sites data
export const heritageData = [
  {
    id: 1,
    title: "Taj Mahal",
    slug: "taj-mahal",
    state: "Uttar Pradesh",
    city: "Agra",
    category: "UNESCO World Heritage Site",
    description:
      "The Taj Mahal is an ivory-white marble mausoleum on the southern bank of the river Yamuna in the Indian city of Agra.",
    images: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1597149696899-0e0e9bb0d76e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    coords: [27.1751, 78.0421],
    rating: 4.9,
    reviews_count: 15420,
    significance:
      "Built by Mughal emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal is a symbol of eternal love and one of the most recognizable structures in the world.",
    architecture: "Mughal",
    timeline: [
      { year: "1632", event: "Construction begins under Shah Jahan" },
      { year: "1648", event: "Main building completed" },
      { year: "1653", event: "Entire complex completed" },
      { year: "1983", event: "Designated as UNESCO World Heritage Site" },
    ],
    audiobook: "Listen to the romantic story of Shah Jahan and Mumtaz Mahal",
    nearby_poi: [
      { name: "Agra Fort", distance: "2.5 km" },
      { name: "Mehtab Bagh", distance: "1.5 km" },
      { name: "Itmad-ud-Daulah", distance: "6 km" },
    ],
  },
  {
    id: 2,
    title: "Red Fort",
    slug: "red-fort",
    state: "Delhi",
    city: "Delhi",
    category: "UNESCO World Heritage Site",
    description:
      "The Red Fort is a historic walled city in Old Delhi that served as the main residence of the Mughal Emperors for nearly 200 years.",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    coords: [28.6562, 77.241],
    rating: 4.7,
    reviews_count: 8930,
    significance:
      "Symbol of India's sovereignty and independence, where the Prime Minister hoists the national flag every Independence Day.",
    architecture: "Mughal",
    timeline: [
      { year: "1638", event: "Construction begins under Shah Jahan" },
      { year: "1648", event: "Construction completed" },
      {
        year: "1857",
        event: "Last Mughal emperor Bahadur Shah II captured here",
      },
      { year: "2007", event: "Designated as UNESCO World Heritage Site" },
    ],
  },
  // Add more heritage sites...
];

// Sample festivals data
export const festivalsData = [
  {
    id: 1,
    title: "Diwali",
    state: "Pan India",
    category: "Hindu Festival",
    description:
      "Diwali, also known as the Festival of Lights, is the most widely celebrated Hindu festival.",
    images: [
      "https://images.unsplash.com/photo-1605123552201-ffdc8e6e4cd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    date: "October/November (varies)",
    duration: "5 days",
    rating: 4.9,
    significance:
      "Celebrates the victory of light over darkness, good over evil, and knowledge over ignorance.",
    traditions: [
      "Lighting oil lamps (diyas) and candles",
      "Creating rangoli patterns",
      "Exchanging sweets and gifts",
      "Fireworks and celebrations",
      "Lakshmi Puja for prosperity",
    ],
    regional_variations: {
      "North India": "Emphasis on Lakshmi worship and Rama's return to Ayodhya",
      "South India": "Focus on Krishna's victory over Narakasura",
      "West India": "Business community celebrates as new year",
      "East India": "Kali Puja is prominently celebrated",
    },
  },
  // Add more festivals...
];

// Sample arts data
export const artsData = [
  {
    id: 1,
    title: "Bharatanatyam",
    state: "Tamil Nadu",
    category: "Classical Dance",
    description:
      "Bharatanatyam is a classical dance form that originated in Tamil Nadu temples over 2000 years ago.",
    images: [
      "https://images.unsplash.com/photo-1583521214690-73421a1829a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    rating: 4.8,
    history:
      "Originally performed by devadasis in temples, Bharatanatyam was revived in the 20th century by pioneering artists.",
    characteristics: [
      "Geometric precision of movements",
      "Expressive hand gestures (mudras)",
      "Facial expressions (abhinaya)",
      "Rhythmic footwork (adavus)",
      "Spiritual storytelling",
    ],
    components: {
      Alarippu: "Opening piece with rhythmic movements",
      Jatiswaram: "Abstract dance with musical patterns",
      Shabdam: "Expressive piece with lyrics",
      Varnam: "Main piece showcasing technique and expression",
      Tillana: "Concluding rhythmic piece",
    },
    costume:
      "Silk saree, temple jewelry, bells (ghungroo), flowers, and traditional makeup",
    themes: "Hindu mythology, devotion, love, nature, and spiritual philosophy",
  },
  // Add more arts...
];

// Sample hidden gems data
export const hiddenGemsData = [
  {
    id: 1,
    title: "Chand Baori",
    state: "Rajasthan",
    city: "Abhaneri",
    category: "stepwell",
    description:
      "One of India's most magnificent stepwells with 3,500 steps arranged in perfect symmetry.",
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    ],
    coords: [27.0074, 76.6067],
    rating: 4.6,
    cultural_significance:
      "Built in the 10th century for water conservation and community gathering.",
    difficulty: "easy",
    best_time_visit: "October to March",
    how_to_reach: "95 km from Jaipur, accessible by road",
    local_tips: "Visit early morning for best lighting and fewer crowds",
    nearby_attractions: [
      "Harshat Mata Temple",
      "Fatehpur Sikri (120 km)",
      "Bharatpur Bird Sanctuary (80 km)",
    ],
  },
  // Add more hidden gems...
];

// Sample states data
export const statesData = [
  {
    code: "UP",
    name: "Uttar Pradesh",
    capital: "Lucknow",
    description: "Home to the iconic Taj Mahal and rich Mughal heritage",
    heritage_count: 15,
    region: "north",
  },
  {
    code: "RJ",
    name: "Rajasthan",
    capital: "Jaipur",
    description: "Land of maharajas, forts, and vibrant culture",
    heritage_count: 12,
    region: "west",
  },
  // Add more states...
];

// Quiz questions data
export const quizData = {
  "heritage-monuments": [
    {
      id: 1,
      question: "Which Mughal emperor built the Taj Mahal?",
      options: ["Akbar", "Shah Jahan", "Aurangzeb", "Humayun"],
      correct: 1,
      explanation:
        "Shah Jahan built the Taj Mahal (1632-1653) as a mausoleum for his wife Mumtaz Mahal.",
    },
    {
      id: 2,
      question: "The Red Fort is located in which city?",
      options: ["Agra", "Delhi", "Jaipur", "Lucknow"],
      correct: 1,
      explanation:
        "The Red Fort is located in Old Delhi and served as the Mughal imperial residence.",
    },
    // Add more questions...
  ],
  // Add more quiz categories...
};
