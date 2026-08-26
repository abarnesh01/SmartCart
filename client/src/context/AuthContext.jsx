import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smartcart_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('smartcart_token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser((prev) => ({ ...prev, ...profile }));
          localStorage.setItem('smartcart_user', JSON.stringify({ ...user, ...profile }));
        } catch (err) {
          console.error('[Auth Init Error]: Token expired or invalid');
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    localStorage.setItem('smartcart_token', data.token);
    localStorage.setItem('smartcart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, role = 'user') => {
    const data = await authService.register(name, email, password, role);
    localStorage.setItem('smartcart_token', data.token);
    localStorage.setItem('smartcart_user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('smartcart_token');
    localStorage.removeItem('smartcart_user');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const updated = await authService.updateProfile(profileData);
    setUser((prev) => ({ ...prev, ...updated }));
    localStorage.setItem('smartcart_user', JSON.stringify({ ...user, ...updated }));
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
