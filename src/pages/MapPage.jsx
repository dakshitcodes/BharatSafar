import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Search, Route, X, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


import GokarnaBeach from "../assets/mapImages/GokarnaBeach.jpeg";
import KudremukhNationalPark from "../assets/mapImages/KudremukhNationalPark.jpeg";
import ChikmagalurCoffeePlantations from "../assets/mapImages/ChikmagalurCoffeePlantations.jpg";
import BadamiCaveTemples from "../assets/mapImages/BadamiCaveTemples.jpg";
import MunnarTeaGardens from "../assets/mapImages/MunnarTeaGardens.webp";
import AthirappillyWaterfalls from "../assets/mapImages/AthirappillyWaterfalls.jpeg";
import VarkalaCliffBeach from "../assets/mapImages/VarkalaCliffBeach.webp";
import PichavaramMangroves from "../assets/mapImages/PichavaramMangroves.jpeg";
import ArakuValley from "../assets/mapImages/ArakuValley.jpeg";
import BelumCaves from "../assets/mapImages/BelumCaves.webp";
import KolliHills from "../assets/mapImages/KolliHills.jpeg";
import PonmudiHillStation from "../assets/mapImages/PonmudiHillStation.avif";
import MaravantheBeach from "../assets/mapImages/MaravantheBeach.jpeg";
import HampiRuins from "../assets/mapImages/HampiRuins.jpeg";
import YelagiriHills from "../assets/mapImages/YelagiriHills.avif";
import MeenakshiTemple from "../assets/mapImages/MeenakshiTemple.jpeg";
import TirupatiTemple from "../assets/mapImages/TirupatiTemple.jpg";
import Kanyakumari from "../assets/mapImages/Kanyakumari.jpg";
import Chopta from "../assets/mapImages/Chopta.avif";
import BirBilling from "../assets/mapImages/BirBilling.webp";
import Khajjiar from "../assets/mapImages/Khajjiar.jpg";
import Landour from "../assets/mapImages/Landour.jpeg";
import Barog from "../assets/mapImages/Barog.webp";
import Osian from "../assets/mapImages/Osian.jpg";
import Kalpa from "../assets/mapImages/Kalpa.jpeg";
import Padum from "../assets/mapImages/Padum.webp";
import TajMahal from "../assets/mapImages/TajMahal.jpg";
import KashiVishwanathTemple from "../assets/mapImages/KashiVishwanathTemple.jpg";
import ZiroValley from "../assets/mapImages/ZiroValley.jpg";
import Unakoti from "../assets/mapImages/Unakoti.jpg";
import NongriatVillage from "../assets/mapImages/NongriatVillage.jpg";
import Mawlynnong from "../assets/mapImages/Mawlynnong.jpg";
import Kohima from "../assets/mapImages/Kohima.jpg";
import MajuliIsland from "../assets/mapImages/MajuliIsland.jpg";
import Cherrapunji from "../assets/mapImages/Cherrapunji.jpg";
import KamakhyaTemple from "../assets/mapImages/KamakhyaTemple.jpg";
import KhajurahoTemples from "../assets/mapImages/KhajurahoTemples.jpg";
import Mandu from "../assets/mapImages/Mandu.jpg";
import Jabalpur from "../assets/mapImages/Jabalpur.jpg";
import SanchiStupa from "../assets/mapImages/SanchiStupa.jpg";
import Orchha from "../assets/mapImages/Orchha.jpg";
import RannOfKutch from "../assets/mapImages/RannOfKutch.jpg";
import SomnathTemple from "../assets/mapImages/SomnathTemple.jpg";
import Dwarka from "../assets/mapImages/Dwarka.jpg";
import GirForest from "../assets/mapImages/GirForest.jpg";
import Palitana from "../assets/mapImages/Palitana.jpg";
import Bodhgaya from "../assets/mapImages/Bodhgaya.jpg";
import Darjeeling from "../assets/mapImages/Darjeeling.jpeg";
import Sundarbans from "../assets/mapImages/Sundarbans.jpeg";
import KothapatnamBeach from "../assets/mapImages/KothapatnamBeach.jpg";


const ClientOnly = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return children;
};

