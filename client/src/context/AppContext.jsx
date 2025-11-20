import React, { createContext, useState } from 'react';
import API from '../api/api';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);

  const createPost = async (formData) => {
    // optimistic update: add a temporary item
    const temp = { _id: `temp-${Date.now()}`, ...Object.fromEntries(formData) };
    setPosts(prev => [temp, ...prev]);
    try {
      const res = await API.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      // replace temp with real
      setPosts(prev => prev.map(p => p._id === temp._id ? res.data : p));
      return res.data;
    } catch (err) {
      // rollback
      setPosts(prev => prev.filter(p => p._id !== temp._id));
      throw err;
    }
  };

  return (
    <AppContext.Provider value={{ posts, setPosts, categories, setCategories, createPost }}>
      {children}
    </AppContext.Provider>
  );
}
