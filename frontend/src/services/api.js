import axios from 'axios';

// Updated API configuration for single-platform deployment
const getApiBaseUrl = () => {
  // If we're in production and on the same domain, use relative paths
  if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
    return '/api';
  }
  // Otherwise use the provided URL or localhost for development
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();
const IS_PRODUCTION = import.meta.env.PROD;

// Create axios instance with CORS-friendly configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Enable credentials for CORS
  withCredentials: true,
});

// Remove manual CORS headers - let the browser and server handle CORS properly
// api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// api.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, PATCH, OPTIONS';
// api.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization';

// Request interceptor to add auth token and handle CORS
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add X-Requested-With header for CSRF protection
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    // Handle different environments
    if (IS_PRODUCTION) {
      // Production-specific headers
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }
    
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors and CORS issues
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      console.error(`❌ API Error ${status}:`, data?.message || error.message);
      
      if (status === 401) {
        // Unauthorized - clear auth and redirect
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        // Forbidden
        console.error('Access denied');
      } else if (status >= 500) {
        // Server error
        console.error('Server error occurred');
      }
    } else if (error.request) {
      // Network error or CORS issue
      console.error('❌ Network/CORS Error:', error.message);
      
      // Check if it's a CORS error
      if (error.message.includes('CORS') || error.message.includes('Network Error')) {
        console.error('🚫 CORS or Network issue detected. Please check server configuration.');
      }
    } else {
      // Request setup error
      console.error('❌ Request Setup Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Helper function to handle CORS preflight for complex requests
export const handleCORSPreflight = async (url, method = 'GET') => {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      headers: {
        'Access-Control-Request-Method': method,
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        'Origin': window.location.origin,
      },
      mode: 'cors',
    });
    
    return response.ok;
  } catch (error) {
    console.warn('CORS preflight failed:', error);
    return false;
  }
};

// Utility function to check API connectivity
export const checkAPIHealth = async () => {
  try {
    const healthUrl = API_BASE_URL.replace('/api', '') + '/api/health';
    const response = await fetch(healthUrl, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Health Check:', data);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ API Health Check Failed:', error);
    return false;
  }
};

export default api;
