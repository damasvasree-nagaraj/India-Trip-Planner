import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: '',
    travelers: 1,
    travelMode: 'car',
    budget: 'medium',
    duration: 3
  });
  const [isTyping, setIsTyping] = useState(true);
  const [typedText, setTypedText] = useState('');
  const fullText = 'Plan your perfect India adventure';

  // Typing effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'travelers' || name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.destination.trim()) {
      return;
    }
    // Store trip data in sessionStorage for Itinerary page
    sessionStorage.setItem('tripData', JSON.stringify(formData));
    navigate('/itinerary');
  };

  const popularDestinations = [
    'Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Varanasi', 
    'Udaipur', 'Kerala', 'Shimla', 'Leh', 'Darjeeling', 'Ooty'
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
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
      className="page home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="home-container">
        {/* Header Section */}
        <motion.div 
          className="hero-section"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="logo-container">
            <span className="logo-icon">🧳</span>
            <h1 className="main-title">
              <span className="title-text">India Trip</span>
              <span className="title-accent">Planner</span>
            </h1>
          </div>
          <div className="typing-container">
            <code className="typing-code">{typedText}</code>
            <span className="cursor">|</span>
          </div>
          <p className="hero-subtitle">
            AI-powered travel itineraries for your perfect India adventure
          </p>
        </motion.div>

        {/* Form Section */}
        <motion.div 
          className="form-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <form onSubmit={handleSubmit} className="trip-form">
            <motion.div className="form-group" variants={itemVariants}>
              <label htmlFor="destination">
                <span className="label-icon">📍</span>
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="Enter city in India..."
                required
                autoComplete="off"
                className="glass-input"
              />
              <div className="quick-destinations">
                {popularDestinations.slice(0, 6).map((city) => (
                  <button
                    key={city}
                    type="button"
                    className="quick-chip"
                    onClick={() => setFormData(prev => ({ ...prev, destination: city }))}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="form-row" variants={itemVariants}>
              <div className="form-group">
                <label htmlFor="duration">
                  <span className="label-icon">📅</span>
                  Duration (days)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  min="1"
                  max="30"
                  className="glass-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="travelers">
                  <span className="label-icon">👥</span>
                  Travelers
                </label>
                <input
                  type="number"
                  id="travelers"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  className="glass-input"
                />
              </div>
            </motion.div>

            <motion.div className="form-row" variants={itemVariants}>
              <div className="form-group">
                <label htmlFor="travelMode">
                  <span className="label-icon">🚗</span>
                  Travel Mode
                </label>
                <select
                  id="travelMode"
                  name="travelMode"
                  value={formData.travelMode}
                  onChange={handleChange}
                  className="glass-select"
                >
                  <option value="car">🚗 Car</option>
                  <option value="train">🚂 Train</option>
                  <option value="flight">✈️ Flight</option>
                  <option value="bike">🏍️ Bike</option>
                  <option value="bus">🚌 Bus</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget">
                  <span className="label-icon">💰</span>
                  Budget
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="glass-select"
                >
                  <option value="low">💵 Low (Budget)</option>
                  <option value="medium">💰 Medium</option>
                  <option value="luxury">💎 Luxury</option>
                </select>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              <span className="btn-text">Generate Itinerary</span>
              <span className="btn-icon">→</span>
              <div className="btn-glow"></div>
            </motion.button>
          </form>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          className="features-preview"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <div className="feature-card">
            <span className="feature-icon">🤖</span>
            <span className="feature-text">AI Itinerary</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🌤️</span>
            <span className="feature-text">Live Weather</span>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🗺️</span>
            <span className="feature-text">Interactive Maps</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;

