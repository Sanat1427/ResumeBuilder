import React, { createContext, useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath'; 

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  
  // Theme state
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Theme effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // AI Mode State
  const [aiMode, setAiMode] = useState(() => {
    return localStorage.getItem('aiMode') || 'balanced';
  });

  const updateAiMode = (newMode) => {
    setAiMode(newMode);
    localStorage.setItem('aiMode', newMode);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    if (user) return;
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
        setUser(response.data);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser, darkMode, toggleDarkMode, aiMode, updateAiMode }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

