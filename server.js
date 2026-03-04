const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Groq API Integration for Itinerary Generation
app.post('/api/itinerary', async (req, res) => {
  try {
    const { destination, duration, budget, travelMode } = req.body;

    if (!destination || !duration || !budget || !travelMode) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const prompt = `Generate a detailed travel itinerary for ${destination}, India.
    Duration: ${duration} days
    Budget: ${budget}
    Travel Mode: ${travelMode}
    
    STRICT JSON OUTPUT ONLY - No text before or after. Use this exact format:
    {
      "destination": "${destination}",
      "days": [
        {
          "day": 1,
          "places": ["Place name 1", "Place name 2"],
          "activities": ["Activity description"],
          "estimated_cost": "₹X,XXX",
          "best_time": "morning/afternoon/evening",
          "tips": ["tip 1", "tip 2"]
        }
      ],
      "total_estimated_cost": "₹XX,XXX",
      "best_season": "season to visit",
      "local_transport": "suggested local transport",
      "food_specialties": ["dish 1", "dish 2"]
    }
    
    Make it realistic and specific to ${destination}. Include famous landmarks, local experiences, and practical tips.`;

    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse JSON from response
    let itinerary;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        itinerary = JSON.parse(jsonMatch[0]);
      } else {
        itinerary = JSON.parse(content);
      }
    } catch (parseError) {
      console.error('Parse error:', parseError);
      return res.status(500).json({ 
        error: 'Failed to parse itinerary response',
        raw: content 
      });
    }

    res.json(itinerary);
  } catch (error) {
    console.error('Groq API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to generate itinerary',
      details: error.response?.data?.error?.message || error.message 
    });
  }
});

// Weather API Integration
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    if (!process.env.OPENWEATHER_API_KEY) {
      return res.status(500).json({ error: 'Weather API key not configured' });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},India&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );

    const data = response.data;
    res.json({
      city: data.name,
      temperature: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      wind_speed: data.wind.speed,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      country: data.sys.country,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone
    });
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      details: error.response?.data?.message || error.message 
    });
  }
});

// India cities coordinates for Maps
app.get('/api/coordinates/:city', async (req, res) => {
  try {
    const { city } = req.params;
    
    // Common India cities coordinates
    const cities = {
      'delhi': { lat: 28.7041, lng: 77.1025, name: 'New Delhi' },
      'mumbai': { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
      'bangalore': { lat: 12.9716, lng: 77.5946, name: 'Bengaluru' },
      'chennai': { lat: 13.0827, lng: 80.2707, name: 'Chennai' },
      'kolkata': { lat: 22.5726, lng: 88.3639, name: 'Kolkata' },
      'hyderabad': { lat: 17.3850, lng: 78.4867, name: 'Hyderabad' },
      'jaipur': { lat: 26.9124, lng: 75.7873, name: 'Jaipur' },
      'agra': { lat: 27.1767, lng: 78.0081, name: 'Agra' },
      'goa': { lat: 15.2993, lng: 74.1240, name: 'Goa' },
      'kerala': { lat: 10.8505, lng: 76.2711, name: 'Kerala' },
      'varanasi': { lat: 25.3176, lng: 82.9739, name: 'Varanasi' },
      'udaipur': { lat: 24.5854, lng: 73.7125, name: 'Udaipur' },
      'amritsar': { lat: 31.6340, lng: 74.8723, name: 'Amritsar' },
      'shimla': { lat: 31.1048, lng: 77.1734, name: 'Shimla' },
      'leh': { lat: 34.1526, lng: 77.5780, name: 'Leh' },
      'darjeeling': { lat: 27.0369, lng: 88.2622, name: 'Darjeeling' },
      'ooty': { lat: 11.4102, lng: 76.6950, name: 'Ooty' },
      'mysore': { lat: 12.2958, lng: 76.6394, name: 'Mysore' },
      'pune': { lat: 18.5204, lng: 73.8567, name: 'Pune' },
      'ahmedabad': { lat: 23.0225, lng: 72.5714, name: 'Ahmedabad' }
    };

    const cityKey = city.toLowerCase().replace(/\s+/g, '');
    
    if (cities[cityKey]) {
      return res.json(cities[cityKey]);
    }

    // If city not found, try to get from OpenWeatherMap
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},India&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
      );
      
      if (response.data && response.data.length > 0) {
        return res.json({
          lat: response.data[0].lat,
          lng: response.data[0].lon,
          name: response.data[0].name
        });
      }
    } catch (geoError) {
      console.error('Geo error:', geoError.message);
    }

    // Default to Delhi if not found
    res.json(cities['delhi']);
  } catch (error) {
    console.error('Coordinates error:', error.message);
    res.json({ lat: 28.7041, lng: 77.1025, name: 'New Delhi' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/itinerary - Generate travel itinerary');
  console.log('  GET  /api/weather/:city - Get weather data');
  console.log('  GET  /api/coordinates/:city - Get city coordinates');
});

