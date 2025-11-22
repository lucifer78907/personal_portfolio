import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import gsap from 'gsap';
import { IoMenu, IoClose } from 'react-icons/io5';
import ThemeSwitcher from './ThemeSwitcher';

const Header = () => {
    const headerRef = useRef(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.nav-link', {
                y: -20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 1
            });
        }, headerRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            gsap.to('.mobile-menu', { x: '0%', duration: 0.5, ease: 'power3.out' });
            gsap.fromTo('.mobile-link',
                { x: 50, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, duration: 0.4, delay: 0.2 }
            );
        } else {
            gsap.to('.mobile-menu', { x: '100%', duration: 0.5, ease: 'power3.in' });
        }
    }, [isMenuOpen]);

    const linkClass = ({ isActive }) =>
        `nav-link text-sm md:text-base font-medium uppercase tracking-widest hover:text-accent transition-colors duration-300 ${isActive ? 'text-accent' : 'text-text-muted'}`;

    const mobileLinkClass = ({ isActive }) =>
        `mobile-link text-3xl font-display font-bold uppercase tracking-tighter hover:text-accent transition-colors duration-300 ${isActive ? 'text-accent' : 'text-text-main'}`;

    return (
        <>
            <div className={`fixed top-0 left-0 w-full flex justify-center z-50 transition-all duration-700 ease-out ${isScrolled ? 'pt-4' : 'pt-0'
                }`}>
                <header
                    ref={headerRef}
                    className={`transition-all duration-700 ease-out ${isScrolled
                            ? 'w-[90%] md:w-[60%] lg:w-[40%] rounded-full bg-gradient-to-r from-bg-primary/30 via-bg-primary/20 to-bg-primary/30 backdrop-blur-3xl backdrop-saturate-150 border border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] px-6 py-3'
                            : 'w-full bg-transparent px-6 md:px-10 py-6'
                        } flex justify-between items-center ${!isScrolled ? 'mix-blend-difference text-white' : ''}`}
                    style={isScrolled ? {
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(40px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(40px) saturate(180%)'
                    } : {}}
                >
                    <NavLink
                        to='/'
                        className={`font-display font-bold uppercase tracking-tighter z-50 transition-all duration-500 ${isScrolled
                            ? 'text-base md:text-lg text-text-main'
                            : 'text-xl md:text-2xl text-white'
                            }`}
                    >
                        Rudra
                    </NavLink>

                    {/* Desktop Nav */}
                    <nav className='hidden md:flex gap-6 lg:gap-8 items-center'>
                        <NavLink to='/' className={linkClass}>Home</NavLink>
                        <NavLink to='/projects' className={linkClass}>Work</NavLink>
                        <NavLink to='/random-photos' className={linkClass}>Gallery</NavLink>
                        <NavLink to='/contact' className={linkClass}>Contact</NavLink>
                        <div className="nav-link">
                            <ThemeSwitcher />
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className={`md:hidden z-50 text-2xl ${isScrolled || isMenuOpen ? 'text-text-main' : 'text-white'}`}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <IoClose /> : <IoMenu />}
                    </button>
                </header>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu fixed inset-0 bg-bg-primary z-40 flex flex-col items-center justify-center gap-8 translate-x-full md:hidden`}>
                <NavLink to='/' className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Home</NavLink>
                <NavLink to='/projects' className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Work</NavLink>
                <NavLink to='/random-photos' className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Gallery</NavLink>
                <NavLink to='/contact' className={mobileLinkClass} onClick={() => setIsMenuOpen(false)}>Contact</NavLink>
                <div className="mobile-link mt-8">
                    <ThemeSwitcher />
                </div>
            </div>
        </>
    );
};

export default Header;