// CORS Configuration for Frontend
export const CORS_CONFIG = {
  // Development configuration
  development: {
    allowedOrigins: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://localhost:5000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    headers: [
      'Origin',
      'X-Requested-With', 
      'Content-Type',
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma'
    ]
  },
  
  // Production configuration
  production: {
    allowedOrigins: [
      'https://personal-taskflow.netlify.app',
      'https://taskmanager-4mej.onrender.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    headers: [
      'Origin',
      'X-Requested-With',
      'Content-Type', 
      'Accept',
      'Authorization',
      'Cache-Control',
      'Pragma'
    ]
  }
};

// Get current environment configuration
export const getCurrentCORSConfig = () => {
  const env = import.meta.env.PROD ? 'production' : 'development';
  return CORS_CONFIG[env];
};

// Helper function to check if origin is allowed
export const isOriginAllowed = (origin) => {
  const config = getCurrentCORSConfig();
  return config.allowedOrigins.includes(origin);
};

// Utility to set up fetch with CORS headers
export const createCORSFetch = (url, options = {}) => {
  const config = getCurrentCORSConfig();
  
  return fetch(url, {
    ...options,
    mode: 'cors',
    credentials: config.credentials ? 'include' : 'same-origin',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Origin': window.location.origin,
      'X-Requested-With': 'XMLHttpRequest',
      ...options.headers
    }
  });
};

// Preflight request helper
export const sendPreflightRequest = async (url, method = 'POST') => {
  try {
    const response = await fetch(url, {
      method: 'OPTIONS',
      mode: 'cors',
      headers: {
        'Access-Control-Request-Method': method,
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
        'Origin': window.location.origin
      }
    });
    
    return {
      success: response.ok,
      status: response.status,
      headers: response.headers
    };
  } catch (error) {
    console.error('Preflight request failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
