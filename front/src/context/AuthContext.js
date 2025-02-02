import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for both regular and admin tokens
    const token = localStorage.getItem('token');
    const adminToken = localStorage.getItem('adminToken');
    
    if (adminToken) {
      verifyToken(adminToken, true);
    } else if (token) {
      verifyToken(token, false);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token, isAdmin) => {
    try {
      console.log('Verifying token:', isAdmin ? 'admin' : 'user'); // Debug log
      const endpoint = isAdmin ? '/admin/verify' : '/auth/verify';
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api${endpoint}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Verification response:', response.data); // Debug log

      if (response.data.success) {
        setUser({ ...response.data.user, isAdmin });
      } else {
        localStorage.removeItem(isAdmin ? 'adminToken' : 'token');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem(isAdmin ? 'adminToken' : 'token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials, isAdmin = false) => {
    try {
      let response;
      if (isAdmin) {
        response = await axios.post('http://localhost:5001/api/admin/login', credentials);
      } else {
        response = await axios.post('http://localhost:5001/api/auth/login', {
          ...credentials,
          userType: credentials.userType || 'student'
        });
      }

      if (response.data.success || response.data.token) {
        const token = response.data.token;
        if (isAdmin) {
          localStorage.setItem('adminToken', token);
          setUser({ ...response.data.admin, isAdmin: true });
        } else {
          localStorage.setItem('token', token);
          setUser({ ...response.data.user, isAdmin: false });
        }
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAdmin: user?.isAdmin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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

export default AuthContext;
