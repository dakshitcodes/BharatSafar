import React, { useState } from "react";
import { indianStates } from "../data/statesData";
import { generateItinerary } from "../services/geminiService";
import toast from "react-hot-toast";

const GeminiItineraryForm = ({ onItineraryGenerated }) => {
  const [form, setForm] = useState({
    state: "any",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "20:00",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.startDate || !form.endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      toast.error("End date must be after start date");
      return;
    }

    if (form.startTime >= form.endTime) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      setLoading(true);
      const itinerary = await generateItinerary(form);
      onItineraryGenerated(itinerary, form);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* State Selection */}
        <div>
          <label className="block text-sm font-semibold text-amber-900 mb-2">
            Where do you want to visit?
          </label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-200 text-amber-900 focus:border-amber-500 focus:outline-none transition"
          >
            {indianStates.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-amber-700 mt-1">
            Choose a state or let AI recommend one based on your dates
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              📅 Trip start date
            </label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-200 text-amber-900 focus:border-amber-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              📅 Trip end date
            </label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-200 text-amber-900 focus:border-amber-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Times */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              🕐 Daily start time
            </label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-200 text-amber-900 focus:border-amber-500 focus:outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">
              🕖 Daily end time
            </label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border-2 border-amber-200 text-amber-900 focus:border-amber-500 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 hover:from-amber-700 hover:via-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition duration-300 transform hover:scale-105"
        >
          {loading ? "⏳ Planning your itinerary..." : "✨ Generate AI Itinerary"}
        </button>
      </form>
    </div>
  );
};

export default GeminiItineraryForm;