const MapPage = () => {
  const mapRef = useRef(null);

  /* leaflet default marker fix */
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const [mapCenter] = useState([20.5937, 78.9629]);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSites, setFilteredSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isRouteMode, setIsRouteMode] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState([]);
  const [mapView, setMapView] = useState("streets");
  const [liveLocationInRoute, setLiveLocationInRoute] = useState(false);

  // Complete Data - 50+ locations (Hidden Gems + Heritage Sites + Temples)
  const allSites = [
    // SOUTH INDIA - Hidden Gems (15)

    {
      id: 1,
      title: "Gokarna Beach",
      region: "South",
      state: "Karnataka",
      type: "Hidden Gem",
      coords: [14.5538, 74.3191],
      description: "Pristine beaches with golden sands and peaceful vibes",
      image: GokarnaBeach,
      rating: 4.8,
      visitors: "50K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 2,
      title: "Kudremukh National Park",
      region: "South",
      state: "Karnataka",
      type: "Hidden Gem",
      coords: [13.0714, 75.3914],
      description: "Trekking trails and biodiversity hotspot",
      image: KudremukhNationalPark,
      rating: 4.9,
      visitors: "20K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹100",
    },
    {
      id: 3,
      title: "Chikmagalur Coffee Plantations",
      region: "South",
      state: "Karnataka",
      type: "Hidden Gem",
      coords: [13.3221, 75.7754],
      description: "Misty hills with coffee estates",
      image: ChikmagalurCoffeePlantations,
      rating: 4.7,
      visitors: "100K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 4,
      title: "Badami Cave Temples",
      region: "South",
      state: "Karnataka",
      type: "Heritage Site",
      coords: [15.9155, 75.6769],
      description: "8th century rock-cut temples in sandstone",
      image: BadamiCaveTemples,
      rating: 4.8,
      visitors: "30K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹15",
    },
    {
      id: 5,
      title: "Munnar Tea Gardens",
      region: "South",
      state: "Kerala",
      type: "Hidden Gem",
      coords: [10.0889, 77.0596],
      description: "Rolling tea plantations in Western Ghats",
      image: MunnarTeaGardens,
      rating: 4.9,
      visitors: "500K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 6,
      title: "Athirappilly Waterfalls",
      region: "South",
      state: "Kerala",
      type: "Hidden Gem",
      coords: [10.2864, 76.5706],
      description: "Stunning waterfall in rainforests",
      image: AthirappillyWaterfalls,
      rating: 4.8,
      visitors: "200K+",
      openHours: "8:00 AM - 5:00 PM",
      entryFee: "₹40",
    },
    {
      id: 7,
      title: "Varkala Cliff Beach",
      region: "South",
      state: "Kerala",
      type: "Hidden Gem",
      coords: [8.7333, 76.7167],
      description: "Cliffside beach with mineral springs",
      image: VarkalaCliffBeach,
      rating: 4.7,
      visitors: "150K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 8,
      title: "Pichavaram Mangroves",
      region: "South",
      state: "Tamil Nadu",
      type: "Hidden Gem",
      coords: [11.4358, 79.7842],
      description: "Second largest mangrove forest",
      image: PichavaramMangroves,
      rating: 4.8,
      visitors: "40K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹250",
    },
    {
      id: 9,
      title: "Araku Valley",
      region: "South",
      state: "Andhra Pradesh",
      type: "Hidden Gem",
      coords: [18.3411, 82.8796],
      description: "Coffee plantations in Eastern Ghats",
      image: ArakuValley,
      rating: 4.8,
      visitors: "100K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 10,
      title: "Belum Caves",
      region: "South",
      state: "Andhra Pradesh",
      type: "Heritage Site",
      coords: [15.0469, 78.1356],
      description: "India's second longest cave system",
      image: BelumCaves,
      rating: 4.6,
      visitors: "40K+",
      openHours: "10:00 AM - 5:00 PM",
      entryFee: "₹50",
    },
    {
      id: 11,
      title: "Kolli Hills",
      region: "South",
      state: "Tamil Nadu",
      type: "Hidden Gem",
      coords: [11.2222, 78.3611],
      description: "33 hairpin bends and tribal paradise",
      image: KolliHills,
      rating: 4.7,
      visitors: "50K+",
      openHours: "24 Hours",
      entryFee: "₹20",
    },
    {
      id: 12,
      title: "Ponmudi Hill Station",
      region: "South",
      state: "Kerala",
      type: "Hidden Gem",
      coords: [8.75, 77.27],
      description: "Lush valleys and mist-laden hills",
      image: PonmudiHillStation,
      rating: 4.6,
      visitors: "80K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 13,
      title: "Maravanthe Beach",
      region: "South",
      state: "Karnataka",
      type: "Hidden Gem",
      coords: [13.58, 74.97],
      description: "Unique beach with river on both sides",
      image: MaravantheBeach,
      rating: 4.7,
      visitors: "35K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 14,
      title: "Hampi Ruins",
      region: "South",
      state: "Karnataka",
      type: "Heritage Site",
      coords: [15.33, 76.46],
      description: "Ancient temples and historical ruins",
      image: HampiRuins,
      rating: 4.8,
      visitors: "150K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹30",
    },
    {
      id: 15,
      title: "Yelagiri Hills",
      region: "South",
      state: "Tamil Nadu",
      type: "Hidden Gem",
      coords: [12.9283, 78.6403],
      description: "Peaceful hill station with boating",
      image: YelagiriHills,
      rating: 4.5,
      visitors: "30K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 16,
      title: "Meenakshi Temple",
      region: "South",
      state: "Tamil Nadu",
      type: "Temple",
      coords: [9.5603, 78.1184],
      description: "Ancient temple with intricate Dravidian architecture",
      image: MeenakshiTemple,
      rating: 4.9,
      visitors: "1M+",
      openHours: "5:00 AM - 9:30 PM",
      entryFee: "Free",
    },
    {
      id: 17,
      title: "Tirupati Temple",
      region: "South",
      state: "Andhra Pradesh",
      type: "Temple",
      coords: [13.1829, 79.8291],
      description: "World's richest temple with spiritual significance",
      image: TirupatiTemple,
      rating: 4.8,
      visitors: "2M+",
      openHours: "2:00 AM - 10:00 PM",
      entryFee: "Free",
    },
    {
      id: 18,
      title: "Kanyakumari",
      region: "South",
      state: "Tamil Nadu",
      type: "Hidden Gem",
      coords: [8.0883, 77.5385],
      description: "Southernmost tip of India with stunning sunsets",
      image: Kanyakumari,
      rating: 4.7,
      visitors: "300K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },

    // NORTH INDIA
    {
      id: 19,
      title: "Chopta",
      region: "North",
      state: "Uttarakhand",
      type: "Hidden Gem",
      coords: [30.3288, 79.5941],
      description: "Mini Switzerland with dense forests",
      image: Chopta,
      rating: 4.7,
      visitors: "40K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 20,
      title: "Bir Billing",
      region: "North",
      state: "Himachal Pradesh",
      type: "Hidden Gem",
      coords: [32.1166, 76.7666],
      description: "Paragliding paradise with Buddhist monasteries",
      image: BirBilling,
      rating: 4.8,
      visitors: "60K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 21,
      title: "Khajjiar",
      region: "North",
      state: "Himachal Pradesh",
      type: "Hidden Gem",
      coords: [32.23, 76.38],
      description: "Alpine meadow surrounded by pine forests",
      image: Khajjiar,
      rating: 4.6,
      visitors: "50K+",
      openHours: "24 Hours",
      entryFee: "₹50",
    },
    {
      id: 22,
      title: "Landour",
      region: "North",
      state: "Uttarakhand",
      type: "Hidden Gem",
      coords: [30.4384, 78.2505],
      description: "Colonial hill station with old-world charm",
      image: Landour,
      rating: 4.7,
      visitors: "35K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 23,
      title: "Barog",
      region: "North",
      state: "Himachal Pradesh",
      type: "Hidden Gem",
      coords: [31.2, 76.7],
      description: "Historic railway tunnel and peaceful town",
      image: Barog,
      rating: 4.5,
      visitors: "25K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 24,
      title: "Osian",
      region: "North",
      state: "Rajasthan",
      type: "Hidden Gem",
      coords: [27.8184, 73.6629],
      description: "Desert town with ancient temples",
      image: Osian,
      rating: 4.6,
      visitors: "30K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 25,
      title: "Kalpa",
      region: "North",
      state: "Himachal Pradesh",
      type: "Hidden Gem",
      coords: [31.5, 78.3],
      description: "Apple orchards with Himalayan views",
      image: Kalpa,
      rating: 4.7,
      visitors: "20K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 26,
      title: "Padum",
      region: "North",
      state: "Ladakh",
      type: "Hidden Gem",
      coords: [33.0, 77.5],
      description: "Remote mountain valley in Ladakh",
      image: Padum,
      rating: 4.8,
      visitors: "15K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 27,
      title: "Taj Mahal",
      region: "North",
      state: "Uttar Pradesh",
      type: "Heritage Site",
      coords: [27.1751, 78.0421],
      description: "Monument to love with Mughal architecture",
      image: TajMahal,
      rating: 4.9,
      visitors: "6M+",
      openHours: "6:00 AM - 7:00 PM",
      entryFee: "₹50",
    },
    {
      id: 28,
      title: "Kashi Vishwanath Temple",
      region: "North",
      state: "Uttar Pradesh",
      type: "Temple",
      coords: [25.3108, 82.9947],
      description: "One of the holiest temples dedicated to Lord Shiva",
      image: KashiVishwanathTemple,
      rating: 4.9,
      visitors: "2M+",
      openHours: "3:00 AM - 10:00 PM",
      entryFee: "Free",
    },

    // NORTHEAST
    {
      id: 29,
      title: "Ziro Valley",
      region: "Northeast",
      state: "Arunachal Pradesh",
      type: "Hidden Gem",
      coords: [27.8266, 93.8211],
      description: "Rice terraces and tribal culture",
      image: ZiroValley,
      rating: 4.8,
      visitors: "25K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 30,
      title: "Unakoti",
      region: "Northeast",
      state: "Tripura",
      type: "Heritage Site",
      coords: [23.85, 91.35],
      description: "Rock-cut sculptures and ancient site",
      image: Unakoti,
      rating: 4.7,
      visitors: "20K+",
      openHours: "8:00 AM - 6:00 PM",
      entryFee: "Free",
    },
    {
      id: 31,
      title: "Nongriat Village",
      region: "Northeast",
      state: "Meghalaya",
      type: "Hidden Gem",
      coords: [25.3, 91.9],
      description: "Living root bridges and waterfall trek",
      image: NongriatVillage,
      rating: 4.9,
      visitors: "30K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹100",
    },
    {
      id: 32,
      title: "Mawlynnong",
      region: "Northeast",
      state: "Meghalaya",
      type: "Hidden Gem",
      coords: [25.3, 91.75],
      description: "Cleanest village in Asia with waterfalls",
      image: Mawlynnong,
      rating: 4.8,
      visitors: "35K+",
      openHours: "24 Hours",
      entryFee: "₹50",
    },
    {
      id: 33,
      title: "Kohima",
      region: "Northeast",
      state: "Nagaland",
      type: "Hidden Gem",
      coords: [25.6753, 94.1086],
      description: "Cultural hub with tribal heritage",
      image: Kohima,
      rating: 4.6,
      visitors: "20K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 34,
      title: "Majuli Island",
      region: "Northeast",
      state: "Assam",
      type: "Hidden Gem",
      coords: [26.8, 94.2],
      description: "Cultural island with sattriya dance",
      image: MajuliIsland,
      rating: 4.7,
      visitors: "25K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 35,
      title: "Cherrapunji",
      region: "Northeast",
      state: "Meghalaya",
      type: "Hidden Gem",
      coords: [25.2673, 91.7368],
      description: "Wettest place in India with scenic views",
      image: Cherrapunji,
      rating: 4.7,
      visitors: "40K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 36,
      title: "Kamakhya Temple",
      region: "Northeast",
      state: "Assam",
      type: "Temple",
      coords: [26.1633, 91.7097],
      description: "Ancient temple dedicated to Goddess Kamakhya",
      image: KamakhyaTemple,
      rating: 4.8,
      visitors: "500K+",
      openHours: "4:00 AM - 10:00 PM",
      entryFee: "Free",
    },

    // CENTRAL
    {
      id: 37,
      title: "Khajuraho Temples",
      region: "Central",
      state: "Madhya Pradesh",
      type: "Heritage Site",
      coords: [24.8319, 79.9249],
      description: "Medieval temples with intricate stone carvings",
      image: KhajurahoTemples,
      rating: 4.8,
      visitors: "150K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹30",
    },
    {
      id: 38,
      title: "Mandu",
      region: "Central",
      state: "Madhya Pradesh",
      type: "Hidden Gem",
      coords: [21.65, 74.63],
      description: "Ancient fort city with historical monuments",
      image: Mandu,
      rating: 4.7,
      visitors: "40K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹40",
    },
    {
      id: 39,
      title: "Jabalpur",
      region: "Central",
      state: "Madhya Pradesh",
      type: "Hidden Gem",
      coords: [23.1815, 79.9864],
      description: "Marble rocks and scenic waterfalls",
      image: Jabalpur,
      rating: 4.6,
      visitors: "100K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 40,
      title: "Sanchi Stupa",
      region: "Central",
      state: "Madhya Pradesh",
      type: "Heritage Site",
      coords: [23.4859, 77.7399],
      description: "Ancient Buddhist monument with carvings",
      image: SanchiStupa,
      rating: 4.7,
      visitors: "80K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹20",
    },
    {
      id: 41,
      title: "Orchha",
      region: "Central",
      state: "Madhya Pradesh",
      type: "Hidden Gem",
      coords: [25.25, 78.61],
      description: "Serene riverside town with ancient temples",
      image: Orchha,
      rating: 4.7,
      visitors: "60K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },

    // WEST
    {
      id: 42,
      title: "Rann of Kutch",
      region: "West",
      state: "Gujarat",
      type: "Hidden Gem",
      coords: [23.7363, 69.2075],
      description: "World's largest salt marsh landscape",
      image: RannOfKutch,
      rating: 4.8,
      visitors: "200K+",
      openHours: "24 Hours",
      entryFee: "₹100",
    },
    {
      id: 43,
      title: "Somnath Temple",
      region: "West",
      state: "Gujarat",
      type: "Temple",
      coords: [21.3922, 70.5819],
      description: "One of the twelve Jyotirlinga temples",
      image: SomnathTemple,
      rating: 4.8,
      visitors: "300K+",
      openHours: "6:00 AM - 9:00 PM",
      entryFee: "Free",
    },
    {
      id: 44,
      title: "Dwarka",
      region: "West",
      state: "Gujarat",
      type: "Heritage Site",
      coords: [22.2395, 68.9704],
      description: "Ancient pilgrimage city and temple town",
      image: Dwarka,
      rating: 4.7,
      visitors: "400K+",
      openHours: "6:00 AM - 9:00 PM",
      entryFee: "Free",
    },
    {
      id: 45,
      title: "Gir Forest",
      region: "West",
      state: "Gujarat",
      type: "Hidden Gem",
      coords: [21.4262, 70.6439],
      description: "Home to Asiatic lions",
      image: GirForest,
      rating: 4.7,
      visitors: "80K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹200",
    },
    {
      id: 46,
      title: "Palitana",
      region: "West",
      state: "Gujarat",
      type: "Heritage Site",
      coords: [22.1476, 71.1854],
      description: "Ancient Jain temple town with 863 temples",
      image: Palitana,
      rating: 4.8,
      visitors: "120K+",
      openHours: "6:00 AM - 8:00 PM",
      entryFee: "₹50",
    },

    // EAST
    {
      id: 47,
      title: "Bodhgaya",
      region: "East",
      state: "Bihar",
      type: "Heritage Site",
      coords: [24.4928, 84.9925],
      description: "Mahabodhi Temple and sacred Buddhist site",
      image: Bodhgaya,
      rating: 4.9,
      visitors: "500K+",
      openHours: "5:00 AM - 9:00 PM",
      entryFee: "Free",
    },
    {
      id: 48,
      title: "Darjeeling",
      region: "East",
      state: "West Bengal",
      type: "Hidden Gem",
      coords: [27.0428, 88.2663],
      description: "Mountain town with tea gardens and toy train",
      image: Darjeeling,
      rating: 4.8,
      visitors: "300K+",
      openHours: "24 Hours",
      entryFee: "Free",
    },
    {
      id: 49,
      title: "Sundarbans",
      region: "East",
      state: "West Bengal",
      type: "Hidden Gem",
      coords: [21.9, 88.9],
      description: "Mangrove forest and tiger sanctuary",
      image: Sundarbans,
      rating: 4.7,
      visitors: "100K+",
      openHours: "6:00 AM - 6:00 PM",
      entryFee: "₹200",
    },
    {
      id: 50,
      title: "Kothapatnam Beach",
      region: "South",
      state: "Andhra Pradesh",
      type: "Hidden Gem",
      coords: [15.4388, 80.1497],
      description:
        "A serene coastal escape near Ongole known for its calm waves and peaceful ambiance",
      image: KothapatnamBeach,
      rating: 4.5,
      visitors: "150K+",
      openHours: "24 Hours",
      entryFee: "₹20",
    },
  ];

  const regions = [
    { id: "all", name: "All Regions", color: "#3b82f6" },
    { id: "South", name: "South India", color: "#10b981" },
    { id: "North", name: "North India", color: "#f97316" },
    { id: "Northeast", name: "Northeast India", color: "#8b5cf6" },
    { id: "Central", name: "Central India", color: "#ec4899" },
    { id: "West", name: "West India", color: "#06b6d4" },
    { id: "East", name: "East India", color: "#f59e0b" },
  ];

  const types = [
    { id: "all", name: "All Types" },
    { id: "Hidden Gem", name: "Hidden Gems" },
    { id: "Heritage Site", name: "Heritage Sites" },
    { id: "Temple", name: "Temples" },
  ];

  const mapLayers = [
    { id: "streets", name: "Street", url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" },
    {
      id: "satellite",
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    },
    {
      id: "terrain",
      name: "Terrain",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    },
  ];

 
  useEffect(() => {
    let filtered = allSites.filter((site) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        site.title.toLowerCase().includes(q) ||
        site.state.toLowerCase().includes(q);
      const matchesRegion =
        selectedRegion === "all" || site.region === selectedRegion;
      const matchesType =
        selectedType === "all" || site.type === selectedType;
      return matchesSearch && matchesRegion && matchesType;
    });

    filtered.sort((a, b) => b.rating - a.rating);
    setFilteredSites(filtered);
  }, [searchQuery, selectedRegion, selectedType]);

 
  const createCustomIcon = (type, region, isSelected = false) => {
    let color = "#3b82f6";
    let emoji = "📍";

    if (type === "Temple") {
      color = "#c084fc";
      emoji = "🛕";
    } else if (type === "Heritage Site") {
      color = "#d97706";
      emoji = "🏛️";
    } else {
      const regionInfo = regions.find((r) => r.id === region);
      color = regionInfo?.color || "#3b82f6";
      emoji = "💎";
    }

    const size = isSelected ? 40 : 32;

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          background: ${color};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
          ${isSelected ? "transform: scale(1.3); box-shadow: 0 0 20px rgba(0,0,0,0.4);" : ""}
        ">
          ${emoji}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  const userLocationIcon = L.divIcon({
    className: "user-marker",
    html: `
      <div style="
        background: #3b82f6;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  // Route functions
  const addToRoute = (site) => {
    if (!selectedRoute.find((s) => s.id === site.id)) {
      setSelectedRoute([...selectedRoute, site]);
    }
  };

  const removeFromRoute = (siteId) => {
    setSelectedRoute(selectedRoute.filter((s) => s.id !== siteId));
  };

  const clearRoute = () => {
    setSelectedRoute([]);
    setLiveLocationInRoute(false);
  };

  // NEW FUNCTION: Add user's live location as starting point in route
  const addLiveLocationToRoute = () => {
    if (userLocation && !liveLocationInRoute) {
      const liveLocationObject = {
        id: "live-location",
        title: "Your Location",
        region: "Current",
        state: "Current Location",
        type: "Live Location",
        coords: userLocation,
        description: "Your current location",
        image: "",
        rating: 0,
        visitors: "",
        openHours: "Real-time",
        entryFee: "N/A",
      };

      setSelectedRoute([liveLocationObject, ...selectedRoute]);
      setLiveLocationInRoute(true);
    }
  };

  // NEW FUNCTION: Remove live location from route
  const removeLiveLocationFromRoute = () => {
    setSelectedRoute(selectedRoute.filter((s) => s.id !== "live-location"));
    setLiveLocationInRoute(false);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const optimizeRoute = () => {
    if (selectedRoute.length < 2) return;

    const optimized = [selectedRoute[0]];
    const remaining = [...selectedRoute.slice(1)];

    while (remaining.length > 0) {
      const current = optimized[optimized.length - 1];
      let nearestIndex = 0;
      let nearestDistance = calculateDistance(
        current.coords[0],
        current.coords[1],
        remaining[0].coords[0],
        remaining[0].coords[1]
      );

      remaining.forEach((site, index) => {
        const distance = calculateDistance(
          current.coords[0],
          current.coords[1],
          site.coords[0],
          site.coords[1]
        );
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      optimized.push(remaining[nearestIndex]);
      remaining.splice(nearestIndex, 1);
    }

    setSelectedRoute(optimized);
  };

  // NEW FUNCTION: Open Google Maps directions from user's live location to this site
  const navigateFromLiveLocation = (site) => {
    const [destLat, destLng] = site.coords;

    if (userLocation) {
      const [originLat, originLng] = userLocation;
      const url = `https://www.google.com/maps/dir/?api=1&origin=${originLat},${originLng}&destination=${destLat},${destLng}&travelmode=driving`;
      window.open(url, "_blank");
    } else {
      // Fallback: open directions with only destination; Google will try to use current location
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        () => {
          console.log("Location access denied");
        }
      );
    }
  }, []);

  return (
    <ClientOnly>
      <div className="h-screen w-full bg-gray-50 relative flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 p-4 z-[1000]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  India Heritage & Hidden Gems Map
                </h1>
                <p className="text-sm text-gray-600">
                  Explore 49 destinations across 7 regions
                </p>
              </div>

              <button
                onClick={() => setIsRouteMode(!isRouteMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${isRouteMode
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                <Route size={18} />
                Route Planner
              </button>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-56">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by place or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full"
                />
              </div>

              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              <select
                value={mapView}
                onChange={(e) => setMapView(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                {mapLayers.map((layer) => (
                  <option key={layer.id} value={layer.id}>
                    {layer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Map */}
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={mapCenter}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(mapInstance) => {
              mapRef.current = mapInstance;
            }}
          >
            <TileLayer
              url={
                mapLayers.find((layer) => layer.id === mapView)?.url ||
                mapLayers[0].url
              }
              attribution="&copy; OpenStreetMap contributors"
            />

            {filteredSites.map((site) => (
              <Marker
                key={site.id}
                position={site.coords}
                icon={createCustomIcon(
                  site.type,
                  site.region,
                  selectedSite?.id === site.id
                )}
                eventHandlers={{ click: () => setSelectedSite(site) }}
              >
                
                  <Popup>
                    <div className="w-80">
                      <img
                        src={site.image}
                        alt={site.title}
                        className="w-full h-40 object-cover rounded-lg mb-3"
                      />
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-2">
                          {site.type}
                        </span>
                        <h3 className="font-bold text-lg mb-1">{site.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{site.state}</p>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{site.description}</p>

                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-yellow-600">⭐ {site.rating}</span>
                          <span className="text-gray-600">{site.visitors}</span>
                        </div>
                        <div className="text-gray-600">
                          <p>Hours: {site.openHours}</p>
                          <p>Fee: {site.entryFee}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {isRouteMode && (
                          <button
                            onClick={() => addToRoute(site)}
                            className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                          >
                            Add to Route
                          </button>
                        )}

                        <button
                          onClick={() => navigateFromLiveLocation(site)}
                          className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <MapPin size={16} />
                          Navigate from My Location
                        </button>
                      </div>
                    </div>
                  </Popup>

                
              </Marker>
            ))}

            {userLocation && (
              <Marker
                position={userLocation}
                icon={L.divIcon({
                  className: "user-marker",
                  html: `
            <div style="
              background: #3b82f6;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              border: 4px solid white;
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            "></div>
          `,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                })}
              >
                <Popup>
                  {/* <div className="w-80">
                    <img
                      // src={site.image}
                      // alt={site.title}
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                    <div className="mb-3">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 mb-2">
                        {site.type}
                      </span>
                      <h3 className="font-bold text-lg mb-1">{site.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{site.state}</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {site.description}
                    </p>

                    <div className="space-y-2 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-yellow-600">⭐ {site.rating}</span>
                        <span className="text-gray-600">{site.visitors}</span>
                      </div>
                      <div className="text-gray-600">
                        <p>Hours: {site.openHours}</p>
                        <p>Fee: {site.entryFee}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {isRouteMode && (
                        <button
                          onClick={() => addToRoute(site)}
                          className="w-full bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Add to Route
                        </button>
                      )}

                      <button
                        onClick={() => navigateFromLiveLocation(site)}
                        className="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin size={16} />
                        Navigate from My Location
                      </button>
                    </div>
                  </div> */}
                </Popup>

              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-md border border-gray-200 p-4 z-[500] max-h-80 overflow-y-auto">
          <h3 className="font-bold text-sm mb-3 text-gray-800">Legend</h3>
          <div className="space-y-2">
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2">Types:</p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💎</span>
                  <span>Hidden Gems</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏛️</span>
                  <span>Heritage Sites</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛕</span>
                  <span>Temples</span>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Regions:</p>
              <div className="space-y-1">
                {regions.slice(1).map((region) => (
                  <div
                    key={region.id}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: region.color }}
                    />
                    <span className="text-gray-700">{region.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 bg-white rounded-lg shadow-md border border-gray-200 z-[500]">
          <button
            onClick={() =>
              mapRef.current &&
              mapRef.current.setZoom(mapRef.current.getZoom() + 1)
            }
            className="w-10 h-10 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 rounded-t-lg"
          >
            +
          </button>
          <div className="border-t border-gray-200" />
          <button
            onClick={() =>
              mapRef.current &&
              mapRef.current.setZoom(mapRef.current.getZoom() - 1)
            }
            className="w-10 h-10 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 rounded-b-lg"
          >
            −
          </button>
        </div>

        {/* Route Panel - UPDATED WITH LIVE LOCATION FEATURE */}
        {isRouteMode && (
          <div className="absolute top-20 right-6 bottom-6 w-96 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col z-[500]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Route Planner</h2>
              <button
                onClick={() => setIsRouteMode(false)}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {selectedRoute.length === 0 ? (
                <div className="text-center py-8 text-gray-600">
                  <Route size={32} className="mx-auto mb-3 text-gray-400" />
                  <p className="text-sm">Add places to create your route</p>
                </div>
              ) : (
                <div>
                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                    <p className="text-sm font-medium text-blue-900">
                      {selectedRoute.length} places selected
                    </p>
                  </div>

                  <div className="space-y-3">
                    {selectedRoute.map((site, index) => (
                      <div
                        key={site.id}
                        className={`p-3 rounded-lg border ${site.id === "live-location"
                          ? "bg-green-50 border-green-300"
                          : "bg-gray-50 border-gray-200"
                          }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`font-bold text-sm px-2 py-0.5 rounded ${site.id === "live-location"
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-100 text-blue-600"
                                  }`}
                              >
                                {site.id === "live-location" ? (
                                  <MapPin size={14} className="inline mr-1" />
                                ) : null}
                                {index + 1}
                              </span>
                              <span
                                className={`font-medium text-sm ${site.id === "live-location"
                                  ? "text-green-700"
                                  : "text-gray-800"
                                  }`}
                              >
                                {site.title}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {site.state} • {site.type}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              site.id === "live-location"
                                ? removeLiveLocationFromRoute()
                                : removeFromRoute(site.id)
                            }
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer - UPDATED WITH LIVE LOCATION BUTTON */}
            <div className="border-t border-gray-200 p-4 space-y-2">
              {userLocation && !liveLocationInRoute && (
                <button
                  onClick={addLiveLocationToRoute}
                  className="w-full px-3 py-2 bg-green-50 text-green-700 border border-green-300 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                >
                  <MapPin size={16} />
                  Use My Live Location as Start
                </button>
              )}

              {selectedRoute.length > 0 && (
                <>
                  <button
                    onClick={() => {
                      const waypoints = selectedRoute
                        .map((site) => `${site.coords[0]},${site.coords[1]}`)
                        .join("/");
                      const url = `https://www.google.com/maps/dir/${waypoints}`;
                      window.open(url, "_blank");
                    }}
                    className="w-full px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Navigate Route
                  </button>
                  <button
                    onClick={clearRoute}
                    className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </ClientOnly>
  );
};

export default MapPage;
