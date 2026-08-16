import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASE } from '../../lib/eases';

gsap.registerPlugin(ScrollTrigger);

/**
 * Two readings of the same sentence, stacked.
 *
 * The surface layer is the version written for a recruiter. Underneath it sits
 * the same statement told honestly, and a circle of amber-950 opens out of one
 * word to reveal it — the site's own light/dark duality (see lib/palette.js)
 * turned into the point of a section.
 *
 * This page section deliberately holds no facts. Employers, stack and dates all
 * live on /about, stated properly; repeating a worse version of them one scroll
 * above the link to that page is what this section used to be.
 */

// The clause both layers share, and the whole reason this works: identical text
// in identical boxes at an identical size lands on identical pixels, so the
// aperture can pass straight over it without anything appearing to move. Change
// the type treatment on one layer and this is the line that gives it away.
const OPENING = 'I’m a software engineer.';

// The word the aperture opens out of. Marked in the copy rather than found by
// string search, so rewording the sentence can't silently strand the origin.
const ORIGIN_WORD = 'scalable';

const TRUTH_TAIL = 'until the bug goes away and call it a refactor.';

// Both layers get these verbatim. Any divergence — a padding, a max-width, a
// weight — and the shared opening stops registering, which is the one thing
// this section cannot survive. They are constants precisely so the two JSX
// blocks below cannot drift apart under later editing.
const LAYER = 'absolute inset-0 flex items-start pt-[20vh] md:pt-[26vh]';
const BOX = 'w-full max-w-[min(92vw,1080px)] mx-auto px-6 md:px-10';
const EYEBROW = 'font-lexend text-[11px] uppercase tracking-[0.35em] mb-6 md:mb-8';
const STATEMENT = 'font-lexend font-semibold tracking-tighter leading-[1.08]';

// Anchored to the top of the pin box rather than vertically centred. Centring
// would make the opening clause's position depend on how many lines the
// *divergent* half wraps to — and those differ by layer and by breakpoint, so
// the shared clause would sit at two different heights and the illusion would
// die on the first reflow.
const STATEMENT_SIZE = 'clamp(1.6rem, 4.4vw, 4.25rem)';

const SCRUB = 2;        // playhead catch-up, matching /about — this is the glide
const SCROLL_LEN = 1.6; // viewport heights of scroll the pinned section consumes
const LEAD = 0.12;      // a beat at rest before the aperture starts opening
const GROW = 1;         // timeline units for the radius
const TAIL = 0.25;      // hold at full inversion before the pin releases
const PORTAL_AT = 0.55; // fraction of GROW after which the link starts fading up

