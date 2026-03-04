import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
import Weather from './pages/Weather';
import Maps from './pages/Maps';

// Global animated background component
const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      <div className="gradient-orb gradient-orb-1"></div>
      <div className="gradient-orb gradient-orb-2"></div>
      <div className="gradient-orb gradient-orb-3"></div>
      <div className="code-rain">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="code-line" style={{ 
            left: `${i * 5}%`, 
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}>
            {['const', 'let', 'function', 'return', 'import', 'export', 'async', 'await', 'class', 'interface'][Math.floor(Math.random() * 10)]}
          </div>
        ))}
      </div>
      <div className="grid-overlay"></div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <AnimatedBackground />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/itinerary" element={<Itinerary />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/maps" element={<Maps />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;

