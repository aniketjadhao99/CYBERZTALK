import React, { useState, useEffect } from 'react';
import { useConsultation } from '../context/ConsultationContext';

export default function VictimDashboard({ onProfileClick }) {
  const {
    currentUser,
    activeLawyers,
    setActiveLawyers,
    requestConsultation,
    isLoading,
    error,
    successMessage,
    clearMessage,
  } = useConsultation();

  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [requestingSessionId, setRequestingSessionId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const specializations = [
    'Financial Fraud',
    'Identity Theft',
    'Phishing',
    'Hacking & Unauthorized Access',
    'Malware & Ransomware',
    'Cyberstalking & Harassment',
    'Data Breach',
    'Cryptocurrency Fraud',
    'Online Defamation',
    'Other',
  ];

  // Fetch active lawyers on mount
  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/lawyers?status=Online`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const data = await response.json();
        if (data.success) {
          setActiveLawyers(data.data);
          setFilteredLawyers(data.data);
        }
      } catch (err) {
        console.error('Error fetching lawyers:', err);
      }
    };

    fetchLawyers();

    // Refresh every 30 seconds
    const interval = setInterval(fetchLawyers, 30000);
    return () => clearInterval(interval);
  }, [setActiveLawyers]);

  // Filter lawyers by specialization
  useEffect(() => {
    if (selectedSpecialization) {
      setFilteredLawyers(
        activeLawyers.filter((lawyer) =>
          lawyer.cybercrimeSpecializations.includes(selectedSpecialization)
        )
      );
    } else {
      setFilteredLawyers(activeLawyers);
    }
  }, [selectedSpecialization, activeLawyers]);

  // Load Botpress webchat for victim support
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
    script.defer = true;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleConsultRequest = async (lawyer) => {
    try {
      setRequestingSessionId(lawyer._id);

      // Create session in database first
      const sessionResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/sessions/create`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            victimId: currentUser.id,
            lawyerId: lawyer._id,
            crimeCategory: selectedSpecialization || 'Other',
          }),
        }
      );

      const sessionData = await sessionResponse.json();

      if (sessionData.success) {
        // Send request with complete victim details
        requestConsultation(
          lawyer._id,
          selectedSpecialization || 'Other',
          sessionData.data._id,
          currentUser.name,
          {
            victimId: currentUser.id,
            victimEmail: currentUser.email,
            victimPhone: currentUser.phone || 'Not provided',
            lawyerName: lawyer.name,
            lawyerSpecializations: lawyer.cybercrimeSpecializations,
          }
        );
      }
    } catch (err) {
      console.error('Error requesting consultation:', err);
    } finally {
      setRequestingSessionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800/80 backdrop-blur-md border-b border-blue-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-lg">⚖️</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-white truncate">CyberZtalk</h1>
                <p className="text-xs text-cyan-400">Legal Aid for Digital Crimes</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">{currentUser?.name}</p>
                <p className="text-sm text-slate-400">Victim</p>
              </div>
              <button
                onClick={() => onProfileClick && onProfileClick()}
                className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                title="View Profile"
              >
                {currentUser?.name?.charAt(0) || 'V'}
              </button>
            </div>
            <button
              className="sm:hidden inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-700/70 p-2 text-white"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>
          {isMenuOpen && (
            <div className="mt-3 rounded-lg border border-slate-600 bg-slate-900/95 p-3 sm:hidden">
              <button
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
                onClick={() => {
                  onProfileClick && onProfileClick();
                  setIsMenuOpen(false);
                }}
              >
                <span>View Profile</span>
                <span>→</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Alert Messages */}
      {error && (
        <div className="fixed top-24 right-4 bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-300 max-w-md animate-pulse">
          {error}
          <button
            onClick={clearMessage}
            className="float-right text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-24 right-4 bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-300 max-w-md">
          {successMessage}
          <button
            onClick={clearMessage}
            className="float-right text-green-400 hover:text-green-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* Warning Banner */}
      <div className="bg-yellow-600/20 border-l-4 border-yellow-500 p-4 mx-4 mt-6 rounded-r-lg">
        <div className="flex items-start space-x-3">
          <span className="text-yellow-500 text-2xl mt-1">⚠️</span>
          <div>
            <h3 className="text-yellow-400 font-semibold">Cybersecurity Alert</h3>
            <p className="text-yellow-300 text-sm">
              Never share sensitive personal information or financial details through chat. Our
              lawyers are verified professionals committed to your privacy and security.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="mb-8">
          <h2 className="text-white text-xl sm:text-2xl font-bold mb-4">Find Your Expert Lawyer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setSelectedSpecialization('')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedSpecialization === ''
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              All Categories
            </button>
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  selectedSpecialization === spec
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Lawyers Grid */}
        {filteredLawyers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredLawyers.map((lawyer) => (
              <div
                key={lawyer._id}
                className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-400/60 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                {/* Card Header */}
                <div className="relative h-24 bg-gradient-to-r from-blue-600 to-cyan-600">
                  <div className="absolute bottom-3 left-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-cyan-300 rounded-lg flex items-center justify-center text-2xl font-bold text-slate-900 border-2 border-white">
                      {lawyer.name.charAt(0)}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="pt-6 pb-4 px-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-bold text-lg">{lawyer.name}</h3>
                      <p className="text-cyan-400 text-sm">{lawyer.yearsOfExperience} years exp.</p>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-500/20 px-2 py-1 rounded">
                      <span className="text-yellow-400">★</span>
                      <span className="text-yellow-400 font-semibold text-sm">
                        {lawyer.averageRating.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-3 line-clamp-2">{lawyer.bio}</p>

                  {/* Specializations */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {lawyer.cybercrimeSpecializations.slice(0, 2).map((spec) => (
                      <span
                        key={spec}
                        className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-400/30"
                      >
                        {spec}
                      </span>
                    ))}
                    {lawyer.cybercrimeSpecializations.length > 2 && (
                      <span className="text-xs text-slate-400 px-2 py-1">
                        +{lawyer.cybercrimeSpecializations.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Pricing */}
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-slate-400 text-xs">Hourly Rate</p>
                      <p className="text-white font-bold text-lg">
                        ₹{lawyer.hourlyRate}
                        <span className="text-sm text-slate-400">/hr</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded">
                      <span className="text-green-400 text-xs font-semibold">● Online</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleConsultRequest(lawyer)}
                    disabled={requestingSessionId === lawyer._id || isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-3 rounded-lg transition-all duration-200 animate-pulse hover:animate-none shadow-lg hover:shadow-emerald-500/50 flex items-center justify-center space-x-2"
                  >
                    <span>⚡</span>
                    <span>
                      {requestingSessionId === lawyer._id
                        ? 'Requesting...'
                        : 'Consult Instantly'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <p className="text-slate-400 text-lg">No lawyers available for this category.</p>
            <p className="text-slate-500 text-sm mt-2">Try a different specialization.</p>
          </div>
        )}
      </div>
    </div>
  );
}
