import { useLayoutEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import PageColumn from '../components/PageColumn';
import { skillBySlug } from '../lib/skills';
import { peekPendingTransition, clearPendingTransition } from '../lib/pageTransition';
import { EASE } from '../lib/eases';

gsap.registerPlugin(Flip, SplitText);

// How far the icon sinks after it lands. The flight ends where the destination
// is, then the icon keeps going a little under its own weight and the title
// rises into the space it leaves — one move handing off to another, rather than
// an arrival followed by an unrelated reveal.
const SETTLE = 26;

const SkillDetail = () => {
    const { slug } = useParams();
    const skill = skillBySlug(slug);

    const containerRef = useRef(null);
    const destRef = useRef(null);
    const flyerRef = useRef(null);

    // Read during render, not in an effect: the flyer has to be positioned on
    // the very first paint or the icon visibly jumps from the top-left corner
    // before the Flip takes over. Peek, never consume — consuming happens once
    // the transition has actually been started.
    const [incoming] = useState(() => {
        const p = peekPendingTransition();
        return p?.kind === 'skill' && p.slug === slug ? p : null;
    });

    // ── Shared-element landing ───────────────────────────────────────────
    useLayoutEffect(() => {
        const dest = destRef.current;
        const flyer = flyerRef.current;
        if (!incoming || !dest || !flyer) return;

        // Reset scroll *before* measuring. RootLayout does this too, but its
        // useEffect runs after this child useLayoutEffect — measuring first
        // would capture the destination at the previous page's scroll offset.
        ScrollSmoother.get()?.scrollTo(0, false);

        const { rect } = incoming;
        gsap.set(flyer, {
            position: 'fixed',
            top: rect.top, left: rect.left,
            width: rect.width, height: rect.height,
            autoAlpha: 1, zIndex: 90,
        });
        // Parked SETTLE above its resting place BEFORE the fit is built, because
        // Flip.fit measures the destination the moment it is constructed. Fitting
        // to the resting box and then animating a drag down from above would put
        // a visible jump at the swap — the icon landing, then teleporting back up
        // to start its second move. Landing on the raised box means the swap has
        // nothing to see and the drag continues the same motion.
        gsap.set(dest, { autoAlpha: 0, y: -SETTLE });

        const tl = gsap.timeline();
        tl.add(Flip.fit(flyer, dest, { duration: 1.05, ease: EASE.travel, scale: true }))
            .set(dest, { autoAlpha: 1 })
            .set(flyer, { autoAlpha: 0 })
            // The drag down, into the space the title is about to rise through.
            .to(dest, { y: 0, duration: 0.7, ease: EASE.arrive });

        clearPendingTransition();
        return () => tl.kill();
    }, [incoming]);

    useGSAP(() => {
        if (!skill) return;

        // Held back until the icon has landed and started to sink, so the title
        // comes up into the gap the settle opens rather than racing it.
        const delay = incoming ? 0.95 : 0.15;

        const title = SplitText.create('.skill-title', { type: 'chars', mask: 'chars' });
        gsap.from(title.chars, {
            yPercent: 110, duration: 0.9, stagger: 0.04, ease: EASE.arrive, delay,
        });

        gsap.from('.skill-eyebrow', {
            autoAlpha: 0, y: 12, duration: 0.6, ease: EASE.text, delay,
        });

        gsap.from('.skill-reveal', {
            autoAlpha: 0, y: 26, duration: 0.8, stagger: 0.09, ease: EASE.text, delay: delay + 0.25,
        });
    }, { scope: containerRef, dependencies: [slug] });

    if (!skill) {
        return (
            <PageColumn>
                <div className="px-6 md:px-10 py-32">
                    <h1 className="font-lexend text-4xl md:text-6xl font-semibold tracking-tighter text-amber-950">
                        No such skill.
                    </h1>
                    <Link to="/" className="mt-8 inline-block font-lexend text-sm uppercase tracking-[0.2em] text-amber-700 hover:text-amber-900">
                        ← back home
                    </Link>
                </div>
            </PageColumn>
        );
    }

    const { label, group, Icon, body, where, blurb } = skill;

    return (
        <>
            {/* The travelling copy. Fixed, above everything, and invisible until
                the landing effect gives it a box to start from.

                Wrapped in a span rather than reffed directly: react-icons render
                through a plain function component, which cannot take a ref — the
                Flip target has to be a real element this file owns. */}
            <span
                ref={flyerRef}
                aria-hidden="true"
                className="fixed top-0 left-0 block invisible pointer-events-none text-amber-800"
            >
                <Icon className="h-full w-full" />
            </span>

            <section ref={containerRef} className="pb-40">
                <PageColumn>
                    <div className="px-6 md:px-10 pt-4 md:pt-8">
                        <span
                            ref={destRef}
                            aria-hidden="true"
                            className="skill-dest block h-24 w-24 md:h-36 md:w-36 text-amber-800"
                        >
                            <Icon className="h-full w-full" />
                        </span>

                        <p className="skill-eyebrow mt-10 font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60">
                            {group}
                        </p>

                        <h1 className="skill-title mt-3 font-lexend text-6xl sm:text-7xl md:text-8xl font-semibold tracking-tighter text-amber-950 leading-[0.9]">
                            {label}
                        </h1>

                        <p className="skill-reveal mt-8 font-lexend text-xl md:text-2xl leading-snug text-amber-900/70 max-w-3xl">
                            {blurb}
                        </p>

                        <p className="skill-reveal mt-10 font-lexend text-base md:text-lg leading-relaxed text-amber-950/80 max-w-3xl">
                            {body}
                        </p>

                        <div className="skill-reveal mt-20">
                            <p className="font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60 mb-8">
                                Where it shows up
                            </p>
                            {where.map((item) => (
                                <div key={item} className="border-t border-amber-900/15 py-5">
                                    <p className="font-lexend text-base md:text-lg text-amber-950/80">{item}</p>
                                </div>
                            ))}
                        </div>

                        <div className="skill-reveal mt-20 flex flex-wrap gap-8">
                            <Link
                                to="/"
                                className="font-lexend text-sm uppercase tracking-[0.2em] text-amber-700 hover:text-amber-900 transition-colors duration-300"
                            >
                                ← back to the board
                            </Link>
                            <Link
                                to="/about"
                                className="font-lexend text-sm uppercase tracking-[0.2em] text-amber-700 hover:text-amber-900 transition-colors duration-300"
                            >
                                the whole toolkit →
                            </Link>
                        </div>
                    </div>
                </PageColumn>
            </section>
        </>
    );
};

export default SkillDetail;
