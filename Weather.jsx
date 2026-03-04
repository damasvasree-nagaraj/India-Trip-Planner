import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getWeather } from '../api';

const Weather = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    // Get trip data from sessionStorage
    const stored = sessionStorage.getItem('tripData');
    if (stored) {
      const data = JSON.parse(stored);
      setCity(data.destination);
      setSearchCity(data.destination);
      fetchWeather(data.destination);
    } else {
      setCity('Delhi');
      setSearchCity('Delhi');
      fetchWeather('Delhi');
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Auto refresh every 60 seconds
  useEffect(() => {
    if (city) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Set up new interval
      intervalRef.current = setInterval(() => {
        console.log('Auto-refreshing weather data...');
        fetchWeather(city, false);
      }, 60000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [city]);

  const fetchWeather = async (cityName, showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const result = await getWeather(cityName);
      setWeather(result);
      setLastUpdated(new Date());
      setCity(cityName);
    } catch (err) {
      console.error('Weather error:', err);
      setError(err.error || 'Failed to fetch weather data');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return icons[condition] || '🌤️';
  };

  const getBackgroundGradient = () => {
    if (!weather) return '';
    const temp = weather.temperature;
    if (temp > 30) return 'weather-hot';
    if (temp > 20) return 'weather-warm';
    if (temp > 10) return 'weather-mild';
    return 'weather-cold';
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading && !weather) {
    return (
      <motion.div 
        className="page weather-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="loading-container">
          <motion.div 
            className="loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <span className="spinner-icon">🌤️</span>
          </motion.div>
          <motion.div 
            className="loading-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Fetching weather data...
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className={`page weather-page ${getBackgroundGradient()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="weather-container">
        {/* Header */}
        <motion.div 
          className="weather-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link to="/itinerary" className="back-link">
            <span>←</span> Back to Itinerary
          </Link>
          <h1 className="weather-title">
            <span className="title-icon">🌤️</span>
            Live Weather
          </h1>
        </motion.div>

        {/* Search */}
        <motion.form 
          className="weather-search"
          onSubmit={handleSearch}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="Search city in India..."
            className="glass-input weather-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </motion.form>

        {error && (
          <motion.div 
            className="error-message glass-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="error-icon">⚠️</span>
            {error}
            <button onClick={() => fetchWeather(city)} className="retry-link">
              Try Again
            </button>
          </motion.div>
        )}

        {weather && (
          <motion.div 
            className="weather-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Weather Card */}
            <motion.div 
              className="main-weather-card glass-card"
              variants={itemVariants}
            >
              <div className="weather-main">
                <div className="weather-city">
                  <h2>{weather.city}</h2>
                  <span className="country-code">{weather.country}</span>
                </div>
                <div className="weather-temp">
                  <span className="temp-value">{weather.temperature}</span>
                  <span className="temp-unit">°C</span>
                </div>
                <div className="weather-condition">
                  <span className="condition-icon">{getWeatherIcon(weather.weather)}</span>
                  <span className="condition-text">{weather.weather}</span>
                  <span className="condition-desc">{weather.description}</span>
                </div>
              </div>
              
              <div className="feels-like">
                Feels like {weather.feels_like}°C
              </div>
            </motion.div>

            {/* Weather Details Grid */}
            <motion.div 
              className="weather-details"
              variants={itemVariants}
            >
              <div className="detail-card glass-card">
                <span className="detail-icon">💧</span>
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.humidity}%</span>
              </div>
              <div className="detail-card glass-card">
                <span className="detail-icon">💨</span>
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.wind_speed} m/s</span>
              </div>
              <div className="detail-card glass-card">
                <span className="detail-icon">🌡️</span>
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.pressure} hPa</span>
              </div>
              <div className="detail-card glass-card">
                <span className="detail-icon">🌅</span>
                <span className="detail-label">Sunrise</span>
                <span className="detail-value">{formatTime(weather.sunrise)}</span>
              </div>
              <div className="detail-card glass-card">
                <span className="detail-icon">🌇</span>
                <span className="detail-label">Sunset</span>
                <span className="detail-value">{formatTime(weather.sunset)}</span>
              </div>
              <div className="detail-card glass-card">
                <span className="detail-icon">🌍</span>
                <span className="detail-label">Timezone</span>
                <span className="detail-value">UTC {weather.timezone / 3600}</span>
              </div>
            </motion.div>

            {/* Auto Refresh Info */}
            <motion.div 
              className="refresh-info"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="refresh-indicator">
                <span className="pulse-dot"></span>
                <span>Auto-refreshing every 60 seconds</span>
              </div>
              {lastUpdated && (
                <span className="last-updated">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </motion.div>

            {/* Weather Tips */}
            <motion.div 
              className="weather-tips glass-card"
              variants={itemVariants}
            >
              <h3>🌡️ Weather Tips</h3>
              <ul>
                {weather.temperature > 30 && (
                  <li>Hot weather! Stay hydrated and use sunscreen ☀️</li>
                )}
                {weather.temperature > 20 && weather.temperature <= 30 && (
                  <li> Pleasant weather for sightseeing! Enjoy your trip 🌤️</li>
                )}
                {weather.temperature <= 20 && (
                  <li>Cool weather! Carry a light jacket 🧥</li>
                )}
                {weather.humidity > 70 && (
                  <li>High humidity - stay cool and avoid strenuous activities 💦</li>
                )}
                {weather.weather === 'Rain' && (
                  <li>Rain expected - carry an umbrella or raincoat 🌂</li>
                )}
                <li>Check back for updated weather conditions regularly</li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Weather;

