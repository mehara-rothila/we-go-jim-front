// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useTheme } from '../../context/ThemeContext';

export default function Layout({ children }) {
  const { isDark } = useTheme();
  
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-dark-bg' : 'bg-light-bg'
    }`}>
      <Navbar />
      <Sidebar />
      <main className="p-4 sm:ml-64 pt-16">
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}