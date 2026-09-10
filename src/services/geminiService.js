import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: {
    temperature: 0.9, // Higher temperature = more random/diverse state choices
    topP: 0.95,
    topK: 40,
  },
});

export async function generateItinerary(params) {
  const { state, startDate, endDate, startTime, endTime } = params;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Get current month for season-based recommendations
  const month = new Date(startDate).getMonth() + 1;
  const getSeasonalContext = (m) => {
    if ([12, 1, 2].includes(m)) return "winter (best for northern India, deserts, hill stations)";
    if ([3, 4, 5].includes(m)) return "summer (hot - choose hill stations, beaches, water activities)";
    if ([6, 7, 8, 9].includes(m)) return "monsoon (avoid plains - choose western ghats, northeast states)";
    return "autumn (best for most of India)";
  };
  
  const seasonalContext = getSeasonalContext(month);

  const isAnyState = !state || state === "any";

  const prompt = `
You are an expert Indian travel planner with deep knowledge of all 28 Indian states + 8 UTs, their geography, climate, culture, attractions, and accessibility.

USER INPUT:
- Preferred State: ${isAnyState ? "Any State (MUST pick ONE random suitable state)" : state}
- Trip Start Date: ${startDate}
- Trip End Date: ${endDate}
- Number of Days Available: ${dayCount} days
- Current Season: ${seasonalContext}
- Daily Start Time: ${startTime}
- Daily End Time: ${endTime}
- Hours Available Per Day: ${calculateHours(startTime, endTime)}

CRITICAL INSTRUCTIONS FOR "ANY STATE" SELECTION:
If user selected "Any State":

1. DO NOT ALWAYS CHOOSE THE SAME STATE.
   - Each request should recommend a DIFFERENT state from previous recommendations.
   - Treat this as a randomized recommendation system.

2. FILTER STATES BY DURATION:
   - 1-2 days: Choose nearby/quick-access states (Delhi, Punjab, Haryana, UP nearby regions)
   - 3-4 days: Choose medium-distance states (Rajasthan, Gujarat, MP, Goa, states within 800km)
   - 5-7 days: Can choose farther states (Kerala, Tamil Nadu, Karnataka, Northeast states)
   - 8+ days: Can recommend iconic far destinations (Jammu & Kashmir, Ladakh, Northeast, South India)

3. CONSIDER SEASON (${seasonalContext}):
   - Winter months (Dec-Feb): Rajasthan, Goa, Delhi, Kerala, Punjab
   - Summer (Mar-May): Himachal Pradesh, Uttarakhand, Kashmir, Darjeeling
   - Monsoon (Jun-Sep): Western Ghats states (Karnataka, Kerala), Northeast (Assam, Meghalaya)
   - Autumn (Oct-Nov): All regions good - pick diverse options

4. RANDOM SELECTION:
   - Create a mental list of 4-5 suitable states based on days + season
   - RANDOMLY pick ONE from that list (not always the first or "best")
   - This ensures variety across multiple calls

5. AVOID REPETITION:
   - If user keeps selecting "Any State", they should see DIFFERENT recommendations each time
   - Example: If first call → Rajasthan, next call → Kerala, then → Himachal, etc.

ITINERARY GENERATION:
For the SELECTED/RECOMMENDED state:
1. Choose 1-2 main cities/regions in that state best suited for ${dayCount} days
2. Generate COMPLETE day-wise AND hour-wise itinerary:
   - Each day covers ${startTime} to ${endTime}
   - Activities realistic with actual travel times
   - Include breakfast/lunch/dinner breaks
   - Mix cultural heritage, local experiences, nature, food
3. For EVERY activity include realistic INR costs
4. Add transport options (metro, local bus, auto, cab, walking, trains)
5. Include specific safety tips for that location
6. Calculate realistic total costs

RESPONSE FORMAT - STRICT JSON ONLY:
{
  "selectedState": "string (the randomly chosen state)",
  "recommendationReason": "string (why this state for ${dayCount} days in ${seasonalContext})",
  "recommendedCities": ["city1", "city2"],
  "tripSummary": "2-3 sentences about the trip",
  "days": [
    {
      "dayNumber": 1,
      "date": "YYYY-MM-DD",
      "theme": "string",
      "activities": [
        {
          "startTime": "HH:mm",
          "endTime": "HH:mm",
          "title": "string",
          "shortDescription": "string",
          "location": "string",
          "area": "string",
          "recommendedTransport": "string",
          "estimatedCostINR": number,
          "duration": "string",
          "safetyTips": "string"
        }
      ],
      "dayTotal": number
    }
  ],
  "costBreakdown": {
    "totalTransportCostINR": number,
    "totalFoodCostINR": number,
    "totalActivityTicketsCostINR": number,
    "totalEstimatedCostINR": number,
    "costPerDayAverage": number
  },
  "generalSafetyRecommendations": [
    "string specific to this state"
  ],
  "bestTimeToVisit": "string",
  "travelTips": [
    "string with local knowledge"
  ],
  "packingRecommendations": [
    "string based on climate of this state"
  ]
}

Generate NOW:
`;

  try {
    toast.loading("🚀 Planning your itinerary with AI...");

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let itinerary;
    try {
      const jsonMatch = text.match(/\`\`\`json\n?([\s\S]*?)\n?\`\`\`/) || 
                        text.match(/\{[\s\S]*\}/);
      itinerary = JSON.parse(jsonMatch ? jsonMatch[1] || jsonMatch[0] : text);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", text);
      toast.error("⚠️ Response parsing failed. Please try again.");
      throw new Error("Invalid JSON from Gemini");
    }

    toast.dismiss();
    toast.success("✨ Itinerary generated successfully!");
    return itinerary;
  } catch (error) {
    console.error("Gemini Error:", error);
    toast.dismiss();
    toast.error("❌ Failed to generate itinerary. Check API key & internet.");
    throw error;
  }
}

function calculateHours(startTime, endTime) {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  const mins = end - start;
  const hours = (mins / 60).toFixed(1);
  return `${hours} hours`;
}
