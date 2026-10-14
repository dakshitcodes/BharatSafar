export const groundTruthData = {
  rubric: {
    version: "2.0-independent",
    scale: [
      {
        grade: 3,
        label: "Highly Relevant",
        criteria: "Peak seasonal condition for this activity. Prime environmental indicators (optimal water discharge for waterfalls, optimal clear skies/snowpack for trekking, peak visual appeal)."
      },
      {
        grade: 2,
        label: "Relevant",
        criteria: "Good seasonal suitability with minor seasonal compromises (e.g. moderate flow, pleasant weather, minor rain showers requiring gear)."
      },
      {
        grade: 1,
        label: "Somewhat Relevant",
        criteria: "Sub-optimal seasonal condition (e.g. waterfall reduced to a thin trickle, high ambient heat >34°C, humid or muddy trail)."
      },
      {
        grade: 0,
        label: "Not Relevant",
        criteria: "Unsuitable seasonal state for this activity (e.g. dried out riverbed/bare rocks for waterfall, or flowerless sub-zero alpine zone for botanical trek)."
      }
    ],
    relevanceThreshold: 2,
    evaluationRule: "Labels reflect sourced seasonal evidence (weather, hydrological flow, seasonal aesthetics) independent of safety ratings and official closure orders, which are evaluated separately via the Closure-Conflict Rate."
  },
  ratings: {
    "dest-wf-01": {
      name: "Dudhsagar Falls",
      activity: "waterfalls",
      monthlyGrades: {
        "1": { grade: 2, rationale: "Moderate flow; pleasant dry Western Ghats weather." },
        "2": { grade: 2, rationale: "Moderate-low flow; clear sunny days." },
        "3": { grade: 1, rationale: "Flow diminishes; warm daytime temperatures." },
        "4": { grade: 1, rationale: "Low flow; high coastal humidity." },
        "5": { grade: 1, rationale: "Pre-monsoon low flow trickle." },
        "6": { grade: 2, rationale: "Monsoon arrives; flow surges noticeably." },
        "7": { grade: 3, rationale: "Spectacular roaring torrent; peak water volume across 4 tiers." },
        "8": { grade: 3, rationale: "Peak monsoon discharge; majestic water curtain." },
        "9": { grade: 3, rationale: "Heavy post-monsoon cascade; lush green surroundings." },
        "10": { grade: 3, rationale: "Optimal waterfall viewing; high flow with clear skies." },
        "11": { grade: 3, rationale: "Robust scenic cascade; pleasant cool breezes." },
        "12": { grade: 2, rationale: "Moderate-high flow; pleasant winter temperatures." }
      }
    },
    "dest-wf-02": {
      name: "Jog Falls",
      activity: "waterfalls",
      monthlyGrades: {
        "1": { grade: 1, rationale: "Dam upstream restricts flow; reduced cascade." },
        "2": { grade: 1, rationale: "Thin trickle across rock face." },
        "3": { grade: 0, rationale: "Dry rock face; river dammed upstream at Linganamakki." },
        "4": { grade: 0, rationale: "Almost completely dry cataracts; hot conditions." },
        "5": { grade: 0, rationale: "Pre-monsoon drought in Sharavathi catchment." },
        "6": { grade: 2, rationale: "Dam releases begin; cataracts regain volume." },
        "7": { grade: 3, rationale: "Massive roaring discharge; clouds of mist." },
        "8": { grade: 3, rationale: "Peak roar; all 4 cascades (Raja, Roarer, Rocket, Rani) in full force." },
        "9": { grade: 3, rationale: "Majestic cascades; green gorge; clearing weather." },
        "10": { grade: 2, rationale: "Good flow; clear sunny days for panoramic photography." },
        "11": { grade: 2, rationale: "Moderate flow; pleasant weather." },
        "12": { grade: 1, rationale: "Flow declining as dry winter sets in." }
      }
    },
    "dest-wf-03": {
      name: "Athirappilly Falls",
      activity: "waterfalls",
      monthlyGrades: {
        "1": { grade: 2, rationale: "Pleasant weather; steady wide curtain flow." },
        "2": { grade: 2, rationale: "Moderate flow; pleasant morning mist." },
        "3": { grade: 1, rationale: "Warm 32°C; water volume reduced." },
        "4": { grade: 1, rationale: "Warm and humid; lower river level." },
        "5": { grade: 2, rationale: "Pre-monsoon showers recharge Chalakudy river." },
        "6": { grade: 3, rationale: "Monsoon surge; impressive broad curtain of water." },
        "7": { grade: 3, rationale: "Massive water volume; thunderous tropical rainforest cascade." },
        "8": { grade: 3, rationale: "Enormous water curtain; lush Western Ghats forest." },
        "9": { grade: 3, rationale: "Post-monsoon emerald forest; massive scenic waterfall." },
        "10": { grade: 3, rationale: "Optimal water volume; comfortable breeze; green canopy." },
        "11": { grade: 3, rationale: "Clear sunny days; robust river flow." },
        "12": { grade: 2, rationale: "Comfortable weather; steady scenic flow." }
      }
    },
    "dest-wf-04": {
      name: "Nohkalikai Falls",
      activity: "waterfalls",
      monthlyGrades: {
        "1": { grade: 2, rationale: "Clear skies; turquoise pool visible; modest stream." },
        "2": { grade: 2, rationale: "Clear skies; pleasant cool breeze." },
        "3": { grade: 2, rationale: "Spring showers; flow picks up." },
        "4": { grade: 3, rationale: "Strong plunge; rich green plateaus." },
        "5": { grade: 3, rationale: "Heavy plunge into canyon pool." },
        "6": { grade: 2, rationale: "Enormous volume, but persistent fog pockets." },
        "7": { grade: 2, rationale: "Roaring waterfall; heavy cloud cover." },
        "8": { grade: 3, rationale: "Thunderous cascade; intermittent cloud clearings." },
        "9": { grade: 3, rationale: "Robust plunge; cloud cover lifting; deep emerald pool." },
        "10": { grade: 3, rationale: "Optimal: crystal clear view of turquoise pool beneath plunge." },
        "11": { grade: 3, rationale: "Optimal: crisp air, vibrant turquoise waters." },
        "12": { grade: 2, rationale: "Clear sunny skies; slender scenic stream." }
      }
    },
    "dest-wf-05": {
      name: "Hogenakkal Falls",
      activity: "waterfalls",
      monthlyGrades: {
        "1": { grade: 3, rationale: "Gentle river rapids, great canyon scenery, mild sun." },
        "2": { grade: 3, rationale: "Pleasant weather, serene cataracts." },
        "3": { grade: 2, rationale: "Warm, lower river level." },
        "4": { grade: 1, rationale: "Hot 38°C; low water discharge." },
        "5": { grade: 1, rationale: "Hot summer; diminished cascade." },
        "6": { grade: 2, rationale: "Pre-monsoon replenishment; rising river volume." },
        "7": { grade: 2, rationale: "High Kaveri discharge; dramatic smoking rocks." },
        "8": { grade: 2, rationale: "High discharge cataracts across rock channels." },
        "9": { grade: 3, rationale: "High flow, green riverbanks, pleasant air." },
        "10": { grade: 3, rationale: "Robust canyon rapids; cool autumn breezes." },
        "11": { grade: 3, rationale: "Optimal river discharge; pleasant temperatures." },
        "12": { grade: 3, rationale: "Prime tourist month; gentle rapids." }
      }
    },
    "dest-trk-01": {
      name: "Kedarkantha Trek",
      activity: "trekking",
      monthlyGrades: {
        "1": { grade: 3, rationale: "Premier winter snow trek; crisp clear skies; snow-covered pine trails." },
        "2": { grade: 3, rationale: "Thick powder snow; frozen Juda Ka Talab lake." },
        "3": { grade: 2, rationale: "Snow melting; pleasant climbing days." },
        "4": { grade: 2, rationale: "Alpine flora emerging; clear trails." },
        "5": { grade: 2, rationale: "Pleasant weather; clear summit visibility." },
        "6": { grade: 2, rationale: "Warm; pre-monsoon cloudiness." },
        "7": { grade: 1, rationale: "Wet ascent; muddy trail; cloudy views." },
        "8": { grade: 1, rationale: "Monsoon showers; slippery paths." },
        "9": { grade: 2, rationale: "Trails drying; crisp mountain air." },
        "10": { grade: 3, rationale: "Golden alpine meadows; crystal clear 360° Himalayan vista." },
        "11": { grade: 3, rationale: "Crisp autumn; first winter snowfall flurries." },
        "12": { grade: 3, rationale: "Early winter wonderland snow trek." }
      }
    },
    "dest-trk-02": {
      name: "Valley of Flowers Trek",
      activity: "trekking",
      monthlyGrades: {
        "1": { grade: 0, rationale: "Buried under 15ft snow; no wildflowers; sub-zero freeze." },
        "2": { grade: 0, rationale: "Deep snowpack; completely dormant vegetation." },
        "3": { grade: 0, rationale: "Frozen alpine zone; no flowers." },
        "4": { grade: 0, rationale: "Early snowmelt; barren mud; no flowers." },
        "5": { grade: 0, rationale: "Patchy snow and bare rocks; budding has not begun." },
        "6": { grade: 2, rationale: "Early sprouting alpine wildflowers; budding season." },
        "7": { grade: 3, rationale: "Valley carpeted in vibrant wildflower blooms; peak botanical spectacle." },
        "8": { grade: 3, rationale: "Maximum floral diversity; rare Brahma Kamal in bloom." },
        "9": { grade: 3, rationale: "Golden autumn foliage; late bloom; clear skies." },
        "10": { grade: 2, rationale: "Late season; frost arriving; flowers receding." },
        "11": { grade: 0, rationale: "Winter freeze; flowers withered; early snowfall." },
        "12": { grade: 0, rationale: "Buried under deep winter snow." }
      }
    },
    "dest-trk-03": {
      name: "Triund Trek",
      activity: "trekking",
      monthlyGrades: {
        "1": { grade: 2, rationale: "Winter snow hike; sub-zero temperatures requiring warm gear." },
        "2": { grade: 2, rationale: "Melting snow; clear afternoon views." },
        "3": { grade: 3, rationale: "Blooming red rhododendrons, pleasant weather, open ridge." },
        "4": { grade: 3, rationale: "Mild temperatures, clear panoramic skies." },
        "5": { grade: 3, rationale: "Cool mountain refuge; dry trails." },
        "6": { grade: 2, rationale: "Warm, pre-monsoon cloudiness." },
        "7": { grade: 1, rationale: "Heavy rains; slippery rocky path; misty views." },
        "8": { grade: 1, rationale: "Monsoon showers; slippery boulders." },
        "9": { grade: 2, rationale: "Rains receding; crisp air returning." },
        "10": { grade: 3, rationale: "Crystal clear Dhauladhar snow wall visibility; pleasant crisp days." },
        "11": { grade: 3, rationale: "Clear sunny autumn hiking." },
        "12": { grade: 2, rationale: "Cold winter trek; fresh snow at ridge." }
      }
    },
    "dest-trk-04": {
      name: "Chembra Peak Trek",
      activity: "trekking",
      monthlyGrades: {
        "1": { grade: 3, rationale: "Cool mountain mist; pleasant breeze; beautiful heart lake." },
        "2": { grade: 3, rationale: "Clear blue skies over Wayanad hills." },
        "3": { grade: 1, rationale: "Dry grassland; warm daytime sun." },
        "4": { grade: 1, rationale: "Hot; humid; dry shola vegetation." },
        "5": { grade: 2, rationale: "Early showers turn hills lush green." },
        "6": { grade: 2, rationale: "Lush green slopes; misty views; rain showers." },
        "7": { grade: 2, rationale: "Lush emerald hills; atmospheric mist over heart lake." },
        "8": { grade: 2, rationale: "Vibrant green rolling hills; cool mist." },
        "9": { grade: 3, rationale: "Lush green rolling hills; clear skies." },
        "10": { grade: 3, rationale: "Post-monsoon emerald hills; mist-clad lake." },
        "11": { grade: 3, rationale: "Mild cool weather, excellent walking conditions." },
        "12": { grade: 3, rationale: "Crisp morning dew, prime trekking season." }
      }
    }
  }
};

export default groundTruthData;
