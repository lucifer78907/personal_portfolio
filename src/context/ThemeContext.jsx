import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('app-theme');
        return savedTheme || 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove all previous theme classes
        root.classList.remove('theme-dark', 'theme-light', 'theme-playful', 'theme-nature', 'theme-ocean');

        // Add new theme class
        root.classList.add(`theme-${theme}`);

        // Save to local storage
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    const toggleTheme = (newTheme) => {
        setTheme(newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
