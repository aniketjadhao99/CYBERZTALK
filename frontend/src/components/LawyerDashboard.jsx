import React, { useState, useEffect } from 'react';
import { useConsultation } from '../context/ConsultationContext';

export default function LawyerDashboard({ onProfileClick }) {
  const {
    currentUser,
    incomingCrisisAlerts,
    acceptConsultation,
    denyConsultation,
    clearMessage,
    error,
    successMessage,
  } = useConsultation();

  const [isOnline, setIsOnline] = useState(false);
  const [flashAnimation, setFlashAnimation] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch lawyer profile and availability status
  useEffect(() => {
    // In production, fetch actual lawyer status from API
    // For now, we'll use local state
  }, []);

  // Trigger dramatic flash when crisis alert arrives
  useEffect(() => {
    if (incomingCrisisAlerts.length > 0) {
      setFlashAnimation(true);
      const timer = setTimeout(() => setFlashAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [incomingCrisisAlerts]);

  const toggleAvailability = async (status) => {
    try {
      setIsOnline(!isOnline);
      // Emit socket event to update availability
      // socket?.emit('update_availability', { status: !isOnline ? 'Online' : 'Offline' });
    } catch (err) {
      console.error('Error updating availability:', err);
    }
  };

  const handleAccept = (alert) => {
    acceptConsultation(alert.sessionId, currentUser.id, alert.victimId);
  };

  const handleDeny = (alert) => {
    denyConsultation(alert.sessionId, alert.victimId, 'Lawyer declined');
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
                <p className="text-xs text-cyan-400">Lawyer Portal</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white font-semibold">{currentUser?.name}</p>
                <p className="text-sm text-slate-400">Cybercrime Expert</p>
              </div>
              <button
                onClick={() => onProfileClick && onProfileClick()}
                className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold hover:shadow-lg hover:shadow-cyan-500/50 transition"
                title="View Profile"
              >
                {currentUser?.name?.charAt(0) || 'L'}
              </button>
            </div>
            <button
              className="sm:hidden flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-700/90 text-white shadow-sm shadow-slate-900/40"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Status & Settings */}
          <div className="lg:col-span-1">
            {/* Availability Card */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-blue-500/30 rounded-xl p-6 mb-6">
              <h3 className="text-white font-bold text-lg mb-4">Status</h3>

              {/* Status Toggle */}
              <div className="flex items-center justify-between mb-6 p-4 bg-slate-800/50 rounded-lg border border-blue-400/30">
                <span className={`font-semibold ${isOnline ? 'text-green-400' : 'text-slate-400'}`}>
                  {isOnline ? '🟢 Online' : '🔴 Offline'}
                </span>
                <button
                  onClick={() => toggleAvailability(!isOnline)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                    isOnline ? 'bg-green-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${
                      isOnline ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-lg border border-blue-400/20">
                  <p className="text-slate-400 text-xs mb-1">Today's Sessions</p>
                  <p className="text-white font-bold text-lg">3</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-blue-400/20">
                  <p className="text-slate-400 text-xs mb-1">Avg. Rating</p>
                  <p className="text-white font-bold text-lg">4.8 ★</p>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg border border-blue-400/20">
                  <p className="text-slate-400 text-xs mb-1">Response Time</p>
                  <p className="text-white font-bold text-lg">45s</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors">
                  View Profile
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors">
                  Download Reports
                </button>
                <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors">
                  Settings
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Crisis Alerts */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-white text-3xl font-bold">
                🚨 Incoming Crisis Alerts
                {incomingCrisisAlerts.length > 0 && (
                  <span className="ml-3 text-2xl animate-pulse">
                    ({incomingCrisisAlerts.length})
                  </span>
                )}
              </h2>
              <p className="text-slate-400 mt-2">
                Victims in need of immediate legal consultation
              </p>
            </div>

            {/* Crisis Alerts Container */}
            <div
              className={`transition-all duration-300 ${
                flashAnimation ? 'ring-4 ring-red-500/50 bg-red-900/20' : ''
              }`}
            >
              {incomingCrisisAlerts.length > 0 ? (
                <div className="space-y-4">
                  {incomingCrisisAlerts.map((alert) => (
                    <div
                      key={alert.sessionId}
                      className="bg-gradient-to-br from-red-900/40 to-slate-800/40 border-2 border-red-500 rounded-xl p-6 relative overflow-hidden group hover:border-red-400 transition-all duration-300"
                    >
                      {/* Animated background accent */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all duration-300" />

                      <div className="relative z-10">
                        {/* Alert Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <span className="text-2xl animate-pulse">🚨</span>
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg">
                                {alert.victimName}
                              </h3>
                              <p className="text-red-400 text-sm">Urgent Consultation Request</p>
                            </div>
                          </div>
                          <span className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full border border-red-500/50">
                            New
                          </span>
                        </div>

                        {/* Victim Contact Details */}
                        <div className="mb-4 p-4 bg-slate-900/30 rounded-lg border border-blue-400/20">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                            <div>
                              <p className="text-slate-400 text-xs mb-1">📧 Email</p>
                              <p className="text-white font-semibold text-sm break-all">{alert.victimEmail}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs mb-1">📱 Phone</p>
                              <p className="text-white font-semibold text-sm">{alert.victimPhone}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-slate-400 text-xs mb-1">⚖️ Crime Category</p>
                              <p className="text-cyan-400 font-semibold text-sm">{alert.crimeCategory}</p>
                            </div>
                            <div>
                              <p className="text-slate-400 text-xs mb-1">⏰ Requested At</p>
                              <p className="text-cyan-400 text-sm">
                                {new Date(alert.requestedAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Lawyer Matching Info */}
                        {alert.lawyerSpecializations && alert.lawyerSpecializations.length > 0 && (
                          <div className="mb-4 p-3 bg-slate-900/30 rounded-lg border border-green-400/20">
                            <p className="text-slate-400 text-xs mb-2">✓ Matching Specializations</p>
                            <div className="flex flex-wrap gap-2">
                              {alert.lawyerSpecializations.slice(0, 3).map((spec, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/30"
                                >
                                  {spec}
                                </span>
                              ))}
                              {alert.lawyerSpecializations.length > 3 && (
                                <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded border border-green-500/30">
                                  +{alert.lawyerSpecializations.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => handleAccept(alert)}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/50 flex items-center justify-center space-x-2"
                          >
                            <span>✓</span>
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleDeny(alert)}
                            className="flex-1 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-bold py-3 rounded-lg transition-all duration-200"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gradient-to-br from-slate-700/80 to-slate-800/80 border border-blue-500/30 rounded-xl p-12 text-center">
                  <div className="text-5xl mb-4">😌</div>
                  <p className="text-slate-300 text-lg font-semibold mb-2">
                    No Incoming Alerts
                  </p>
                  <p className="text-slate-400">
                    You're all caught up! Alerts will appear here when victims request your
                    consultation.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
