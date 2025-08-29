import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { getCurrentCORSConfig } from '../config/cors';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      const corsConfig = getCurrentCORSConfig();
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      
      const newSocket = io(socketUrl, {
        auth: {
          token: localStorage.getItem('token')
        },
        // CORS configuration for Socket.IO
        withCredentials: corsConfig.credentials,
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        // Additional CORS headers
        extraHeaders: {
          'Origin': window.location.origin,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'
        }
      });

      newSocket.on('connect', () => {
        console.log('✅ Connected to server via Socket.IO');
        newSocket.emit('join-user-room', user._id);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('🔌 Disconnected from server:', reason);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        // Handle CORS errors specifically
        if (error.message.includes('CORS')) {
          console.error('🚫 Socket.IO CORS error - check server configuration');
        }
      });

      newSocket.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Reconnected to server (attempt ${attemptNumber})`);
      });

      newSocket.on('reconnect_error', (error) => {
        console.error('❌ Socket reconnection failed:', error);
      });

      setSocket(newSocket);

      return () => {
        console.log('🔌 Cleaning up socket connection');
        newSocket.close();
        setSocket(null);
      };
    }
  }, [isAuthenticated, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
