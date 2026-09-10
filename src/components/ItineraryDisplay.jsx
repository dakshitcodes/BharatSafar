import React from 'react';
import { saveItinerary } from '../services/itineraryService';
import toast from 'react-hot-toast';

const ItineraryDisplay = ({ itinerary, formData, user }) => {
  const handleSave = () => {
    saveItinerary({ ...formData, ...itinerary }, user?.id);
    toast.success('Itinerary saved successfully!');
  };

  const handleDownloadPDF = () => {
    const content = generatePDFContent();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `itinerary-${formData.state}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Itinerary downloaded!');
  };

  const generatePDFContent = () => {
    let content = 'TRIP ITINERARY\n';
    content += '='.repeat(50) + '\n\n';
    content += `Location: ${formData.state}\n`;
    content += `Duration: ${itinerary.totalDuration} days\n`;
    content += `Transport: ${formData.transport}\n`;
    content += `Total Cost: ₹${itinerary.totalCost.toLocaleString('en-IN')}\n\n`;
    
    content += 'DAILY SCHEDULE:\n';
    content += '-'.repeat(50) + '\n';
    itinerary.schedule.forEach((day) => {
      content += `Day ${day.day}: ${day.activity}\n`;
    });

    return content;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-b from-orange-50 to-white rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-yellow-500 to-red-600 bg-clip-text text-transparent">
        Your Itinerary
      </h2>

      {/* Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
          <h3 className="text-2xl font-bold text-yellow-600 mb-4">Total Cost</h3>
          <p className="text-4xl font-bold text-gray-800">₹{itinerary.totalCost.toLocaleString('en-IN')}</p>
          <p className="text-sm text-gray-600 mt-2">For {itinerary.totalDuration} days</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Cost Breakdown</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Accommodation:</span>
              <span className="font-semibold">₹{itinerary.breakdown.accommodation.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Site Visits:</span>
              <span className="font-semibold">₹{itinerary.breakdown.sites.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Transport:</span>
              <span className="font-semibold">₹{itinerary.breakdown.transport.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Meals:</span>
              <span className="font-semibold">₹{itinerary.breakdown.meals.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="font-bold">Miscellaneous:</span>
              <span className="font-bold">₹{itinerary.breakdown.miscellaneous.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Daily Schedule</h3>
        <div className="space-y-3">
          {itinerary.schedule.map((day) => (
            <div
              key={day.day}
              className={`p-4 rounded-lg border-l-4 ${
                day.type === 'site'
                  ? 'border-purple-500 bg-purple-50'
                  : day.type === 'travel'
                  ? 'border-green-500 bg-green-50'
                  : 'border-yellow-500 bg-yellow-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-gray-800">Day {day.day}</p>
                  <p className="text-gray-700 font-medium">{day.activity}</p>
                  {day.description && <p className="text-sm text-gray-600 mt-1">{day.description}</p>}
                </div>
                <span className="text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded">₹{day.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-orange-50 p-6 rounded-lg shadow-md border border-orange-200 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Travel Tips & Recommendations</h3>
        <ul className="space-y-2">
          {itinerary.recommendations.map((rec, index) => (
            <li key={index} className="flex items-start">
              <span className="text-yellow-600 font-bold mr-3">✓</span>
              <span className="text-gray-700">{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Save Itinerary
        </button>
        <button
          onClick={handleDownloadPDF}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Download Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
