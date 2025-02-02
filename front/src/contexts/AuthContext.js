import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import config from '../config';
import axios from 'axios';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (token) => {
    try {
      localStorage.setItem('token', token);
      
      // Set token in axios defaults
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch user details
      const response = await axios.get(`${config.API_URL}/api/auth/verify-token`);
      
      if (response.data.success) {
        setUser(response.data.user);
        return { success: true };
      } else {
        throw new Error('Failed to verify token');
      }
    } catch (error) {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await login(token);
        } catch (error) {
          console.error('Init auth error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    login,
    logout,
    loading,
    // ... other auth methods
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 