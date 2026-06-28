import React, { useState, useEffect, useRef } from 'react';
import { useConsultation } from '../context/ConsultationContext';

export default function ChatRoom() {
  const {
    currentUser,
    currentSession,
    chatMessages,
    isTyping,
    sendMessage,
    sendTypingIndicator,
    endSession,
    formatTime,
    sessionTimer,
    userRole,
  } = useConsultation();

  const [messageInput, setMessageInput] = useState('');
  const [isComposingReport, setIsComposingReport] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [report, setReport] = useState({
    rating: 5,
    feedback: '',
    lawyerNotes: '',
  });
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

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

  // Handle typing indicator
  const handleTyping = (e) => {
    setMessageInput(e.target.value);

    // Send typing indicator
    if (e.target.value.length === 1) {
      sendTypingIndicator(true);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(false);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      sendMessage(messageInput.trim());
      setMessageInput('');
      sendTypingIndicator(false);
    }
  };

  const handleEndSession = () => {
    setIsComposingReport(true);
  };

  const handleSubmitReport = () => {
    endSession(true);
    setIsComposingReport(false);
  };

  if (!currentSession) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-300 text-xl">No active consultation session</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Timer */}
      <header className="bg-slate-800/80 backdrop-blur-md border-b border-blue-500/30 p-4">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-bold">⚖️</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-white font-bold truncate">CyberZtalk Consultation</h1>
                <p className="text-cyan-400 text-sm">Session ID: {currentSession.roomId}</p>
              </div>
            </div>
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-lg border border-slate-600 bg-slate-700/70 p-2 text-white"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          </div>

          {/* Timer */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
            <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-3 sm:p-4 text-center">
              <p className="text-slate-400 text-xs mb-1">ELAPSED TIME</p>
              <div className="text-white font-mono text-xl sm:text-2xl font-bold">
                {formatTime(sessionTimer)}
              </div>
            </div>

            {/* User Info */}
            <div className="text-left sm:text-right">
              <p className="text-white font-semibold">{currentUser?.name}</p>
              <p className="text-cyan-400 text-sm">{userRole}</p>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-3 rounded-lg border border-slate-600 bg-slate-900/95 p-3 lg:hidden">
            <button
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-800"
              onClick={() => {
                setIsComposingReport(true);
                setIsMenuOpen(false);
              }}
            >
              <span>End & Report</span>
              <span>→</span>
            </button>
          </div>
        )}
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-slate-300 text-lg">Session started. Begin your conversation.</p>
            </div>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.senderId === currentUser.id
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                <p className="text-xs opacity-75 mb-1">
                  {msg.senderRole} • {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
                <p className="break-words">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-3 rounded-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Report Composition Modal */}
      {isComposingReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-500/30 rounded-xl max-w-2xl w-full mx-4 p-8">
            <h2 className="text-white text-2xl font-bold mb-6">Session Report & Feedback</h2>

            {/* Rating */}
            <div className="mb-6">
              <label className="text-white font-semibold block mb-2">
                Rate this Consultation (1-5 stars)
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReport({ ...report, rating: star })}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      star <= report.rating ? 'text-yellow-400' : 'text-slate-500'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div className="mb-6">
              <label className="text-white font-semibold block mb-2">Your Feedback</label>
              <textarea
                value={report.feedback}
                onChange={(e) => setReport({ ...report, feedback: e.target.value })}
                placeholder="Share your experience with this consultation..."
                rows="4"
                className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>

            {/* Lawyer Notes (if victim) */}
            {userRole === 'Lawyer' && (
              <div className="mb-6">
                <label className="text-white font-semibold block mb-2">
                  Session Notes & Case Summary
                </label>
                <textarea
                  value={report.lawyerNotes}
                  onChange={(e) => setReport({ ...report, lawyerNotes: e.target.value })}
                  placeholder="Document your findings, advice, and recommendations..."
                  rows="4"
                  className="w-full bg-slate-700/50 border border-blue-500/30 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
            )}

            {/* Session Summary */}
            <div className="bg-slate-700/50 border border-blue-500/20 rounded-lg p-4 mb-6">
              <p className="text-slate-300 text-sm">
                <span className="text-slate-400">Duration:</span>{' '}
                <span className="text-white font-semibold">{formatTime(sessionTimer)}</span>
              </p>
              <p className="text-slate-300 text-sm mt-2">
                <span className="text-slate-400">Messages:</span>{' '}
                <span className="text-white font-semibold">{chatMessages.length}</span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => setIsComposingReport(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReport}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-green-500/50"
              >
                End & Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Input Area */}
      <div className="bg-slate-800/80 backdrop-blur-md border-t border-blue-500/30 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={messageInput}
            onChange={handleTyping}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message here..."
            className="flex-1 bg-slate-700/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-blue-500/50"
            >
              Send
            </button>
            <button
              onClick={handleEndSession}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/50"
            >
              End & Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
