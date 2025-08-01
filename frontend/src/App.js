import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReportForm from './components/ReportForm';
import Map from './components/Map';
import EmergencyButton from './components/EmergencyButton';
import About from './components/About';
import SafetyTips from './components/SafetyTips';
import Contact from './components/Contact';
import CrimeNews from './components/CrimeNews';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/safety-tips" element={<SafetyTips />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/" element={
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700">
                    <ReportForm selectedLocation={selectedLocation} />
                  </div>
                  <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-gray-700 flex flex-col">
                    <Map onLocationSelect={handleLocationSelect} modalOpen={emergencyModalOpen} />
                    <CrimeNews />
                  </div>
                </div>
              </>
            } />
          </Routes>
          <div className="fixed bottom-8 right-8">
            <EmergencyButton modalOpen={emergencyModalOpen} setModalOpen={setEmergencyModalOpen} />
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App; 