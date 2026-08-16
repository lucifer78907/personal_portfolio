import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useIntro } from '../context/introContext';
import { useChapterNav } from '../context/chapterContext';
import { createShapeOverlay } from '../lib/shapeOverlay';
import { EASE } from '../lib/eases'; // registers quartInOut / expoOut / quintOut
import { PANELS } from '../lib/palette';

const NAV_ITEMS = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Work' },
    { to: '/random-photos', label: 'Gallery' },
    { to: '/contact', label: 'Say hi' },
];

// The sliding panels and their MorphSVG leading edges are gone; the menu now
// sweeps in on the shared shape overlay (lib/shapeOverlay.js), which draws a
// rippled edge from a row of control points instead of morphing between two
// fixed curves. Same arrival from the right, same 1s/0.08 timings — but the
// loader and the page transition are now the identical move at a different
// angle, rather than three implementations that had to be kept in step by hand.

// Each menu character is a two-faced cube half a line-box deep. Face one sits
// where the letter normally is; face two hangs directly beneath it looking
// down. A quarter turn on X rolls face two up into face one's place — and since
// both faces carry the same glyph, snapping back to 0° afterwards is invisible.
//
// Depth is in em so the cube scales with the type, which changes twice across
// the breakpoints. The parent's perspective is deliberately shallow-ish: each
// character gets its own vanishing point at its own centre, which is what keeps
// a long word from skewing away towards one end.
// backfaceVisibility is load-bearing, not a paranoia flag. At rest the under
// face is edge-on, and the vanishing point sits at the character's centre —
// so anything below that centre is seen very slightly from above, which is
// enough to render the second copy of the word as a sliver under the first.
// Its normal points away from the viewer, so hiding backfaces removes it, and
// the roll swaps which face qualifies exactly when it should.
const CUBE_DEPTH = '0.5em';
const CUBE_PERSPECTIVE = '12em';
const FACE_FRONT = {
    transform: `translateZ(${CUBE_DEPTH})`,
    backfaceVisibility: 'hidden',
};
const FACE_UNDER = {
    transform: `rotateX(-90deg) translateZ(${CUBE_DEPTH})`,
    backfaceVisibility: 'hidden',
};

// PANELS now comes from lib/palette.js, which exists precisely so the menu and
// the loader cannot disagree about the stack. This file kept its own identical
// copy, which meant that guarantee was a coincidence rather than a fact.

