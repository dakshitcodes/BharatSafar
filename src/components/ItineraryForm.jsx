import React, { useState } from 'react';
import {
  indianStates,
  culturalSites,
  months,
  transportModes,
  durationDays,
  accommodation,
} from '../data/itineraryData';
import { planItinerary } from '../services/itineraryService';
import toast from 'react-hot-toast';

const ItineraryForm = ({ onItineraryGenerated }) => {
  const [formData, setFormData] = useState({
    state: '',
    selectedSites: [],
    month: '',
    days: '',
    transport: '',
    accommodation: 'Mid-range',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const selectedState = indianStates.find((s) => s.name === formData.state);
  const availableSites = selectedState ? culturalSites[selectedState.name] : [];

  const handleStateChange = (e) => {
    setFormData({ ...formData, state: e.target.value, selectedSites: [] });
  };

  const handleSiteChange = (siteId) => {
    const site = availableSites.find((s) => s.id === parseInt(siteId));
    const isSelected = formData.selectedSites.some((s) => s.id === site.id);

    if (isSelected) {
      setFormData({
        ...formData,
        selectedSites: formData.selectedSites.filter((s) => s.id !== site.id),
      });
    } else {
      setFormData({
        ...formData,
        selectedSites: [...formData.selectedSites, site],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.state) newErrors.state = 'Please select a state';
    if (formData.selectedSites.length === 0) newErrors.sites = 'Please select at least one site';
    if (!formData.month) newErrors.month = 'Please select a month';
    if (!formData.days) newErrors.days = 'Please select duration';
    if (!formData.transport) newErrors.transport = 'Please select transport mode';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }

    setLoading(true);

    const selectedMonth = months.find((m) => m.name === formData.month);
    const selectedTransport = transportModes.find((t) => t.name === formData.transport);
    const selectedAccommodation = accommodation[formData.accommodation];

    const result = planItinerary({
      state: formData.state,
      selectedSites: formData.selectedSites,
      month: selectedMonth,
      days: formData.days,
      transport: selectedTransport,
      accommodation: selectedAccommodation,
    });

    setLoading(false);

    if (result.success) {
      onItineraryGenerated(result.data, formData);
    } else {
      toast.error('Error planning itinerary: ' + result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
        Plan Your Itinerary
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* State Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select State
          </label>
          <select
            name="state"
            value={formData.state}
            onChange={handleStateChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Choose a state...</option>
            {indianStates.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
        </div>

        {/* Cultural Sites Selection */}
        {availableSites.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Cultural Sites (choose one or more)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableSites.map((site) => (
                <div key={site.id} className="flex items-start border border-gray-300 p-3 rounded-lg hover:bg-yellow-50 cursor-pointer transition">
                  <input
                    type="checkbox"
                    id={`site-${site.id}`}
                    checked={formData.selectedSites.some((s) => s.id === site.id)}
                    onChange={() => handleSiteChange(site.id)}
                    className="mt-1 mr-3 rounded"
                  />
                  <label htmlFor={`site-${site.id}`} className="cursor-pointer flex-1">
                    <p className="font-medium text-gray-800">{site.name}</p>
                    <p className="text-xs text-gray-600">{site.city} • {site.duration} days</p>
                    <p className="text-xs text-gray-500 mt-1">{site.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                      {site.type}
                    </span>
                  </label>
                </div>
              ))}
            </div>
            {errors.sites && <p className="text-red-500 text-sm mt-1">{errors.sites}</p>}
          </div>
        )}

        {/* Month Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Month
          </label>
          <select
            name="month"
            value={formData.month}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Choose a month...</option>
            {months.map((month) => (
              <option key={month.id} value={month.name}>
                {month.name} ({month.avgTemp}) - Crowd: {month.crowd}
              </option>
            ))}
          </select>
          {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
        </div>

        {/* Duration Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trip Duration (Days)
          </label>
          <select
            name="days"
            value={formData.days}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          >
            <option value="">Choose duration...</option>
            {durationDays.map((d) => (
              <option key={d.id} value={d.days}>
                {d.days} Days
              </option>
            ))}
          </select>
          {errors.days && <p className="text-red-500 text-sm mt-1">{errors.days}</p>}
        </div>

        {/* Transport Mode Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mode of Transport
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {transportModes.map((mode) => (
              <label
                key={mode.id}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  formData.transport === mode.name
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 hover:border-yellow-300'
                }`}
              >
                <input
                  type="radio"
                  name="transport"
                  value={mode.name}
                  checked={formData.transport === mode.name}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-gray-800">{mode.name}</span>
              </label>
            ))}
          </div>
          {errors.transport && <p className="text-red-500 text-sm mt-1">{errors.transport}</p>}
        </div>

        {/* Accommodation Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Accommodation Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(accommodation).map(([type, details]) => (
              <label
                key={type}
                className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition ${
                  formData.accommodation === type
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-300 hover:border-yellow-300'
                }`}
              >
                <input
                  type="radio"
                  name="accommodation"
                  value={type}
                  checked={formData.accommodation === type}
                  onChange={handleInputChange}
                  className="hidden"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-800">{type}</p>
                  <p className="text-xs text-gray-600">₹{details.costPerNight}/night</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-yellow-400 to-red-500 hover:from-yellow-500 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          {loading ? 'Planning Itinerary...' : 'Plan My Itinerary'}
        </button>
      </form>
    </div>
  );
};

export default ItineraryForm;
