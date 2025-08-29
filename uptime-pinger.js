const fetch = require('node-fetch');

const BACKEND_URL = process.env.BACKEND_URL || 'https://your-render-app.onrender.com';
const HEALTH_ENDPOINT = `${BACKEND_URL}/api/health`;
const PING_INTERVAL = 8 * 60 * 1000; // 8 minutes in milliseconds

async function pingBackend() {
  const timestamp = new Date().toISOString();

  try {
    console.log(`[${timestamp}] Pinging backend: ${HEALTH_ENDPOINT}`);

    const response = await fetch(HEALTH_ENDPOINT, {
      method: 'GET',
      headers: {
        'User-Agent': 'Render-Uptime-Pinger/1.0'
      }
    });

    if (response.ok) {
      console.log(`[${timestamp}] ✅ Backend is alive! Status: ${response.status}`);
    } else {
      console.log(`[${timestamp}] ⚠️  Backend responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error(`[${timestamp}] ❌ Ping failed:`, error.message);
  }
}

function startPinger() {
  console.log('🚀 Starting Render Uptime Pinger...');
  console.log(`📍 Backend URL: ${BACKEND_URL}`);
  console.log(`⏰ Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`);
  console.log('─'.repeat(50));

  // Initial ping
  pingBackend();

  // Set up interval for regular pings
  setInterval(pingBackend, PING_INTERVAL);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down uptime pinger...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down uptime pinger...');
  process.exit(0);
});

// Start the pinger
startPinger();
