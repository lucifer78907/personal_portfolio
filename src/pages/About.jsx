import { useLayoutEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import defaultPhoto from '../assets/poloroid_1.png';
import PageColumn from '../components/PageColumn';
import { peekPendingTransition, clearPendingTransition } from '../lib/pageTransition';
import { EASE } from '../lib/eases';

gsap.registerPlugin(Flip, ScrollTrigger, SplitText);

// One sentence, one unbroken line. Length is tuned so that at STATEMENT_SIZE it
// runs roughly three viewports wide — but nothing depends on that guess: the
// travel distance is measured from the real scrollWidth at runtime.
const STATEMENT =
    'I’m a software engineer building fintech and AI platforms. I led the LoanNetwork → Nestara migration end to end, and now I build agentic workflows for Initializ.';

const STATEMENT_SIZE = 'clamp(2rem, 4vw, 7rem)';

const IMPACT = [
    { to: 30, suffix: 'K+', label: 'Qualified leads\ndriven' },
    { to: 15, suffix: '+', label: 'Production\nfeatures shipped' },
    { to: 6, suffix: '+', label: 'Partner\nintegrations' },
    { to: 40, suffix: '%', label: 'SEO performance\ngain' },
];

const CREDITS = [
    {
        company: 'Initializ Technologies',
        period: '2025 —',
        work: 'LoanNetwork → Nestara migration · Balance Transfer + Top-Up · Builder Dashboard · Unified DSA QR flow · Experian/CIBIL bureau workflows · AWS Amplify, VAPT remediation',
    },
    {
        company: 'Initializ · internal',
        period: '2025 —',
        work: 'LogAnalyzer for GreyOrange, complete frontend · Promethia data graph, renewals, settings · Agentic Workflow platform for Console and Assistant · mentoring juniors on scalable React',
    },
    {
        company: 'Anmol India',
        period: '2024 — 2025',
        work: 'Offingo platform revamp in React and Next.js, SEO +40% · backend API efficiency +20% · WhatsApp Business ↔ Admin Portal, saving 20+ hours a week',
    },
];

const TOOLKIT = [
    { group: 'Languages', items: 'C++ · JavaScript · TypeScript · Python' },
    { group: 'Frontend', items: 'React · Next.js · React Native · Expo · Redux Toolkit · Tailwind · Sass · Shadcn' },
    { group: 'Backend', items: 'Node · Express · GraphQL · REST · Prisma · Hono' },
    { group: 'Data', items: 'MongoDB · PostgreSQL · Supabase' },
    { group: 'Cloud', items: 'AWS Amplify, EC2, S3, CloudFront · Docker · Git · Linux' },
    { group: 'Tools', items: 'Auth0 · Sentry · Microsoft Clarity · Postman · Figma · Jira' },
];

const EDUCATION = [
    { school: 'Chandigarh University', detail: 'B.E. Computer Science — CGPA 8.5', period: '2020 — 2024' },
    { school: 'S.D Public School', detail: 'Intermediate — 94.4% PCM', period: '2019 — 2020' },
];

const SCRUB = 1.2;        // playhead catch-up — this is what makes it glide
const SCROLL_MULT = 1.2;  // scroll distance per pixel travelled; raise to slow
const TRAVEL = 10;        // timeline units for the horizontal move
const LEAD = 0.15;        // brief settle before it starts moving
const TAIL = 0.4;         // hold after it lands

const LIT = '#451a03';                  // filled
const UNLIT = 'rgba(69, 26, 3, 0.13)';  // not yet filled

// Words that get a pop and a visit from the spark. Matched case-insensitively
// against the split word's text, so punctuation doesn't break the match.
const HIGHLIGHTS = ['fintech', 'AI', 'migration', 'agentic', 'Initializ'];

// Hard-stop gradient: LIT up to --p, UNLIT immediately after. No soft edge —
// that's what makes it read as a bar filling rather than a fade. --p is
// unitless so GSAP can interpolate it as a plain number.
const FILL_GRADIENT =
    `linear-gradient(90deg, ${LIT} 0%, ${LIT} calc(var(--p) * 1%), ${UNLIT} calc(var(--p) * 1%), ${UNLIT} 100%)`;

const About = () => {
    const containerRef = useRef(null);
    const destRef = useRef(null);
    const flyerRef = useRef(null);
    const trackRef = useRef(null);
    const markerRef = useRef(null);

    const [incoming] = useState(() => peekPendingTransition());
    const photo = incoming?.src ?? defaultPhoto;

    // ── Shared-element landing ────────────────────────────────────────────
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
        gsap.set(dest, { autoAlpha: 0 });

        const tl = gsap.timeline();
        tl.add(Flip.fit(flyer, dest, { duration: 1.15, ease: EASE.travel, scale: true }))
            .set(dest, { autoAlpha: 1 })
            .set(flyer, { autoAlpha: 0 });

        clearPendingTransition();
        return () => tl.kill();
    }, [incoming]);

    useGSAP(() => {
        const delay = incoming ? 0.55 : 0.15;

        // Time-based tweens — these DO want the shaped eases.
        const name = SplitText.create('.about-name', { type: 'lines', mask: 'lines' });
        gsap.from(name.lines, { yPercent: 110, duration: 1, stagger: 0.09, ease: EASE.arrive, delay });
        gsap.from('.about-eyebrow', { opacity: 0, y: 14, duration: 0.7, ease: EASE.text, delay });

        // ── The line ─────────────────────────────────────────────────────
        const track = trackRef.current;
        const marker = markerRef.current;
        const words = SplitText.create('.statement', { type: 'words' }).words;

        // Paint each word as its own progress bar.
        words.forEach((w) => {
            w.style.setProperty('--p', '0');
            w.style.backgroundImage = FILL_GRADIENT;
            w.style.webkitBackgroundClip = 'text';
            w.style.backgroundClip = 'text';
            w.style.color = 'transparent';
            // inline-block keeps each word its own background-painting box, so
            // one word's gradient can't bleed across its neighbours.
            w.style.display = 'inline-block';
        });

        const isHighlight = (w) =>
            HIGHLIGHTS.some((h) => w.textContent.toLowerCase().includes(h.toLowerCase()));

        // Measured, not assumed — the sentence's real width depends on the
        // font, the viewport and where clamp() lands.
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hscroll-pin',
                pin: true,
                scrub: SCRUB,
                start: 'top top',
                end: () => '+=' + (distance() * SCROLL_MULT + window.innerHeight * (LEAD + TAIL) * 0.5),
                invalidateOnRefresh: true,
                anticipatePin: 1,
            },
        });

        const fillDur = TRAVEL * 0.035;

        // Each word is timed from where it ACTUALLY sits, not from an even
        // stagger — so it fills at the moment it crosses the centre of the
        // viewport and the fill point stays put instead of drifting.
        //
        // Track x at time t is -distance × (t / TRAVEL). A word is centred when
        // its centre minus that offset equals half the viewport, so:
        //     t = TRAVEL × (centreX − halfViewport) / distance
        //
        // The 50vw padding on the line is what makes this work at both ends:
        // without it the first and last words can never reach the centre.
        const posOf = (w) => {
            const d = distance();
            if (d <= 0) return 0;
            const centreX = w.offsetLeft + w.offsetWidth / 2;
            return gsap.utils.clamp(0, TRAVEL, TRAVEL * ((centreX - window.innerWidth / 2) / d));
        };

        tl.to({}, { duration: LEAD })
            .addLabel('travel')
            // ease:'none' — the translation is the scroll surrogate. Any curve
            // and the words stop lining up with where they actually are.
            .to(track, { x: () => -distance(), ease: 'none', duration: TRAVEL }, 'travel');

        words.forEach((w) => {
            tl.to(w, { '--p': 100, ease: 'none', duration: fillDur }, `travel+=${posOf(w)}`);
        });

        // ── Spark hops between the key words, and they react ─────────────
        const hot = words.filter(isHighlight);

        // Positions are function-based so they re-measure on refresh — the
        // offsets shift once the webfont lands, and invalidateOnRefresh above
        // makes GSAP re-run these rather than caching stale numbers.
        const px = (w) => () => w.offsetLeft + w.offsetWidth / 2 - 14;
        const py = (w) => () => w.offsetTop - 34;

        hot.forEach((w, k) => {
            const at = posOf(w);
            const hop = Math.min(TRAVEL * 0.09, 1.1);
            const start = Math.max(0, at - hop);

            // The word reacts to the spark landing on it: a tilt and a small
            // duck, alternating direction so consecutive hits don't look
            // mechanical. Rotation and y only — no scale, and because both are
            // transforms the nowrap line never reflows.
            const dir = k % 2 === 0 ? -1 : 1;
            tl.to(w, {
                rotate: 3.5 * dir, y: -8, duration: fillDur, ease: 'back.out(3)',
            }, `travel+=${at}`)
                .to(w, {
                    rotate: 0, y: 0, duration: fillDur * 2, ease: EASE.text,
                }, `travel+=${at + fillDur}`);

            if (k === 0) {
                tl.set(marker, { x: px(w), y: py(w), autoAlpha: 1 }, `travel+=${start}`);
                return;
            }

            // Parabolic hop: x travels linearly while y arcs up then down.
            tl.to(marker, { x: px(w), duration: hop, ease: 'none' }, `travel+=${start}`)
                .to(marker, { y: () => py(w)() - 80, duration: hop / 2, ease: 'power2.out' }, `travel+=${start}`)
                .to(marker, { y: py(w), duration: hop / 2, ease: 'power2.in' }, `travel+=${start + hop / 2}`)
                .to(marker, { rotate: '+=200', duration: hop, ease: 'none' }, `travel+=${start}`);
        });

        tl.to({}, { duration: TAIL });

        // ── Scrub counters ───────────────────────────────────────────────
        gsap.utils.toArray('.impact-value').forEach((el) => {
            const counter = { v: 0 };
            const { to, suffix } = el.dataset;
            gsap.to(counter, {
                v: Number(to),
                ease: 'none',
                onUpdate: () => { el.textContent = Math.round(counter.v) + suffix; },
                scrollTrigger: { trigger: '.impact-row', start: 'top 85%', end: 'top 40%', scrub: SCRUB },
            });
        });

        // Not scrubbed — these fire once and keep their shaped ease.
        gsap.utils.toArray('.reveal').forEach((el) => {
            gsap.from(el, {
                opacity: 0, y: 40, duration: 0.9, ease: EASE.text,
                scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            });
        });
    }, { scope: containerRef });

    return (
        <>
            <img
                ref={flyerRef}
                src={photo}
                alt=""
                aria-hidden="true"
                className="fixed top-0 left-0 object-contain drop-shadow-xl pointer-events-none invisible"
            />

            <section ref={containerRef} className="relative pb-40">
                <PageColumn>
                    <header className="px-6 md:px-10 flex flex-col md:flex-row gap-10 md:gap-16 pt-4 md:pt-8">
                        <div className="shrink-0">
                            <img
                                ref={destRef}
                                src={photo}
                                alt="Rudra Pratap Singh"
                                /* drop-shadow, not shadow-xl: these PNGs carry transparent
                                   margins, and box-shadow traces the bounding rect. */
                                className="about-photo w-36 md:w-52 -rotate-[5deg] drop-shadow-xl"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            {/* The name demotes to the label so the route itself
                                can be the headline — it echoes the terminal
                                voice already on the homepage. */}
                            <p className="about-eyebrow font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60 mb-4">
                                Rudra Pratap Singh
                            </p>
                            <h1 className="about-name font-lexend text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tighter text-amber-950 leading-[0.9]">
                                <span className="text-amber-600">/</span>about
                            </h1>
                        </div>
                    </header>
                </PageColumn>

                {/* Full width by default — RootLayout no longer imposes a column,
                    so there is no full-bleed break-out to fight the pin. */}
                <div className="hscroll-pin h-screen overflow-hidden mt-10 flex items-center">
                    {/* relative: the spark is absolutely positioned against the
                        track, so it travels with the text and only ever needs
                        offsets relative to the words themselves. */}
                    <div ref={trackRef} className="relative w-max will-change-transform">
                        <p
                            /* 50vw each side: without it the first and last
                               words can never reach the centre of the screen,
                               so the fill point would start pinned to the left
                               edge and end pinned to the right. */
                            className="statement font-lexend font-medium tracking-tighter whitespace-nowrap pl-[50vw] pr-[50vw] leading-none"
                            style={{ fontSize: STATEMENT_SIZE }}
                        >
                            {STATEMENT}
                        </p>

                        <svg
                            ref={markerRef}
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            aria-hidden="true"
                            className="absolute top-0 left-0 invisible pointer-events-none"
                        >
                            <path
                                d="M14 0 L17.2 10.8 L28 14 L17.2 17.2 L14 28 L10.8 17.2 L0 14 L10.8 10.8 Z"
                                fill="#b45309"
                            />
                        </svg>
                    </div>
                </div>

                <PageColumn>
                    <div className="impact-row px-6 md:px-10 mt-40 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-amber-900/15 pt-12">
                        {IMPACT.map(({ to, suffix, label }) => (
                            <div key={label}>
                                <p
                                    className="impact-value font-lexend text-5xl md:text-7xl font-semibold tracking-tighter text-amber-950 leading-none tabular-nums"
                                    data-to={to}
                                    data-suffix={suffix}
                                >
                                    0{suffix}
                                </p>
                                <p className="mt-4 font-lexend text-[11px] uppercase tracking-[0.18em] text-amber-700/70 whitespace-pre-line leading-relaxed">
                                    {label}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 md:px-10 mt-32 md:mt-48">
                        <p className="reveal font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60 mb-10">Where</p>
                        {CREDITS.map(({ company, period, work }) => (
                            <div key={company} className="reveal border-t border-amber-900/15 py-8">
                                <div className="flex items-baseline justify-between gap-6">
                                    <h2 className="font-lexend text-2xl md:text-4xl font-semibold tracking-tighter text-amber-950">{company}</h2>
                                    <p className="font-lexend text-xs uppercase tracking-[0.18em] text-amber-700/60 shrink-0">{period}</p>
                                </div>
                                <p className="mt-4 font-lexend text-sm md:text-base leading-relaxed text-amber-950/70 max-w-4xl">{work}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 md:px-10 mt-28 md:mt-40">
                        <p className="reveal font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60 mb-10">Toolkit</p>
                        {TOOLKIT.map(({ group, items }) => (
                            <div key={group} className="reveal grid md:grid-cols-[1fr_3fr] gap-2 md:gap-12 border-t border-amber-900/15 py-6">
                                <p className="font-lexend text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">{group}</p>
                                <p className="font-lexend text-sm md:text-base text-amber-950/75 leading-relaxed">{items}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 md:px-10 mt-28 md:mt-40">
                        <p className="reveal font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60 mb-10">Before that</p>
                        {EDUCATION.map(({ school, detail, period }) => (
                            <div key={school} className="reveal grid md:grid-cols-[1fr_2fr] gap-2 md:gap-12 border-t border-amber-900/15 py-6">
                                <p className="font-lexend text-lg md:text-xl font-semibold tracking-tight text-amber-950">{school}</p>
                                <div className="flex flex-col md:flex-row md:justify-between gap-1">
                                    <p className="font-lexend text-sm md:text-base text-amber-950/75">{detail}</p>
                                    <p className="font-lexend text-xs uppercase tracking-[0.18em] text-amber-700/60 shrink-0">{period}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </PageColumn>
            </section>
        </>
    );
};

export default About;
