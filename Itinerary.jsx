import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { generateItinerary } from '../api';

const Itinerary = () => {
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Get trip data from sessionStorage
    const stored = sessionStorage.getItem('tripData');
    if (!stored) {
      navigate('/');
      return;
    }

    const data = JSON.parse(stored);
    setTripData(data);
    fetchItinerary(data);
  }, [navigate]);

  const fetchItinerary = async (data) => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateItinerary(data);
      setItinerary(result);
    } catch (err) {
      console.error('Error fetching itinerary:', err);
      setError(err.error || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="page itinerary-page"
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
            <span className="spinner-icon">🧳</span>
          </motion.div>
          <motion.div 
            className="loading-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="typing-dots">
              Generating your itinerary<span className="dots">...</span>
            </span>
          </motion.div>
          <div className="loading-progress">
            <motion.div 
              className="progress-bar"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="page itinerary-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="error-container">
          <motion.div 
            className="error-card glass-card"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <span className="error-icon">😔</span>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button 
                onClick={() => fetchItinerary(tripData)}
                className="retry-btn"
              >
                Try Again
              </button>
              <Link to="/" className="back-btn">
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="page itinerary-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="itinerary-container">
        {/* Header */}
        <motion.div 
          className="itinerary-header"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Link to="/" className="back-link">
            <span>←</span> Back to Home
          </Link>
          <h1 className="itinerary-title">
            <span className="title-icon">🗺️</span>
            {itinerary?.destination || tripData?.destination} Trip Plan
          </h1>
          <div className="trip-meta">
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              {tripData?.duration} Days
            </span>
            <span className="meta-item">
              <span className="meta-icon">👥</span>
              {tripData?.travelers} {tripData?.travelers === 1 ? 'Traveler' : 'Travelers'}
            </span>
            <span className="meta-item">
              <span className="meta-icon">🚗</span>
              {tripData?.travelMode.charAt(0).toUpperCase() + tripData?.travelMode.slice(1)}
            </span>
            <span className="meta-item">
              <span className="meta-icon">💰</span>
              {tripData?.budget.charAt(0).toUpperCase() + tripData?.budget.slice(1)}
            </span>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div 
          className="itinerary-tabs"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'days' ? 'active' : ''}`}
            onClick={() => setActiveTab('days')}
          >
            Day by Day
          </button>
          <Link to="/weather" className="tab-btn">
            🌤️ Weather
          </Link>
          <Link to="/maps" className="tab-btn">
            🗺️ Maps
          </Link>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              className="overview-section"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Summary Card */}
              <motion.div className="summary-card glass-card" variants={cardVariants}>
                <h2 className="section-title">
                  <span className="title-decoration">//</span> Trip Summary
                </h2>
                <div className="summary-grid">
                  <div className="summary-item">
                    <span className="summary-label">Total Estimated Cost</span>
                    <span className="summary-value cost">
                      {itinerary?.total_estimated_cost || '₹50,000'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Best Season</span>
                    <span className="summary-value">
                      {itinerary?.best_season || 'October - March'}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Local Transport</span>
                    <span className="summary-value">
                      {itinerary?.local_transport || 'Auto-rickshaw, Metro'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Food Specialties */}
              {itinerary?.food_specialties && (
                <motion.div className="food-card glass-card" variants={cardVariants}>
                  <h2 className="section-title">
                    <span className="title-decoration">//</span> Must Try Foods
                  </h2>
                  <div className="food-tags">
                    {itinerary.food_specialties.map((food, index) => (
                      <motion.span 
                        key={index}
                        className="food-tag"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        🍛 {food}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick Tips */}
              <motion.div className="tips-card glass-card" variants={cardVariants}>
                <h2 className="section-title">
                  <span className="title-decoration">//</span> Quick Tips
                </h2>
                <ul className="tips-list">
                  <li>Always carry bottled water</li>
                  <li>Respect local customs and dress modestly at religious places</li>
                  <li>Keep emergency numbers saved</li>
                  <li>Use registered taxi services</li>
                  <li>Try local street food from hygienic stalls</li>
                </ul>
              </motion.div>
            </motion.div>
          )}

          {activeTab === 'days' && (
            <motion.div 
              key="days"
              className="days-section"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              {itinerary?.days?.map((day, index) => (
                <motion.div 
                  key={index}
                  className="day-card glass-card"
                  variants={cardVariants}
                  custom={index}
                >
                  <div className="day-header">
                    <div className="day-number">
                      <span className="day-label">Day</span>
                      <span className="day-value">{day.day}</span>
                    </div>
                    <div className="day-time">
                      <span className="time-badge">{day.best_time || 'All Day'}</span>
                    </div>
                  </div>

                  <div className="day-content">
                    <div className="places-section">
                      <h3 className="subsection-title">
                        <span className="icon">📍</span> Places to Visit
                      </h3>
                      <div className="places-list">
                        {day.places?.map((place, pIndex) => (
                          <motion.span 
                            key={pIndex}
                            className="place-tag"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: pIndex * 0.1 }}
                          >
                            {place}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="activities-section">
                      <h3 className="subsection-title">
                        <span className="icon">🎯</span> Activities
                      </h3>
                      <ul className="activities-list">
                        {day.activities?.map((activity, aIndex) => (
                          <motion.li 
                            key={aIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: aIndex * 0.1 }}
                          >
                            {activity}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    <div className="day-footer">
                      <div className="cost-estimate">
                        <span className="cost-label">Estimated Cost:</span>
                        <span className="cost-value">{day.estimated_cost}</span>
                      </div>
                      {day.tips && day.tips.length > 0 && (
                        <div className="day-tips">
                          <span className="tip-icon">💡</span>
                          <span className="tip-text">{day.tips[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Itinerary;

