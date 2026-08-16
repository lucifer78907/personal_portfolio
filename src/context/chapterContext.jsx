import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { createShapeOverlay, WORD_DURATION } from '../lib/shapeOverlay';
import { EASE } from '../lib/eases';

/**
 * The chapter card.
 *
 * Two gradient sheets sweep up over the page with a soft, rippling leading
 * edge, carrying the name of where you are going. They hold for a beat and keep
 * travelling upward, leaving through the top to reveal the new route — one
 * continuous move rather than a cover that retreats the way it came.
 *
 * The sweep itself is lib/shapeOverlay.js, the same gesture the loader leaves on
 * and the menu arrives on. Only the angle and the colours differ.
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
        e.preventDefault();
        if (to === pathname) return;
        go(word ?? wordFor(to), to);
    }, [go, pathname]);
};

const HOLD = 0.18;

// The project has no prop-types dependency and validates no other provider
// (see introContext.jsx); adding it for one file would be inconsistent rather
// than safer. The directive has to be the line immediately above the function —
// anything between them and it lands on the comment instead.
// eslint-disable-next-line react/prop-types
export const ChapterProvider = ({ children }) => {
    const rootRef = useRef(null);
    const pathsRef = useRef([]);
    const wordRef = useRef(null);
    const overlayRef = useRef(null);
    const busy = useRef(false);

    const [word, setWord] = useState('');
    const navigate = useNavigate();

    useGSAP(() => {
        // Built here, not at module scope: createShapeOverlay counts its paths
        // on creation, and before mount the ref array is still empty.
        overlayRef.current = createShapeOverlay({ elements: pathsRef.current, axis: 'y' });

        // Parked out of sight until needed. autoAlpha rather than display, so
        // the word's box can still be measured for its mask on the first run.
        gsap.set(rootRef.current, { autoAlpha: 0 });
        gsap.set(wordRef.current, { yPercent: 110 });
        overlayRef.current.draw();
    }, { scope: rootRef });

    const go = useCallback((label, to) => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        // A second click mid-transition would build a second timeline over the
        // first and navigate twice.
        if (busy.current) return;
        busy.current = true;

        setWord(label);

        const root = rootRef.current;
        const mark = wordRef.current;

        overlay.setCovering(true);
        overlay.reset();
        gsap.set(mark, { yPercent: 110 });
        overlay.draw();

        // One render per frame for the whole timeline, rather than an onUpdate
        // hanging off each of the forty point tweens.
        const tl = gsap.timeline({
            onUpdate: overlay.draw,
            onComplete: () => {
                busy.current = false;
                gsap.set(root, { autoAlpha: 0, pointerEvents: 'none' });
            },
        });

        tl.set(root, { autoAlpha: 1, pointerEvents: 'auto' });

        overlay.sweep(tl, 0, { lead: 'first' });
        // EASE.text is quintOut — the curve the menu's own links come up on.
        tl.to(mark, { yPercent: 0, duration: WORD_DURATION, ease: EASE.text }, overlay.span * 0.5);

        // Covered. Swap the route, put the points back to 100, and flip which
        // side of the curve is solid so the next sweep empties through the top.
        tl.call(() => {
            navigate(to);
            overlay.reset();
            overlay.setCovering(false);
        }, null, overlay.span + HOLD);

        // 'last' reverses which sheet goes first, so the one that led coming in
        // trails leaving and the two layers never cross.
        overlay.sweep(tl, overlay.span + HOLD, { lead: 'last' });

        // Out on `leave` — the site's departure curve, which accelerates away
        // rather than decelerating into the finish like an arrival would.
        tl.to(mark, { yPercent: -110, duration: 0.5, ease: EASE.leave }, overlay.span + HOLD);
    }, [navigate]);

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
                <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                >
                    <defs>
                        {/* The site's own ladder, light to deep — the same
                            traversal lib/palette.js describes for the menu,
                            here as gradients rather than flat fills. */}
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
