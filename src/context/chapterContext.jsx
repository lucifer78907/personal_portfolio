import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { EASE } from '../lib/eases';

/**
 * The chapter card.
 *
 * Two gradient sheets sweep down over the page with a soft, rippling leading
 * edge, carrying the name of where you are going. They hold for a beat, then
 * retreat upward to reveal the new route underneath.
 *
 * The edge is a bezier rebuilt every frame from a row of control points, each
 * released on its OWN random delay. That randomness is the whole effect: give
 * the points an even stagger instead and the edge arrives as a straight
 * diagonal wipe. Give them scattered delays and it reads as liquid.
 *
 * Structure follows the shape-overlays technique (Codrops, via Blake Bowen's
 * GSAP fork), on the site's own amber ladder rather than a borrowed palette.
 *
 * Deliberately NOT a shared element. The site already hands objects across
 * routes in three places (the loader's word into the hero, a polaroid into
 * /about, a skill icon into its detail page) and a fourth would stop being a
 * motif and start being a tic.
 *
 * The route swaps at full cover, so the outgoing page is never seen leaving and
 * the incoming one is never seen arriving — the whole job of a transition.
 */

const ChapterContext = createContext({ go: () => { } });

export const useChapter = () => useContext(ChapterContext);

/**
 * What the card says for a given route.
 *
 * The nav's own labels are not reusable here — "Say hi" has a space in it and
 * "Work" does not match the /projects it points at. These are the words as a
 * URL would spell them, which is what the leading slash promises.
 */
const WORDS = {
    '/': 'home',
    '/about': 'about',
    '/projects': 'work',
    '/random-photos': 'gallery',
    '/contact': 'contact',
};

const wordFor = (to) => WORDS[to] ?? to.split('/').filter(Boolean).pop() ?? 'home';

/**
 * An onClick for any <Link> or <NavLink> that should transition.
 *
 * Returns a handler factory rather than a wrapper component so it can sit on a
 * NavLink without giving up its isActive styling — and so the guards below live
 * in exactly one place:
 *
 *   • Modified clicks fall through untouched, so cmd-click, middle-click and
 *     "open in new tab" still do what the browser promises.
 *   • Navigating to the route you are already on does nothing, rather than
 *     playing a full transition to arrive back where you started.
 *
 * The element stays a real <Link> with a real href throughout, so every route
 * remains crawlable.
 */
export const useChapterNav = () => {
    const { go } = useChapter();
    const { pathname } = useLocation();

    return useCallback((to, word) => (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (to === pathname) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        go(word ?? wordFor(to), to);
    }, [go, pathname]);
};

const NUM_POINTS = 10;
const NUM_PATHS = 2;

/**
 * Timings, taken from the nav menu so the two read as the same machine.
 *
 * Header.jsx flies its three panels in over 1s on quartInOut, staggered 0.08,
 * and brings the links up over 0.7s on quintOut. Those are the numbers here,
 * unchanged — a sweep IS a panel travelling, so it takes exactly as long as one,
 * the sheets trail each other by the menu's own stagger, and the word arrives on
 * the links' own curve over the links' own duration.
 *
 * The ripple is the one thing with no equivalent in the menu, and it is pulled
 * well in from the reference's 0.3 — a wide scatter reads as chaotic, where a
 * narrow one just softens the edge.
 */
const DURATION = 1;            // the menu's panel travel
const DELAY_PER_PATH = 0.08;   // the menu's panel stagger
const WORD_DURATION = 0.7;     // the menu's link reveal
const DELAY_POINTS_MAX = 0.16; // the ripple — each point waits its own slice

const SWEEP = DURATION + DELAY_POINTS_MAX + DELAY_PER_PATH * (NUM_PATHS - 1);
const HOLD = 0.18;

/**
 * The path for one sheet.
 *
 * `pts` are the y positions of the leading edge, left to right, in the 0–100
 * user space of the viewBox. Each pair is joined by a cubic whose control
 * points sit halfway between them, which is what turns a row of independent
 * numbers into one continuous curve rather than a chain of visible arcs.
 *
 * Both directions animate their points 100 → 0; `covering` decides which side
 * of the curve is solid, and therefore whether that means filling downward from
 * the top or emptying upward off it.
 */
const buildPath = (pts, covering) => {
    let d = covering ? `M 0 0 V ${pts[0]} C` : `M 0 ${pts[0]} C`;

    for (let i = 0; i < NUM_POINTS - 1; i++) {
        const p = ((i + 1) / (NUM_POINTS - 1)) * 100;
        const cp = p - (100 / (NUM_POINTS - 1)) / 2;
        d += ` ${cp} ${pts[i]} ${cp} ${pts[i + 1]} ${p} ${pts[i + 1]}`;
    }

    return d + (covering ? ' V 100 H 0' : ' V 0 H 0');
};

