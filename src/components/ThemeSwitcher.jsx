import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { IoColorPaletteOutline } from "react-icons/io5";

const themes = [
    { id: 'dark', name: 'Dark', color: '#0a0a0a' },
    { id: 'light', name: 'Light', color: '#ffffff' },
    { id: 'playful', name: 'Playful', color: '#fff0f5' },
    { id: 'nature', name: 'Nature', color: '#f0fdf4' },
    { id: 'ocean', name: 'Ocean', color: '#f0f9ff' },
];

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useGSAP(() => {
        if (isOpen) {
            gsap.to('.theme-option', {
                y: 0,
                opacity: 1,
                stagger: 0.05,
                duration: 0.4,
                ease: 'back.out(1.7)',
                pointerEvents: 'auto'
            });
        } else {
            gsap.to('.theme-option', {
                y: 20,
                opacity: 0,
                stagger: 0.03,
                duration: 0.3,
                ease: 'power2.in',
                pointerEvents: 'none'
            });
        }
    }, { scope: containerRef, dependencies: [isOpen] });

    return (
        <div ref={containerRef} className="fixed bottom-8 left-8 z-50 flex flex-col-reverse items-center gap-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            >
                <IoColorPaletteOutline size={24} />
            </button>

            <div className="flex flex-col-reverse gap-3 mb-2">
                {themes.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => {
                            setTheme(t.id);
                            setIsOpen(false);
                        }}
                        className={`theme-option w-10 h-10 rounded-full border-2 shadow-md opacity-0 translate-y-5 transition-transform hover:scale-110 ${theme === t.id ? 'border-accent scale-110' : 'border-transparent'
                            }`}
                        style={{ backgroundColor: t.color }}
                        title={t.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default ThemeSwitcher;
