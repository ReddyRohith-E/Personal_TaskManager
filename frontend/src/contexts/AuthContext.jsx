import { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    if (token && user) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    }
  }, []);

  const login = async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.error || 'Login failed' });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      const response = await authService.register(userData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      return response;
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.error || 'Registration failed' });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      register, 
      logout, 
      updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