// The project has no prop-types dependency and validates no other provider
// (see introContext.jsx); adding it for one file would be inconsistent rather
// than safer. The directive has to be the line immediately above the function —
// anything between them and it lands on the comment instead.
// eslint-disable-next-line react/prop-types
export const ChapterProvider = ({ children }) => {
    const rootRef = useRef(null);
    const pathsRef = useRef([]);
    const wordRef = useRef(null);
    const busy = useRef(false);

    // Plain arrays, not component state: these are tweened sixty times a second
    // and re-rendering React per frame would be absurd. GSAP writes the numbers,
    // draw() writes the DOM.
    const edge = useRef({
        pts: Array.from({ length: NUM_PATHS }, () => new Array(NUM_POINTS).fill(100)),
        covering: true,
    });

    const [word, setWord] = useState('');
    const navigate = useNavigate();

    const draw = useCallback(() => {
        const { pts, covering } = edge.current;
        pts.forEach((points, i) => {
            pathsRef.current[i]?.setAttribute('d', buildPath(points, covering));
        });
    }, []);

    useGSAP(() => {
        // Parked out of sight until needed. autoAlpha rather than display, so
        // the word's box can still be measured for its mask on the first run.
        gsap.set(rootRef.current, { autoAlpha: 0 });
        gsap.set(wordRef.current, { yPercent: 110 });
        draw();
    }, { scope: rootRef });

    /**
     * Queue one sweep onto the timeline.
     *
     * Every point of every sheet gets its own tween at its own offset — that is
     * why this is a nest of loops rather than a single staggered tween. A
     * stagger distributes delays evenly by definition, and even is exactly what
     * this must not be.
     */
    const sweep = useCallback((tl, at, covering) => {
        const { pts } = edge.current;

        // Fresh scatter each sweep, so the ripple never repeats itself. Random
        // is fine here and nowhere near the layout code: this is timing, which
        // nobody can diff between runs.
        const jitter = Array.from({ length: NUM_POINTS }, () => Math.random() * DELAY_POINTS_MAX);

        for (let i = 0; i < NUM_PATHS; i++) {
            // Reversed on the way out, so the sheet that led coming in is the
            // one that trails leaving and the two layers never cross.
            const pathDelay = DELAY_PER_PATH * (covering ? i : NUM_PATHS - i - 1);

            for (let j = 0; j < NUM_POINTS; j++) {
                tl.to(pts[i], {
                    [j]: 0,
                    duration: DURATION,
                    ease: EASE.travel,
                }, at + jitter[j] + pathDelay);
            }
        }
    }, []);

    const go = useCallback((label, to) => {
        // A second click mid-transition would build a second timeline over the
        // first and navigate twice.
        if (busy.current) return;
        busy.current = true;

        setWord(label);

        const root = rootRef.current;
        const mark = wordRef.current;
        const reset = () => edge.current.pts.forEach((p) => p.fill(100));

        edge.current.covering = true;
        reset();
        gsap.set(mark, { yPercent: 110 });
        draw();

        // One render per frame for the whole timeline, rather than an onUpdate
        // hanging off each of the forty point tweens.
        const tl = gsap.timeline({
            onUpdate: draw,
            onComplete: () => {
                busy.current = false;
                gsap.set(root, { autoAlpha: 0, pointerEvents: 'none' });
            },
        });

        tl.set(root, { autoAlpha: 1, pointerEvents: 'auto' });

        sweep(tl, 0, true);
        // EASE.text is quintOut — the curve the menu's own links come up on.
        tl.to(mark, { yPercent: 0, duration: WORD_DURATION, ease: EASE.text }, SWEEP * 0.5);

        // Covered. Swap the route, put the points back to 100, and flip which
        // side of the curve is solid so the next sweep empties upward.
        tl.call(() => {
            navigate(to);
            reset();
            edge.current.covering = false;
        }, null, SWEEP + HOLD);

        sweep(tl, SWEEP + HOLD, false);
        // Out on `leave` — the site's departure curve, which accelerates away
        // rather than decelerating into the finish like an arrival would.
        tl.to(mark, { yPercent: -110, duration: 0.5, ease: EASE.leave }, SWEEP + HOLD);
    }, [navigate, draw, sweep]);

    const value = useMemo(() => ({ go }), [go]);

    return (
        <ChapterContext.Provider value={value}>
            {children}

            {/*
              Must sit outside #smooth-content. ScrollSmoother transforms that
              element, and a transformed ancestor makes position:fixed resolve
              against it instead of the viewport — the overlay would scroll with
              the page it is supposed to be covering.

              Above the header's z-[120], or the burger stays clickable and you
              could open the menu mid-transition.
            */}
            <div
                ref={rootRef}
                aria-hidden="true"
                className="fixed inset-0 z-[130] overflow-hidden pointer-events-none"
            >
                {/* preserveAspectRatio="none" is what lets a 100×100 user space
                    stretch to any viewport: the maths works in percentages and
                    the browser does the rest. */}
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {/* The site's own ladder, light to deep — the same
                            traversal lib/palette.js describes for the menu. */}
                        <linearGradient id="chapter-a" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#fde68a" />
                            <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                        <linearGradient id="chapter-b" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#451a03" />
                        </linearGradient>
                    </defs>

                    {/* Painted in this order, so the trailing sheet covers the
                        leading one and you see a band of the lighter gradient
                        running ahead of the dark. */}
                    <path ref={(el) => { pathsRef.current[0] = el; }} fill="url(#chapter-a)" />
                    <path ref={(el) => { pathsRef.current[1] = el; }} fill="url(#chapter-b)" />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                    {/* The mask. The word rises out of nothing rather than
                        sliding in over the sheet it sits on. */}
                    <span className="block overflow-hidden">
                        <span
                            ref={wordRef}
                            className="block font-lexend text-6xl md:text-8xl font-semibold tracking-tighter text-amber-50"
                        >
                            {/* Echoes the destination's own h1, which sets the
                                slash in amber-600 — the card is a preview of the
                                page rather than a label about it. */}
                            <span className="text-amber-600">/</span>
                            {word}
                        </span>
                    </span>
                </div>
            </div>
        </ChapterContext.Provider>
    );
};
