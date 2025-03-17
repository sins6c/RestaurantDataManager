import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Users, QrCode, Settings, FileSpreadsheet, Trash2, Sun, Moon } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) {
      return stored === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  let menuTimeout: NodeJS.Timeout;

  // Apply dark mode class and save preference
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // System theme change listener
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(menuTimeout);
    setIsMenuVisible(true);
  };

  const handleMouseLeave = () => {
    menuTimeout = setTimeout(() => {
      setIsMenuVisible(false);
    }, 300);
  };

  const isActive = (path: string) => location.pathname === path;

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-bg transition-colors duration-200">
      {/* Menu Toggle Button */}
      {!isMenuVisible && (
        <button
          onMouseEnter={handleMouseEnter}
          className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-blue-700 text-white p-2 rounded-r-lg hover:bg-blue-800 transition-colors"
        >
          <Settings className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMenuVisible ? 'w-64' : 'w-0 overflow-hidden'
        } bg-blue-700 text-white transition-all duration-300`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">Restaurant Admin</h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-blue-600 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="mt-2 text-blue-200">ADMIN</div>
        </div>

        <nav className="mt-8">
          <div className="px-4 mb-4 text-sm font-medium text-blue-200">DASHBOARD</div>
          <Link
            to="/admin"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive('/admin')
                ? 'bg-blue-800 text-white'
                : 'text-blue-100 hover:bg-blue-600'
            }`}
          >
            <Settings className="w-4 h-4 mr-3" />
            Form Settings
          </Link>
          <Link
            to="/admin/analytics"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive('/admin/analytics')
                ? 'bg-blue-800 text-white'
                : 'text-blue-100 hover:bg-blue-600'
            }`}
          >
            <BarChart2 className="w-4 h-4 mr-3" />
            Analytics
          </Link>
          <Link
            to="/admin/customers"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive('/admin/customers')
                ? 'bg-blue-800 text-white'
                : 'text-blue-100 hover:bg-blue-600'
            }`}
          >
            <Users className="w-4 h-4 mr-3" />
            Customer Data
          </Link>
          <Link
            to="/admin/qr"
            className={`flex items-center px-4 py-2 text-sm ${
              isActive('/admin/qr')
                ? 'bg-blue-800 text-white'
                : 'text-blue-100 hover:bg-blue-600'
            }`}
          >
            <QrCode className="w-4 h-4 mr-3" />
            Generate QR
          </Link>

          <div className="px-4 mt-8 mb-4 text-sm font-medium text-blue-200">EXPORT</div>
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/admin/customers';
              link.click();
            }}
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 w-full text-left"
          >
            <FileSpreadsheet className="w-4 h-4 mr-3" />
            Export Excel
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
            className="flex items-center px-4 py-2 text-sm text-blue-100 hover:bg-blue-600 w-full text-left"
          >
            <Trash2 className="w-4 h-4 mr-3" />
            Clear Data
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-dark-bg transition-colors duration-200">
        {children}
      </div>
    </div>
  );
}