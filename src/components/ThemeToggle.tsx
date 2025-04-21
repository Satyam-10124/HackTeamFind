import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppStore } from '../store';

const ThemeToggle: React.FC = () => {
  const { darkMode, toggleDarkMode } = useAppStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full bg-gray-100 dark:bg-dark-200 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-300"
      aria-label="Toggle dark mode"
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-yellow-500" />
      ) : (
        <Moon className="h-5 w-5 text-gray-600" />
      )}
    </button>
  );
};

export default ThemeToggle;