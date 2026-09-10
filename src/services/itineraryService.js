import { calculateItineraryDetails } from '../utils/itineraryCalculator';

export const planItinerary = (formData) => {
  try {
    const itineraryDetails = calculateItineraryDetails(formData);
    return {
      success: true,
      data: itineraryDetails,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const saveItinerary = (itinerary, userId) => {
  // Save to localStorage or API
  const itineraries = JSON.parse(localStorage.getItem('userItineraries') || '[]');
  itineraries.push({
    id: Date.now(),
    ...itinerary,
    createdAt: new Date().toISOString(),
  });
  localStorage.setItem('userItineraries', JSON.stringify(itineraries));
  return true;
};

export const getUserItineraries = () => {
  return JSON.parse(localStorage.getItem('userItineraries') || '[]');
};
