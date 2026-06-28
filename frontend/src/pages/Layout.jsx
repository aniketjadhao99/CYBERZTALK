import React, { useState } from 'react';
import { useConsultation } from '../context/ConsultationContext';
import LawyerRegistrationForm from '../components/LawyerRegistrationForm';

export default function Layout({ onSelectRole }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    selectedRole: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useConsultation();

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, selectedRole: role });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVictimSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.selectedRole) {
      alert('Please fill all fields and select a role');
      return;
    }

    // Create victim user object
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
    };

    // Login user
    loginUser(user, formData.selectedRole);
    onSelectRole();
  };

  const handleLawyerSubmit = async (lawyerData) => {
    setIsLoading(true);
    try {
      // Send lawyer registration to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/lawyers/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lawyerData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const registeredLawyer = await response.json();

      // Create user object for lawyer
      const user = {
        id: registeredLawyer.data.userId,
        name: lawyerData.name,
        email: lawyerData.email,
        lawyerId: registeredLawyer.data._id,
      };

      // Login user
      loginUser(user, 'Lawyer');
      onSelectRole();
    } catch (error) {
      console.error('Lawyer registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-4 sm:top-20 sm:right-20 w-48 h-48 sm:w-72 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-4 sm:bottom-20 sm:left-20 w-48 h-48 sm:w-72 sm:h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl w-full">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12 px-2">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl sm:text-4xl">⚖️</span>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-3 sm:mb-4">
            CyberZtalk
          </h1>
          <p className="text-base sm:text-xl text-slate-300 mb-2">
            Real-Time Legal Consultation for Cybercrime Victims
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            Connect with verified cybercrime lawyers instantly • Get expert legal advice 24/7 •
            Secure & Confidential
          </p>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Side - Role Selection */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Choose Your Role</h2>

            {/* Role Cards */}
            <div className="space-y-4">
              {/* Victim Card */}
              <button
                onClick={() => handleRoleSelect('Victim')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.selectedRole === 'Victim'
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/30'
                    : 'border-slate-600 bg-slate-800/50 hover:border-blue-400 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🛡️</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">I'm a Victim</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Seek legal advice on cybercrime incidents
                    </p>
                  </div>
                </div>
              </button>

              {/* Lawyer Card */}
              <button
                onClick={() => handleRoleSelect('Lawyer')}
                className={`p-4 sm:p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.selectedRole === 'Lawyer'
                    ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/30'
                    : 'border-slate-600 bg-slate-800/50 hover:border-cyan-400 hover:bg-slate-700/50'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">👨‍⚖️</div>
                  <div>
                    <h3 className="text-white font-bold text-lg">I'm a Lawyer</h3>
                    <p className="text-slate-400 text-sm mt-1">
                      Offer cybercrime legal consultation services
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-blue-500/30 rounded-xl p-4 sm:p-8 backdrop-blur-xl max-h-[85vh] overflow-y-auto">
            {formData.selectedRole === 'Lawyer' ? (
              <LawyerRegistrationForm onSubmit={handleLawyerSubmit} isLoading={isLoading} />
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>

                <form onSubmit={handleVictimSubmit} className="space-y-5">
                  {/* Name Input */}
                  <div>
                    <label className="text-white font-semibold block mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="text-white font-semibold block mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
                      required
                    />
                  </div>

                  {/* Role Status */}
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <p className="text-slate-400 text-sm mb-2">Selected Role</p>
                    {formData.selectedRole ? (
                      <p className="text-white font-semibold text-lg">
                        {formData.selectedRole === 'Victim' ? '🛡️ Cybercrime Victim' : '👨‍⚖️ Legal Expert'}
                      </p>
                    ) : (
                      <p className="text-slate-500 text-sm">Please select a role above</p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      className="mt-1 w-4 h-4 bg-slate-700 border border-blue-500/30 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="text-slate-400 text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!formData.selectedRole}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold py-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50 text-lg"
                  >
                    Enter CyberZtalk Platform →
                  </button>
                </form>

                {/* Info Footer */}
                <div className="mt-6 pt-6 border-t border-slate-700/50">
                  <p className="text-slate-400 text-xs text-center">
                    ✓ 256-bit SSL Encrypted • ✓ Verified Legal Professionals • ✓ 24/7 Support
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 sm:mt-12 mx-1 sm:mx-0 bg-gradient-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-500/20 rounded-xl p-4 sm:p-6 text-center">
          <p className="text-yellow-300 font-semibold mb-2">🚨 Emergency Assistance?</p>
          <p className="text-slate-300">
            If you're in immediate danger, please contact local law enforcement or your nearest
            cybercrime reporting center.
          </p>
        </div>
      </div>
    </div>
  );
}
