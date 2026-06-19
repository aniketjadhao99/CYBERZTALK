// Cyberztalk Frontend Integration
// This file contains utilities for connecting to the backend API

export const storeAuthToken = (token) => {
    localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('authToken');
};

export const clearAuthToken = () => {
    localStorage.removeItem('authToken');
};

export const getAuthHeader = () => {
    const token = getAuthToken();
    if (!token) return {};
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Fetch wrapper with error handling
export const fetchWithAuth = async (url, options = {}) => {
    const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
        ...options.headers
    };

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        if (response.status === 401) {
            clearAuthToken();
            window.location.href = '/login.html';
        }
        throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
};

// Dashboard initialization
export const initializeDashboard = async () => {
    try {
        // Fetch dashboard statistics
        const response = await fetchWithAuth('http://localhost:5000/api/cases/stats');
        if (response.success) {
            updateDashboardUI(response.data);
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
};

// Update dashboard UI with data
export const updateDashboardUI = (stats) => {
    // Update stat cards
    const totalCasesEl = document.querySelector('[data-stat="totalCases"]');
    const newCasesEl = document.querySelector('[data-stat="newCases"]');
    const activeCasesEl = document.querySelector('[data-stat="activeCases"]');
    const resolvedCasesEl = document.querySelector('[data-stat="resolvedCases"]');
    const highPriorityEl = document.querySelector('[data-stat="highPriority"]');

    if (totalCasesEl) totalCasesEl.textContent = stats.totalCases || 0;
    if (newCasesEl) newCasesEl.textContent = stats.newCases || 0;
    if (activeCasesEl) activeCasesEl.textContent = stats.activeCases || 0;
    if (resolvedCasesEl) resolvedCasesEl.textContent = stats.resolvedCases || 0;
    if (highPriorityEl) highPriorityEl.textContent = stats.highPriorityCases || 0;
};

// Load user profile
export const loadUserProfile = async () => {
    try {
        const response = await fetchWithAuth('http://localhost:5000/api/auth/me');
        if (response.success) {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
};

// Load cases
export const loadCases = async (filters = {}) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const url = `http://localhost:5000/api/cases/all?${queryString}`;
        const response = await fetchWithAuth(url);
        return response;
    } catch (error) {
        console.error('Error loading cases:', error);
        throw error;
    }
};

// Create new case
export const createIncidentCase = async (caseData) => {
    try {
        const response = await fetchWithAuth('http://localhost:5000/api/cases/create', {
            method: 'POST',
            body: JSON.stringify(caseData)
        });
        return response;
    } catch (error) {
        console.error('Error creating case:', error);
        throw error;
    }
};

// Load resources
export const loadResources = async (filters = {}) => {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const url = `http://localhost:5000/api/resources/all?${queryString}`;
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('Error loading resources:', error);
        throw error;
    }
};

// Load featured resources
export const loadFeaturedResources = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/resources/featured');
        return await response.json();
    } catch (error) {
        console.error('Error loading featured resources:', error);
        throw error;
    }
};

// Socket.io connection for real-time chat
export const initializeSocket = () => {
    const socket = io('http://localhost:5000', {
        auth: {
            token: getAuthToken()
        }
    });

    socket.on('connect', () => {
        console.log('✅ Connected to real-time server');
    });

    socket.on('receive-message', (data) => {
        // Handle incoming messages
        console.log('New message:', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ Disconnected from real-time server');
    });

    return socket;
};

export default {
    storeAuthToken,
    getAuthToken,
    clearAuthToken,
    fetchWithAuth,
    initializeDashboard,
    loadUserProfile,
    loadCases,
    createIncidentCase,
    loadResources,
    loadFeaturedResources,
    initializeSocket
};
