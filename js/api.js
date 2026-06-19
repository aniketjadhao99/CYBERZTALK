// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_TIMEOUT = 30000;

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const config = {
            ...options,
            headers,
            timeout: API_TIMEOUT
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    auth = {
        register: (userData) =>
            this.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            }),
        login: (credentials) =>
            this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
        getCurrentUser: () =>
            this.request('/auth/me', { method: 'GET' }),
        updateProfile: (profileData) =>
            this.request('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            })
    };

    // Case endpoints
    cases = {
        create: (caseData) =>
            this.request('/cases/create', {
                method: 'POST',
                body: JSON.stringify(caseData)
            }),
        getAll: (filters = {}) => {
            const queryString = new URLSearchParams(filters).toString();
            return this.request(`/cases/all?${queryString}`, { method: 'GET' });
        },
        getById: (caseId) =>
            this.request(`/cases/${caseId}`, { method: 'GET' }),
        getUserCases: (filters = {}) => {
            const queryString = new URLSearchParams(filters).toString();
            return this.request(`/cases/user?${queryString}`, { method: 'GET' });
        },
        updateStatus: (caseId, statusData) =>
            this.request(`/cases/${caseId}`, {
                method: 'PUT',
                body: JSON.stringify(statusData)
            }),
        getStats: () =>
            this.request('/cases/stats', { method: 'GET' })
    };

    // Chat endpoints
    chat = {
        createConversation: (conversationData) =>
            this.request('/chat/conversation/create', {
                method: 'POST',
                body: JSON.stringify(conversationData)
            }),
        getConversations: () =>
            this.request('/chat/conversations', { method: 'GET' }),
        getMessages: (conversationId, filters = {}) => {
            const queryString = new URLSearchParams(filters).toString();
            return this.request(`/chat/conversation/${conversationId}?${queryString}`, { method: 'GET' });
        },
        sendMessage: (messageData) =>
            this.request('/chat/message/send', {
                method: 'POST',
                body: JSON.stringify(messageData)
            }),
        markAsRead: (messageId) =>
            this.request(`/chat/message/${messageId}/read`, { method: 'PUT' })
    };

    // Resource endpoints
    resources = {
        getAll: (filters = {}) => {
            const queryString = new URLSearchParams(filters).toString();
            return this.request(`/resources/all?${queryString}`, { method: 'GET' });
        },
        getById: (resourceId) =>
            this.request(`/resources/${resourceId}`, { method: 'GET' }),
        getByCategory: (category, limit = 6) =>
            this.request(`/resources/category/${category}?limit=${limit}`, { method: 'GET' }),
        getFeatured: () =>
            this.request('/resources/featured', { method: 'GET' }),
        markHelpful: (resourceId, helpful) =>
            this.request(`/resources/${resourceId}/helpful`, {
                method: 'PUT',
                body: JSON.stringify({ helpful })
            })
    };
}

const apiClient = new APIClient(API_BASE_URL);

export default apiClient;