const About = () => {
    const containerRef = useRef(null);
    const pinRef = useRef(null);
    const darkRef = useRef(null);
    const originRef = useRef(null);
    const portalRef = useRef(null);

    useGSAP(() => {
        const pin = pinRef.current;
        const dark = darkRef.current;
        const origin = originRef.current;
        const portal = portalRef.current;

        // offsetLeft/offsetTop are measured from the nearest positioned
        // ancestor, and both layers are positioned — so a single read would
        // report the word's offset within its layer, not within the pin box.
        // Walk the chain instead. Same helper shape as pages/About.jsx.
        const offsetIn = (el, axis) => {
            let v = 0;
            for (let n = el; n && n !== pin; n = n.offsetParent) {
                v += axis === 'x' ? n.offsetLeft : n.offsetTop;
            }
            return v;
        };

        // Centre of the origin word, plus the distance from there to the
        // furthest corner — the radius at which the circle is guaranteed to
        // have swallowed the whole box whatever the aspect ratio.
        const measure = () => {
            const cx = offsetIn(origin, 'x') + origin.offsetWidth / 2;
            const cy = offsetIn(origin, 'y') + origin.offsetHeight / 2;
            const { offsetWidth: w, offsetHeight: h } = pin;

            gsap.set(dark, { '--cx': cx, '--cy': cy });

            return Math.max(
                Math.hypot(cx, cy),
                Math.hypot(w - cx, cy),
                Math.hypot(cx, h - cy),
                Math.hypot(w - cx, h - cy),
            );
        };

        // Exactly one of these matches at any time, so the section always gets
        // a branch — a lone `reduce` condition would leave everyone else with
        // no timeline at all, since matchMedia only runs a context that matches.
        gsap.matchMedia().add({
            motion: '(prefers-reduced-motion: no-preference)',
            reduced: '(prefers-reduced-motion: reduce)',
        }, (ctx) => {
            if (ctx.conditions.reduced) {
                // No pin, no growth, no reveal. The honest statement simply is.
                gsap.set(dark, { clipPath: 'none' });
                gsap.set(portal, { autoAlpha: 1, y: 0 });
                return;
            }

            let cover = measure();

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: pin,
                    pin: true,
                    scrub: SCRUB,
                    start: 'top top',
                    end: () => '+=' + window.innerHeight * SCROLL_LEN,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    // A resize, a reflow, or Lexend arriving late all move the
                    // word this opens out of. Re-measure rather than trusting
                    // the number taken at build time.
                    onRefresh: () => { cover = measure(); },
                },
            });

            // fromTo, not to: invalidateOnRefresh re-records a to() tween's
            // start value from whatever the element currently holds, and on a
            // refresh taken mid-section that is a half-open radius, not zero.
            // Stating the start explicitly makes the tween immune to it.
            tl.fromTo(dark,
                { '--r': 0 },
                {
                    // Function-based so the refresh picks up the value measure()
                    // just recomputed rather than baking in the first one.
                    '--r': () => cover,
                    // ease:'none' — the radius IS the scroll position here. Any
                    // curve and the opening stops tracking the scrollbar.
                    ease: 'none',
                    duration: GROW,
                }, LEAD)
                // Scrubbed rather than fired once, so scrolling back up takes
                // the link away with the dark it sits on. It's a state of the
                // aperture, not an arrival of its own.
                .fromTo(portal,
                    { autoAlpha: 0, y: 16 },
                    { autoAlpha: 1, y: 0, duration: GROW * (1 - PORTAL_AT), ease: EASE.text },
                    LEAD + GROW * PORTAL_AT)
                .to({}, { duration: TAIL }, LEAD + GROW);
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="relative">
            <div
                ref={pinRef}
                className="about-pin relative h-[100svh] w-full overflow-hidden"
            >
                {/*
                  The surface. Hidden from the accessibility tree wholesale:
                  both layers carry the same opening clause, so leaving it
                  exposed announces the sentence twice — and of the two, the one
                  worth reading out is the one underneath.
                */}
                <div className={LAYER} aria-hidden="true">
                    <div className={BOX}>
                        <p className={`${EYEBROW} text-amber-700/60`}>About</p>
                        <p className={STATEMENT} style={{ fontSize: STATEMENT_SIZE, color: '#451a03' }}>
                            <span className="block">{OPENING}</span>
                            <span className="block">
                                I architect{' '}
                                {/* Ember on cream: the hot spot the hole opens from. */}
                                <span ref={originRef} className="text-amber-600">{ORIGIN_WORD}</span>
                                , enterprise-grade solutions that drive measurable business impact.
                            </span>
                        </p>
                    </div>
                </div>

                {/*
                  The truth, and the ground it sits on. Both are inside the clip,
                  so the circle reveals a whole inverted world rather than dark
                  text floating on cream.

                  --r/--cx/--cy stay unitless and pick up their units in calc(),
                  because GSAP interpolates a custom property as a plain number —
                  the same arrangement pages/About.jsx uses for its fill.
                */}
                <div
                    ref={darkRef}
                    className={`${LAYER} bg-[#451a03]`}
                    style={{
                        '--r': 0,
                        '--cx': 0,
                        '--cy': 0,
                        clipPath: 'circle(calc(var(--r) * 1px) at calc(var(--cx) * 1px) calc(var(--cy) * 1px))',
                    }}
                >
                    <div className={BOX}>
                        <p className={`${EYEBROW} text-amber-400/70`}>Actually</p>
                        <p className={STATEMENT} style={{ fontSize: STATEMENT_SIZE, color: '#fffbeb' }}>
                            <span className="block">{OPENING}</span>
                            <span className="block">
                                I rename <span className="text-amber-400">variables</span> {TRUTH_TAIL}
                            </span>
                        </p>

                        <Link
                            ref={portalRef}
                            to="/about"
                            /* invisible until the timeline's autoAlpha takes
                               over, so it can't flash before the aperture has
                               opened far enough to hold it. */
                            className="invisible mt-10 md:mt-14 inline-flex items-center gap-3 font-lexend text-sm md:text-base uppercase tracking-[0.2em] text-amber-200/80 hover:text-amber-300 transition-colors duration-300"
                        >
                            the long version
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
