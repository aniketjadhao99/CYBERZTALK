import React, { useState, useEffect } from 'react';
import { useConsultation } from '../context/ConsultationContext';

export default function UserProfile({ onBackClick }) {
  const { currentUser, userRole, logoutUser } = useConsultation();
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    bio: currentUser?.bio || '',
  });

  // Load Botpress webchat for victim support (only if victim)
  useEffect(() => {
    if (userRole === 'Victim') {
      const script = document.createElement('script');
      script.src = 'https://cdn.botpress.cloud/webchat/v3.2/inject.js';
      script.defer = true;
      script.async = true;
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [userRole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Update profile logic here
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logoutUser();
    }
  };

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">My Profile</h1>
          <div className="flex items-center gap-2">
            <button
              className="sm:hidden flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-slate-600 bg-slate-800/90 text-white shadow-sm shadow-slate-950/40"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
            >
              ← Back
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mb-4 rounded-lg border border-slate-700 bg-slate-900/90 p-3 sm:hidden">
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              onClick={() => {
                handleBack();
                setIsMenuOpen(false);
              }}
            >
              <span>Go back</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-slate-900 rounded-lg p-4 sm:p-8 border border-slate-700">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl sm:text-4xl mr-0 sm:mr-6 mb-4 sm:mb-0">
              {currentUser?.name?.charAt(0) || '👤'}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
              <p className="text-cyan-400">{userRole}</p>
              <p className="text-slate-400 text-sm">{currentUser?.email}</p>
            </div>
          </div>

          {/* Edit/View Mode */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {userRole === 'Lawyer' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Professional Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  ></textarea>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Email</p>
                  <p className="text-white font-semibold">{currentUser?.email}</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm">Phone</p>
                  <p className="text-white font-semibold">{currentUser?.phone || 'Not provided'}</p>
                </div>
              </div>

              {userRole === 'Lawyer' && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <p className="text-slate-400 text-sm mb-2">Professional Bio</p>
                  <p className="text-white">{formData.bio || 'No bio added yet'}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Stats (for Lawyers) */}
        {userRole === 'Lawyer' && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 text-center">
              <p className="text-slate-400 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold text-cyan-400">0</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 text-center">
              <p className="text-slate-400 text-sm">Average Rating</p>
              <p className="text-2xl font-bold text-cyan-400">-</p>
            </div>
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 text-center">
              <p className="text-slate-400 text-sm">Hourly Rate</p>
              <p className="text-2xl font-bold text-cyan-400">-</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
