import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Load user data on startup if token is present
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            handleLogout();
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Handle registration
  const handleRegister = async (name, email, phone, password, confirmPassword, role = 'student', cafeId = null) => {
    try {
      const res = await API.post('/auth/register', {
        name,
        email,
        phone,
        password,
        confirmPassword,
        role,
        cafeId,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      };
    }
  };

  // Handle login
  const handleLogin = async (loginKey, password) => {
    try {
      const res = await API.post('/auth/login', {
        loginKey,
        password,
      });

      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return { success: true, user: res.data.user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Invalid email/phone or password.',
      };
    }
  };

  // Handle profile update
  const handleUpdateProfile = async (name, email, phone) => {
    try {
      const res = await API.put('/auth/profile', { name, email, phone });
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile details.',
      };
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        token,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isStaff: user?.role === 'cafe_staff',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
