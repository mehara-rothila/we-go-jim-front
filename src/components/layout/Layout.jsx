// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-dark-bg text-text-light' : 'bg-light-bg text-gray-800'
    }`}>
      <Navbar />
      <Sidebar />
      <main className="fixed-main-content">
        <div className="p-6 transition-colors duration-200">
          {children}
        </div>
      </main>
    </div>
  );
}