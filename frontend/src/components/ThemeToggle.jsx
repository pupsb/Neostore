import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 dark:focus:ring-dark-accent-primary bg-gray-200 dark:bg-dark-bg-hover"
            aria-label="Toggle dark mode"
        >
            {/* Toggle Track */}
            <span
                className={`absolute left-1 top-1 w-5 h-5 rounded-full transition-all duration-300 ease-in-out transform ${theme === 'dark'
                        ? 'translate-x-7 bg-dark-accent-primary shadow-lg shadow-dark-accent-primary/50'
                        : 'translate-x-0 bg-yellow-400'
                    }`}
            >
                {/* Icon Container */}
                <span className="absolute inset-0 flex items-center justify-center">
                    {theme === 'dark' ? (
                        // Moon Icon
                        <svg className="w-3 h-3 text-dark-bg-primary" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                    ) : (
                        // Sun Icon
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </span>
            </span>
        </button>
    );
};

export default ThemeToggle;
