export const groundTruthData = {
  rubric: {
    // RESEARCH INTEGRITY NOTE (2026-10-14):
    // These relevance labels are PROVISIONAL GROUND TRUTH established by one annotator
    // (the project developer) using the written rubric below. They have NOT been
    // independently validated by a second annotator. They should be described in the
    // paper as "provisional single-annotator labels using a written rubric" — not as
    // "independently expert-validated" labels.
    // A second-annotator inter-rater review is recommended before the final paper
    // submission. Until then, evaluation scores must be interpreted accordingly.
    version: "1.0-provisional",
    annotationProtocol: {
      annotators: ["Primary developer (single annotator)"],
      method: "Single-annotator grading using the written rubric below and the provisional monthly values in the benchmark. Supporting evidence has not been recorded for each label; no inter-annotator agreement measure has been computed.",
      reviewStatus: "Unvalidated — second-annotator review pending",
      lastUpdated: "2026-10-14"
    },
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
    evaluationRule: "Labels were assigned from the provisional monthly values in the benchmark, independently of method scores. Supporting evidence for each destination-month grade is not yet documented. Closure conflicts are measured separately against the supplied disruption records."
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
      name: "Jogini Waterfall",
      activity: "waterfalls",
      monthlyGrades: {
        "1": { grade: 0, rationale: "PERMANENTLY CLOSED by Vashisht Gram Panchayat & HP Tourism Authority. Year-round civilian access prohibited due to cliff safety hazards and ecological degradation." },
        "2": { grade: 0, rationale: "PERMANENTLY CLOSED. Year-round civilian access prohibited by Gram Panchayat order." },
        "3": { grade: 0, rationale: "PERMANENTLY CLOSED. Gram Panchayat permanent shutdown in effect despite spring conditions." },
        "4": { grade: 0, rationale: "PERMANENTLY CLOSED. Civilian access prohibited year-round — site listed as Closed on Google Maps." },
        "5": { grade: 0, rationale: "PERMANENTLY CLOSED. No civilian access permitted regardless of seasonal conditions." },
        "6": { grade: 0, rationale: "PERMANENTLY CLOSED by Gram Panchayat & Kullu District Tourism Authority." },
        "7": { grade: 0, rationale: "PERMANENTLY CLOSED. Monsoon amplifies existing cliff hazards; full-destination ban in effect." },
        "8": { grade: 0, rationale: "PERMANENTLY CLOSED. Monsoon conditions worsen already prohibited cliff path; ban in effect." },
        "9": { grade: 0, rationale: "PERMANENTLY CLOSED. Post-monsoon conditions do not lift the Gram Panchayat shutdown order." },
        "10": { grade: 0, rationale: "PERMANENTLY CLOSED. Permanent Gram Panchayat & tourism authority shutdown overrides seasonal suitability." },
        "11": { grade: 0, rationale: "PERMANENTLY CLOSED. Year-round ban in effect; civilian access not permitted." },
        "12": { grade: 0, rationale: "PERMANENTLY CLOSED. Sub-zero winter conditions alongside permanent shutdown by local authorities." }
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
      name: "Kashmir Great Lakes (KGL) Trek",
      activity: "trekking",
      monthlyGrades: {
        "1": { grade: 0, rationale: "Impassable winter snowpack; alpine passes buried under 15-20ft snow; sub-zero freeze." },
        "2": { grade: 0, rationale: "Extreme winter snowpack; high avalanche danger across all high passes." },
        "3": { grade: 0, rationale: "Frozen alpine lakes; snowbound mountain passes impassable." },
        "4": { grade: 0, rationale: "Early spring thaw; dangerous snow cornices and avalanche chutes." },
        "5": { grade: 0, rationale: "Passes blocked by heavy snow; military and forest clearances not issued." },
        "6": { grade: 0, rationale: "OFFICIALLY NON-OPERATIONAL: Blanket security prohibition & administrative clearance suspension." },
        "7": { grade: 0, rationale: "OFFICIALLY NON-OPERATIONAL: Security crackdown halts civilian access to Vishansar and Gadsar circuits." },
        "8": { grade: 0, rationale: "OFFICIALLY NON-OPERATIONAL: Military checkpoints enforce trail closure pending security clearances." },
        "9": { grade: 0, rationale: "OFFICIALLY NON-OPERATIONAL: Operations suspended; legal and administrative dispute ongoing." },
        "10": { grade: 0, rationale: "Early high-altitude winter freeze; permits barred under blanket security restrictions." },
        "11": { grade: 0, rationale: "Severe Himalayan winter snows; lakes refreezing; trail impassable." },
        "12": { grade: 0, rationale: "Deep winter freeze; 20ft snowpack across entire circuit." }
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
