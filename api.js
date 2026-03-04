import axios from 'axios';

// Base API URL - uses proxy in development
const API_BASE_URL = '/api';

// Create axios instance with defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds for AI responses
  headers: {
    'Content-Type': 'application/json'
  }
});

// Itinerary API
export const generateItinerary = async (tripData) => {
  try {
    const response = await api.post('/itinerary', tripData);
    return response.data;
  } catch (error) {
    console.error('Itinerary API error:', error);
    throw error.response?.data || { error: 'Failed to generate itinerary' };
  }
};

// Weather API
export const getWeather = async (city) => {
  try {
    const response = await api.get(`/weather/${encodeURIComponent(city)}`);
    return response.data;
  } catch (error) {
    console.error('Weather API error:', error);
    throw error.response?.data || { error: 'Failed to fetch weather' };
  }
};

// Coordinates API
export const getCoordinates = async (city) => {
  try {
    const response = await api.get(`/coordinates/${encodeURIComponent(city)}`);
    return response.data;
  } catch (error) {
    console.error('Coordinates API error:', error);
    throw error.response?.data || { error: 'Failed to get coordinates' };
  }
};

export default api;