const Header = () => {
    const rootRef = useRef(null);
    const overlayRef = useRef(null);
    const sheetsRef = useRef([]);
    const menuTl = useRef(null);
    const burgerTl = useRef(null);
    const [open, setOpen] = useState(false);
    const { introComplete } = useIntro();
    const { pathname } = useLocation();
    const chapterNav = useChapterNav();

    // Whether the next close should be instant (navigation, under the chapter
    // card) or animated (Escape, or the burger).
    const snapClose = useRef(false);
    const openRef = useRef(false);

    useGSAP(() => {
        // axis 'x': the leading edge runs top-to-bottom and travels leftward, so
        // the menu arrives from the right exactly as it always did.
        const overlay = createShapeOverlay({ elements: sheetsRef.current, axis: 'x' });

        // Resting state — nothing covered, the sheets' edges lying along the
        // right-hand edge of the screen.
        gsap.set(overlayRef.current, { autoAlpha: 0 });
        overlay.reset();
        overlay.draw();

        // ── Burger entrance (plays once, after the loader hands off) ──────
        burgerTl.current = gsap.timeline({ paused: true })
            .from('.burger-btn', {
                y: -28,
                opacity: 0,
                duration: 0.7,
                ease: EASE.arrive,
            }, 0.1);

        // ── Open/close (played forward, reversed to close) ────────────────
        //
        // The sheets sweep in from the right with the rippled leading edge the
        // loader and the page transition use — see lib/shapeOverlay.js. It
        // replaces three sliding panels each dragging a MorphSVG curve behind
        // it: same silhouette, same timings, but one mechanism the whole site
        // shares rather than three that had to be kept in agreement by hand.
        //
        // Still played forward and reversed to close, so the menu keeps its
        // existing semantics — including the instant snap-shut on navigation
        // below, and Escape.
        menuTl.current = gsap.timeline({ paused: true, onUpdate: overlay.draw })
            .set(overlayRef.current, { autoAlpha: 1, pointerEvents: 'auto' });

        overlay.sweep(menuTl.current, 0);

        menuTl.current
            .from('.menu-link', {
                yPercent: 115,
                opacity: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'quintOut',
            }, overlay.span - 0.55)
            // Burger becomes an X, lines recolour against the dark panel
            .to('.burger-line-1', { y: 4, rotate: 45, backgroundColor: '#fef3c7', duration: 0.5, ease: 'quartInOut' }, 0.15)
            .to('.burger-line-2', { y: -4, rotate: -45, backgroundColor: '#fef3c7', duration: 0.5, ease: 'quartInOut' }, 0.15)
            // The mask is only needed while the links are flying in. Left on it
            // would clip the hover wave too, and the wave is the whole reason
            // the links are split into characters. Being a set() inside the
            // timeline, closing the menu restores the clip on its own.
            .set('.menu-mask', { overflow: 'visible' });

        // ── Hover roll ────────────────────────────────────────────────────
        // Each character turns a quarter of the way round its cube, one beat
        // after the character before it, so the word rolls across rather than
        // turning as a block. The wave is the stagger's doing; the turn itself
        // is deliberate and unbouncy — quartInOut, the site's travel curve,
        // because a cube face has weight and an overshoot on a solid turning
        // through 90° reads as a mistake.
        //
        // Pointer devices only: on a touchscreen `mouseenter` fires on tap,
        // which would put an animation between the press and the navigation.
        gsap.matchMedia().add('(min-width: 768px) and (hover: hover)', () => {
            const links = gsap.utils.toArray('.menu-link');

            const roll = (e) => {
                const cubes = gsap.utils.toArray('.menu-cube', e.currentTarget);
                // Re-entering mid-roll starts over from face one rather than
                // stacking a second turn on a cube already partway round.
                gsap.killTweensOf(cubes);
                gsap.set(cubes, { rotationX: 0 });

                gsap.to(cubes, {
                    rotationX: 90,
                    duration: 0.44,
                    ease: EASE.travel,
                    stagger: 0.03,
                    // Back to face one once the whole word has landed. Both
                    // faces carry the same glyph so there's nothing to see —
                    // and it keeps the cube from ever passing 90°, where face
                    // one would come round backwards.
                    onComplete: () => gsap.set(cubes, { rotationX: 0 }),
                });
            };

            links.forEach((l) => l.addEventListener('mouseenter', roll));
            return () => links.forEach((l) => l.removeEventListener('mouseenter', roll));
        });
    }, { scope: rootRef });

    useEffect(() => {
        if (introComplete) burgerTl.current?.play();
    }, [introComplete]);

    useEffect(() => {
        const tl = menuTl.current;
        if (!tl) return;

        if (open) {
            tl.timeScale(1).play();
        } else {
            // A close caused by navigating happens underneath the chapter card,
            // so its animation is not only invisible but actively wrong: the
            // reverse runs about 1.5s from full cover, which outlives the
            // uncover sweep, and the last of it plays in the open on the page
            // you just arrived at. Snapping it shut costs nothing — the site
            // already has a transition covering this move, and this is a second
            // one competing with it.
            //
            // Still tl.reverse(), just at 40×, so the end state is identical to
            // an ordinary close rather than a second code path that can drift.
            tl.timeScale(snapClose.current ? 40 : 1).reverse();
            snapClose.current = false;
        }

        // The page behind must not scroll while the overlay is up.
        ScrollSmoother.get()?.paused(open);
        openRef.current = open;
    }, [open]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setOpen(false);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    // Navigating closes the menu — instantly, and only if it was actually open.
    //
    // Guarded on a ref rather than on `open` itself so this effect stays keyed
    // to pathname alone. Reading `open` here would either need it in the deps,
    // firing the close on every toggle, or go stale.
    useEffect(() => {
        if (!openRef.current) return;
        snapClose.current = true;
        setOpen(false);
    }, [pathname]);

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
                {/* One SVG, one sheet per palette step. preserveAspectRatio
                    ="none" is what lets a 100×100 user space stretch to any
                    viewport: lib/shapeOverlay.js works in percentages and the
                    browser does the rest. */}
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                >
                    {PANELS.map(({ bg }, i) => (
                        <path
                            key={bg}
                            ref={(el) => { sheetsRef.current[i] = el; }}
                            fill={bg}
                        />
                    ))}
                </svg>

                <nav className="absolute inset-0 flex flex-col justify-center gap-1 px-10 md:px-24">
                    {NAV_ITEMS.map(({ to, label }) => (
                        <span key={to} className="menu-mask block overflow-hidden py-1">
                            <NavLink
                                to={to}
                                /* The chapter card covers the screen before the
                                   route swaps, so the menu's own close (driven
                                   off pathname, below) happens out of sight. */
                                onClick={chapterNav(to)}
                                /* The characters are split for the hover wave,
                                   so the link needs its name stated once rather
                                   than spelled out a span at a time. */
                                aria-label={label}
                                className={({ isActive }) =>
                                    `menu-link block font-lexend font-semibold tracking-tighter text-5xl md:text-7xl xl:text-8xl w-max transition-colors duration-300 ${isActive ? 'text-amber-500' : 'text-amber-50 hover:text-amber-400'
                                    }`
                                }
                            >
                                {/* Split here rather than with SplitText: these
                                    are React-owned nodes, and a plugin
                                    rewriting innerHTML underneath a NavLink
                                    that re-renders on every route change is a
                                    fight waiting to happen. */}
                                {[...label].map((ch, i) => (
                                    <span
                                        key={`${ch}-${i}`}
                                        aria-hidden="true"
                                        className="menu-char inline-block whitespace-pre"
                                        style={{ perspective: CUBE_PERSPECTIVE }}
                                    >
                                        <span
                                            className="menu-cube relative inline-block"
                                            style={{ transformStyle: 'preserve-3d' }}
                                        >
                                            <span className="block" style={FACE_FRONT}>{ch}</span>
                                            <span className="absolute inset-0 block" style={FACE_UNDER}>{ch}</span>
                                        </span>
                                    </span>
                                ))}
                            </NavLink>
                        </span>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default Header;
