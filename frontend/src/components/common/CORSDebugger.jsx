import React, { useState, useEffect } from 'react';
import { checkAPIHealth, handleCORSPreflight } from '../../services/api';
import { getCurrentCORSConfig } from '../../config/cors';

const CORSDebugger = ({ isVisible = false }) => {
  const [corsStatus, setCorsStatus] = useState({
    apiHealth: null,
    preflightStatus: null,
    config: null,
    lastCheck: null
  });

  const checkCORSStatus = async () => {
    try {
      console.log('🔍 Checking CORS status...');
      
      // Check API health
      const healthStatus = await checkAPIHealth();
      
      // Check preflight
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const preflightStatus = await handleCORSPreflight(apiUrl + '/auth/login', 'POST');
      
      // Get current config
      const config = getCurrentCORSConfig();
      
      setCorsStatus({
        apiHealth: healthStatus,
        preflightStatus,
        config,
        lastCheck: new Date().toISOString()
      });
      
      console.log('✅ CORS status check completed');
    } catch (error) {
      console.error('❌ CORS status check failed:', error);
      setCorsStatus(prev => ({
        ...prev,
        error: error.message,
        lastCheck: new Date().toISOString()
      }));
    }
  };

  useEffect(() => {
    if (isVisible) {
      checkCORSStatus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999,
      fontFamily: 'monospace'
    }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
        🔧 CORS Debugger
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>API Health:</strong> {
          corsStatus.apiHealth === null ? '⏳ Checking...' :
          corsStatus.apiHealth ? '✅ OK' : '❌ Failed'
        }
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Preflight:</strong> {
          corsStatus.preflightStatus === null ? '⏳ Checking...' :
          corsStatus.preflightStatus ? '✅ OK' : '❌ Failed'
        }
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Environment:</strong> {import.meta.env.PROD ? 'Production' : 'Development'}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>API URL:</strong> {import.meta.env.VITE_API_URL}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        <strong>Origin:</strong> {window.location.origin}
      </div>
      
      {corsStatus.config && (
        <div style={{ marginBottom: '8px' }}>
          <strong>Allowed Origins:</strong>
          <div style={{ fontSize: '10px', marginTop: '4px' }}>
            {corsStatus.config.allowedOrigins.map((origin, index) => (
              <div key={index}>• {origin}</div>
            ))}
          </div>
        </div>
      )}
      
      {corsStatus.lastCheck && (
        <div style={{ fontSize: '10px', opacity: 0.7 }}>
          Last check: {new Date(corsStatus.lastCheck).toLocaleTimeString()}
        </div>
      )}
      
      <button
        onClick={checkCORSStatus}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#007acc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '11px'
        }}
      >
        🔄 Refresh
      </button>
    </div>
  );
};

export default CORSDebugger;
