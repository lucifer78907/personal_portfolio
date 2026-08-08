import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useIntro } from '../context/introContext';
import { EASE } from '../lib/eases'; // registers quartInOut / expoOut / quintOut

gsap.registerPlugin(MorphSVGPlugin);

const NAV_ITEMS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Work' },
    { to: '/random-photos', label: 'Gallery' },
    { to: '/contact', label: 'Say hi' },
];

// Leading edge of each panel, as a path on a 100x100 viewBox stretched with
// preserveAspectRatio="none". Both states use the identical command structure
// (one cubic + close) so MorphSVG gets a clean 1:1 point map.
//
// Note for future tinkering: don't put an overshooting ease on this morph.
// Overshoot pushes the control points past x=100, which is *behind* the solid
// panel — invisible. Only the rebound back out is visible, which reads as a
// glitch rather than a bounce. Keep the character in the panel's travel instead.
const CURVE_BULGED = 'M100,0 C0,25 0,75 100,100 Z';
const CURVE_FLAT = 'M100,0 C100,25 100,75 100,100 Z';

// Width of that leading-edge curve, in vw. The curve is rendered to the LEFT of
// its panel, so parking a panel at xPercent:100 still leaves CURVE_W of bulge
// sitting on screen. Panels therefore rest at 100 + CURVE_W to clear it.
const CURVE_W = 18;
const PANEL_PARKED = 100 + CURVE_W;

const PANELS = [
    { bg: '#fde68a' }, // amber-200
    { bg: '#d97706' }, // amber-600
    { bg: '#451a03' }, // amber-950 — deepest, carries the links
];

const Header = () => {
    const rootRef = useRef(null);
    const overlayRef = useRef(null);
    const menuTl = useRef(null);
    const burgerTl = useRef(null);
    const [open, setOpen] = useState(false);
    const { introComplete } = useIntro();
    const { pathname } = useLocation();

    useGSAP(() => {
        const panels = gsap.utils.toArray('.menu-panel');
        const curves = gsap.utils.toArray('.menu-curve-path');

        // Resting state — parked far enough right that the curve clears the viewport too
        gsap.set(overlayRef.current, { autoAlpha: 0 });
        gsap.set(panels, { xPercent: PANEL_PARKED });

        // ── Burger entrance (plays once, after the loader hands off) ──────
        burgerTl.current = gsap.timeline({ paused: true })
            .from('.burger-btn', {
                y: -28,
                opacity: 0,
                duration: 0.7,
                ease: EASE.arrive,
            }, 0.1);

        // ── Open/close (played forward, reversed to close) ────────────────
        menuTl.current = gsap.timeline({ paused: true })
            .set(overlayRef.current, { autoAlpha: 1, pointerEvents: 'auto' })
            // Panels fly in, staggered — the curve leads each one in
            .to(panels, {
                xPercent: 0,
                duration: 1,
                ease: 'quartInOut',
                stagger: 0.08,
            })
            // Curve deliberately lags the panel and resolves on expoOut, so you
            // watch the edge chase the panel and flatten out. No elastic here:
            // its overshoot goes *into* the panel where it's hidden, so all you
            // ever saw was the rebound popping back out.
            .to(curves, {
                morphSVG: CURVE_FLAT,
                duration: 0.9,
                ease: 'expoOut',
                stagger: 0.08,
            }, '<0.35')
            .from('.menu-link', {
                yPercent: 115,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'quintOut',
            }, '-=0.7')
            // Burger becomes an X, lines recolour against the dark panel
            .to('.burger-line-1', { y: 4, rotate: 45, backgroundColor: '#fef3c7', duration: 0.5, ease: 'quartInOut' }, 0.15)
            .to('.burger-line-2', { y: -4, rotate: -45, backgroundColor: '#fef3c7', duration: 0.5, ease: 'quartInOut' }, 0.15);
    }, { scope: rootRef });

    useEffect(() => {
        if (introComplete) burgerTl.current?.play();
    }, [introComplete]);

    useEffect(() => {
        const tl = menuTl.current;
        if (!tl) return;
        open ? tl.play() : tl.reverse();
        // The page behind must not scroll while the overlay is up.
        ScrollSmoother.get()?.paused(open);
    }, [open]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Navigating closes the menu.
    useEffect(() => setOpen(false), [pathname]);

    return (
        <div ref={rootRef}>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-label={open ? 'Close menu' : 'Open menu'}
                className="burger-btn fixed top-6 right-6 md:top-8 md:right-8 z-[120] w-12 h-12 flex flex-col items-center justify-center gap-[6px] rounded-full"
            >
                <span className="burger-line-1 block w-7 h-[2px] rounded-full bg-amber-900" />
                <span className="burger-line-2 block w-7 h-[2px] rounded-full bg-amber-900" />
            </button>

            <div
                ref={overlayRef}
                className="fixed inset-0 z-[110] overflow-hidden pointer-events-none"
            >
                {PANELS.map(({ bg }, i) => (
                    <div
                        key={bg}
                        className="menu-panel absolute inset-0"
                        style={{ backgroundColor: bg }}
                    >
                        <svg
                            className="menu-curve absolute top-0 right-full h-full"
                            style={{ width: `${CURVE_W}vw` }}
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        >
                            <path className="menu-curve-path" d={CURVE_BULGED} fill={bg} />
                        </svg>
                    </div>
                ))}

                <nav className="absolute inset-0 flex flex-col justify-center gap-1 px-10 md:px-24">
                    {NAV_ITEMS.map(({ to, label }) => (
                        <span key={to} className="block overflow-hidden py-1">
                            <NavLink
                                to={to}
                                className={({ isActive }) =>
                                    `menu-link block font-lexend font-semibold tracking-tighter text-5xl md:text-7xl xl:text-8xl w-max transition-colors duration-300 ${isActive ? 'text-amber-500' : 'text-amber-50 hover:text-amber-400'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        </span>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Header;
