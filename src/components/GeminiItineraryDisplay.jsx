import React from "react";
import toast from "react-hot-toast";

const GeminiItineraryDisplay = ({ itinerary, formData }) => {
  if (!itinerary) return null;

  const {
    selectedState,
    recommendationReason,
    recommendedCities,
    tripSummary,
    days,
    costBreakdown,
    generalSafetyRecommendations,
    bestTimeToVisit,
    travelTips,
    packingRecommendations,
  } = itinerary;

  const handleDownload = () => {
    const content = JSON.stringify(itinerary, null, 2);
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AI-Itinerary-${selectedState}-${formData.startDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("📥 Downloaded!");
  };

  return (
    <div className="space-y-6 mt-8">
      {/* Trip Header */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 rounded-2xl p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">
          🌍 {selectedState} Itinerary
        </h2>
        {recommendationReason && (
          <p className="text-amber-100 mb-3 text-sm italic">
            Why this state: {recommendationReason}
          </p>
        )}
        {recommendedCities && recommendedCities.length > 0 && (
          <p className="text-amber-100 mb-3">
            📍 Visiting: {recommendedCities.join(" → ")}
          </p>
        )}
        <p className="text-amber-50 mb-4">{tripSummary}</p>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            📅 {formData.startDate} to {formData.endDate}
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            🕐 {formData.startTime} – {formData.endTime} daily
          </span>
          <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
            💰 ₹{costBreakdown?.totalEstimatedCostINR?.toLocaleString("en-IN") || "TBD"}
          </span>
        </div>
      </div>

      {/* Day-wise Itinerary */}
      <div className="space-y-4">
        {days?.map((day) => (
          <div key={day.dayNumber} className="bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-900">
                Day {day.dayNumber} — {day.date}
              </h3>
              {day.theme && (
                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold">
                  {day.theme}
                </span>
              )}
              {day.dayTotal && (
                <span className="text-sm font-semibold text-orange-600">
                  ₹{day.dayTotal.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {day.activities?.map((activity, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 hover:border-orange-400 transition"
                >
                  {/* Time & Cost */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-semibold text-orange-700">
                      {activity.startTime} – {activity.endTime}
                    </div>
                    <div className="text-sm font-bold text-red-600">
                      ₹{activity.estimatedCostINR?.toLocaleString("en-IN") || "TBD"}
                    </div>
                  </div>

                  {/* Activity Title */}
                  <h4 className="text-amber-900 font-bold mb-1">{activity.title}</h4>

                  {/* Description */}
                  <p className="text-amber-800 text-sm mb-2">
                    {activity.shortDescription}
                  </p>

                  {/* Location & Details */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {activity.location && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        📍 {activity.location}
                      </span>
                    )}
                    {activity.area && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        {activity.area}
                      </span>
                    )}
                    {activity.duration && (
                      <span className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
                        ⏱️ {activity.duration}
                      </span>
                    )}
                  </div>

                  {/* Transport */}
                  {activity.recommendedTransport && (
                    <div className="mb-2 text-sm">
                      <span className="text-amber-700">🚗 Transport: </span>
                      <span className="text-amber-900 font-medium">
                        {activity.recommendedTransport}
                      </span>
                    </div>
                  )}

                  {/* Safety Tips */}
                  {activity.safetyTips && (
                    <div className="bg-orange-100 border border-orange-300 rounded-lg p-2 mt-2">
                      <p className="text-xs text-orange-800">
                        ⚠️ <strong>Safety:</strong> {activity.safetyTips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cost Breakdown */}
      {costBreakdown && (
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-emerald-800 mb-4">💰 Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-amber-900">
              <p className="text-sm text-amber-700">Transport</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₹{costBreakdown.totalTransportCostINR?.toLocaleString("en-IN") || "0"}
              </p>
            </div>
            <div className="text-amber-900">
              <p className="text-sm text-amber-700">Food & Dining</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₹{costBreakdown.totalFoodCostINR?.toLocaleString("en-IN") || "0"}
              </p>
            </div>
            <div className="text-amber-900">
              <p className="text-sm text-amber-700">Activities & Tickets</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₹{costBreakdown.totalActivityTicketsCostINR?.toLocaleString("en-IN") || "0"}
              </p>
            </div>
            <div className="text-amber-900">
              <p className="text-sm text-amber-700">Average per day</p>
              <p className="text-2xl font-bold text-emerald-700">
                ₹{costBreakdown.costPerDayAverage?.toLocaleString("en-IN") || "0"}
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <p className="text-amber-700 text-sm">Total Estimated Cost</p>
            <p className="text-4xl font-bold text-emerald-700">
              ₹{costBreakdown.totalEstimatedCostINR?.toLocaleString("en-IN") || "0"}
            </p>
          </div>
        </div>
      )}

      {/* General Safety Recommendations */}
      {generalSafetyRecommendations?.length > 0 && (
        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-orange-800 mb-3">
            ⚠️ General Safety Recommendations
          </h3>
          <ul className="space-y-2">
            {generalSafetyRecommendations.map((tip, idx) => (
              <li key={idx} className="text-amber-900 text-sm flex items-start">
                <span className="text-orange-600 mr-2">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Best Time to Visit */}
      {bestTimeToVisit && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-2">
            ⏰ Best Time to Visit
          </h3>
          <p className="text-amber-800">{bestTimeToVisit}</p>
        </div>
      )}

      {/* Travel Tips */}
      {travelTips?.length > 0 && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">
            💡 Local Travel Tips
          </h3>
          <ul className="space-y-2">
            {travelTips.map((tip, idx) => (
              <li key={idx} className="text-amber-800 text-sm flex items-start">
                <span className="text-orange-600 mr-2">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Packing Recommendations */}
      {packingRecommendations?.length > 0 && (
        <div className="bg-white border-2 border-amber-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-amber-900 mb-3">
            🎒 Packing Recommendations
          </h3>
          <ul className="space-y-2">
            {packingRecommendations.map((item, idx) => (
              <li key={idx} className="text-amber-800 text-sm flex items-start">
                <span className="text-orange-600 mr-2">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 rounded-xl transition duration-300 flex items-center justify-center gap-2"
      >
        📥 Download Itinerary as JSON
      </button>
    </div>
  );
};

export default GeminiItineraryDisplay;
