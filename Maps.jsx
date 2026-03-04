import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { getCoordinates } from '../api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default marker icon
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Default center (India)
const defaultCenter = [28.7041, 77.1025];

const Maps = () => {
  const [destination, setDestination] = useState('');
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchCity, setSearchCity] = useState('');
  const [zoom, setZoom] = useState(12);

  // Get trip data from sessionStorage
  useEffect(() => {
    const stored = sessionStorage.getItem('tripData');
    if (stored) {
      const data = JSON.parse(stored);
      setDestination(data.destination);
      setSearchCity(data.destination);
      loadDestination(data.destination);
    } else {
      setDestination('Delhi');
      setSearchCity('Delhi');
      loadDestination('Delhi');
    }
  }, []);

  const loadDestination = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      const coords = await getCoordinates(cityName);
      const newCenter = [coords.lat, coords.lng];
      setMapCenter(newCenter);
      setMarkerPosition(newCenter);
      setDestination(coords.name);
      setZoom(12);
    } catch (err) {
      console.error('Error loading destination:', err);
      setError('Failed to load destination coordinates');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      loadDestination(searchCity.trim());
    }
  };

  const handleLocationClick = (city) => {
    setSearchCity(city);
    loadDestination(city);
  };

  const popularCities = [
    'Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Varanasi', 
    'Bangalore', 'Chennai', 'Kolkata', 'Udaipur'
  ];

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

  return (
    <motion.div 
      className="page maps-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="maps-container">
        {/* Header */}
        <motion.div 
          className="maps-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link to="/itinerary" className="back-link">
            <span>←</span> Back to Itinerary
          </Link>
          <h1 className="maps-title">
            <span className="title-icon">🗺️</span>
            Interactive Map
          </h1>
        </motion.div>

        {/* Search and Quick Locations */}
        <motion.div 
          className="maps-controls"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSearch} className="maps-search">
            <input
              type="text"
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search location in India..."
              className="glass-input"
            />
            <button type="submit" className="search-btn">
              Locate
            </button>
          </form>

          <div className="quick-locations">
            <span className="quick-locations-label">Quick Access:</span>
            {popularCities.map((city) => (
              <button
                key={city}
                className={`location-chip ${destination === city ? 'active' : ''}`}
                onClick={() => handleLocationClick(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div 
          className="map-wrapper"
          variants={itemVariants}
        >
          {loading ? (
            <div className="map-loading glass-card">
              <motion.div 
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <span className="spinner-icon">🗺️</span>
              </motion.div>
              <span>Loading map...</span>
            </div>
          ) : (
            <div className="leaflet-container glass-card">
              <MapContainer 
                center={mapCenter} 
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '500px', width: '100%', borderRadius: '16px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={markerPosition}>
                  <Popup>
                    <div style={{ textAlign: 'center', padding: '5px' }}>
                      <strong style={{ fontSize: '16px' }}>{destination}</strong>
                      <br />
                      <span>📍 India</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </motion.div>

        {/* Map Info */}
        <motion.div 
          className="map-info glass-card"
          variants={itemVariants}
        >
          <div className="info-header">
            <span className="info-icon">📍</span>
            <h3>{destination}, India</h3>
          </div>
          <p className="info-coords">
            Coordinates: {markerPosition[0].toFixed(4)}°N, {markerPosition[1].toFixed(4)}°E
          </p>
          <div className="map-controls-info">
            <span>🖱️ Scroll to zoom</span>
            <span>✋ Drag to pan</span>
            <span>👆 Click marker for info</span>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="quick-actions"
          variants={itemVariants}
        >
          <Link to="/weather" className="action-btn glass-card">
            <span className="action-icon">🌤️</span>
            <span className="action-text">Check Weather</span>
          </Link>
          <Link to="/itinerary" className="action-btn glass-card">
            <span className="action-icon">🗂️</span>
            <span className="action-text">View Itinerary</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Maps;

