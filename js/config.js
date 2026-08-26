// Global Configuration for API URLs
// This file is loaded by all HTML pages to provide dynamic API URL detection

const getAPIBaseURL = () => {
    // Check if running on localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
    }

    // Production frontend and API are hosted under the same Hostinger domain
    return `${window.location.origin}/api`;
};

// Set global variable for API base URL
window.API_BASE_URL = getAPIBaseURL();
