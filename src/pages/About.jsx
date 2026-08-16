import { Fragment, useLayoutEffect, useRef, useState } from 'react';
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

// One sentence, one unbroken line — but built from tokens rather than a single
// string, because the load-bearing phrases are set on coloured banners and the
// rest is plain fill. Reading them in order still gives you the sentence.
//
// `tight` means "no space before this token" — the separating spaces are bare
// text nodes in the paragraph, deliberately outside every split target, so
// SplitText can never eat them.
//
// `open` means the token is already there when the page loads: no fill, no
// flight, no cue. The opening clause is the one thing on this page a visitor
// should not have to scroll to earn.
//
// No employer names: they date the page, they mean nothing to a stranger, and
// the credits block further down already carries them.
const TOKENS = [
    { text: 'I’m a', open: true },
    { card: 'software engineer', tone: 'ink', open: true },
    { text: '. I build', tight: true },
    { card: 'fintech', tone: 'sun' },
    { text: 'that moves money,' },
    { card: 'AI products', tone: 'ember' },
    { text: 'that do real work, and the' },
    { card: 'agentic workflows', tone: 'sun' },
    { text: 'running quietly underneath them.' },
];

// The floor is set by the mobile paragraph, not the desktop line: below md the
// sentence wraps, and the longest banner ("software engineer") has to fit one
// line of a 360px screen without breaking.
const STATEMENT_SIZE = 'clamp(1.9rem, 7vw, 10rem)';

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

const SCRUB = 2;          // playhead catch-up — this is what makes it glide
// Scroll distance per pixel travelled. Below 1 the line moves faster than the
// scrollbar — necessary, because at STATEMENT_SIZE the sentence is five
// viewports wide and a 1:1 mapping buys a section you scroll for a minute.
const SCROLL_MULT = 0.75;
const TRAVEL = 10;        // timeline units for the horizontal move
const LEAD = 0.15;        // brief settle before it starts moving
const TAIL = 0.4;         // hold after it lands

const LIT = '#451a03';                  // filled
const UNLIT = 'rgba(69, 26, 3, 0.13)';  // not yet filled

// Banner colours. Three tiers of the same amber the rest of the site runs on —
// a vivid green/pink pair would pop harder, but it would also read as somebody
// else's palette pasted onto a cream page.
const TONE = {
    ink: { bg: '#451a03', fg: '#fffbeb' },
    ember: { bg: '#d97706', fg: '#fffbeb' },
    sun: { bg: '#fbbf24', fg: '#451a03' },
};

// Resting tilt per banner, in source order. Alternating signs so a run of
// cards doesn't look like a stack that slipped one way.
const TILT = [-1.8, 1.4, -1.2, 2];

// Decorations. Each one lives INSIDE the banner it hangs off and is placed in
// percentages of it, so there is nothing to measure: it travels with the banner
// and survives a reflow at any font size. `dx` is a fraction of the banner's
// width; `place` is which side of the line it sits on.
//
// Nothing hangs off the first two banners on purpose — at the head of the line
// they were on screen before the travel had started, so they read as furniture
// rather than as something arriving.
const DECOR = [
    { anchor: 2, place: 'top', dx: 0.3, kind: 'diamond', spin: 160 },
    { anchor: 2, place: 'bottom', dx: 0.78, kind: 'dots', spin: 120 },
    { anchor: 3, place: 'top', dx: 0.55, kind: 'arc', spin: -120 },
];

// Banner order, so a decoration can name the banner it hangs off.
const CARD_TOKENS = TOKENS.filter((t) => t.card);

// Plain objects, not a component taking a `kind` prop — a component here would
// exist only to run a switch statement.
const MARKS = {
    diamond: (
        <svg width="58" height="58" viewBox="0 0 58 58" fill="none" aria-hidden="true">
            <path d="M29 2 L56 29 L29 56 L2 29 Z" fill="#451a03" />
            <path d="M29 17 L41 29 L29 41 L17 29 Z" fill="#fbbf24" />
        </svg>
    ),
    arc: (
        <svg width="84" height="84" viewBox="0 0 84 84" fill="none" aria-hidden="true">
            <path d="M8 76 A 68 68 0 0 1 76 8" stroke="#fbbf24" strokeWidth="13" strokeLinecap="round" />
        </svg>
    ),
    dots: (
        <svg width="72" height="40" viewBox="0 0 72 40" fill="none" aria-hidden="true">
            <g fill="#d97706">
                <circle cx="8" cy="32" r="6" />
                <circle cx="30" cy="22" r="6" />
                <circle cx="52" cy="12" r="6" />
            </g>
            <circle cx="66" cy="6" r="5" fill="#451a03" />
        </svg>
    ),
};

// Words in the plain runs that break out of the fill and animate character by
// character. Keyed by the word stripped to letters, so trailing punctuation
// still matches. Only plain-run words belong here — the phrases that used to be
// listed are on banners now, and a word can't have both treatments.
const WORD_FX = {
    money: 'drop',        // letters falling into place from above
    work: 'flip',         // letters rotating in on the X axis
    quietly: 'standUp',   // letters lying flat, swinging upright
};

const fxKey = (el) => el.textContent.toLowerCase().replace(/[^a-z]/g, '');

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

        // offsetLeft is measured from the nearest positioned ancestor, and the
        // banners are positioned — so a word inside one would report its offset
        // within the banner, not along the line. Walk the chain up to the track
        // instead. offset* ignores transforms, which is precisely why this can
        // be read while the track is mid-travel and still be right.
        const offsetX = (el) => {
            let x = 0;
            for (let n = el; n && n !== track; n = n.offsetParent) x += n.offsetLeft;
            return x;
        };
        const offsetY = (el) => {
            let y = 0;
            for (let n = el; n && n !== track; n = n.offsetParent) y += n.offsetTop;
            return y;
        };

        // 'words,chars' nests chars inside words, so a word can either be
        // filled as one block or animated glyph by glyph. Only the plain runs
        // are split here — banner text is split per banner below, because each
        // one needs its own independently staggered array.
        const words = SplitText.create('.stmt-plain', { type: 'words,chars' }).words;
        const cards = gsap.utils.toArray('.stmt-card');
        const cardWords = cards.map((c) =>
            SplitText.create(c.querySelector('.stmt-card-text'), { type: 'words' }).words);

        words.forEach((w) => {
            w.style.display = 'inline-block';

            if (WORD_FX[fxKey(w)]) {
                // Animated words are painted solid — the gradient fill is the
                // *other* treatment, and running both would fight each other.
                w.style.color = LIT;
                if (WORD_FX[fxKey(w)] === 'flip') w.style.perspective = '600px';
                return;
            }

            // Everything else is its own little progress bar.
            w.style.setProperty('--p', '0');
            w.style.backgroundImage = FILL_GRADIENT;
            w.style.webkitBackgroundClip = 'text';
            w.style.backgroundClip = 'text';
            w.style.color = 'transparent';
        });

        // ── One-way effects ──────────────────────────────────────────────
        // Everything except the travel itself is a paused, real-time timeline
        // that runs exactly once. Nothing that has landed gets un-landed on the
        // way back up — a banner that un-builds itself admits it was never an
        // arrival. Built here, breakpoint-agnostic; the two layouts below only
        // decide WHEN each one is let go.
        //
        // `lead` is how far ahead of the element's own moment it should start,
        // in the desktop timeline's units. Roughly one unit ≈ half a second at
        // a comfortable scroll speed, which is what these are tuned against.
        const effects = [];
        const effect = (el, lead, build, opts = {}) => {
            const fx = gsap.timeline({ paused: true });
            build(fx);
            effects.push({ el, lead, fx, ...opts });
        };

        // Tokens flagged `open` in the source. On the wide layout their effects
        // are snapped to done at load instead of cued, so the opening clause
        // reads as a standing statement rather than something the page is
        // withholding. Mobile plays them normally — there the whole paragraph
        // arrives as you scroll into it, and pre-landing the first line would
        // just look like a bug.
        const isOpen = (el) => Boolean(el.closest('[data-open]'));

        const CARD_CUE = 1.7;   // banners get the longest lead — the flight is long
        const DECOR_CUE = 1.4;
        const BEAT_CUE = 0.9;   // one spark hop
        const CHAR_CUE = 0.7;

        // On a short flourish the overshoot IS the effect, so these keep their
        // shaped eases — they're real-time one-shots, not scrubbed, so there's
        // no scrollbar for a curve to desynchronise from.
        const FX = {
            standUp: { rotate: 92, opacity: 0, transformOrigin: '0% 100%' },
            drop: { yPercent: -140, opacity: 0 },
            flip: { rotationX: -95, opacity: 0, transformOrigin: '50% 100%' },
        };

        words.forEach((w) => {
            const fx = WORD_FX[fxKey(w)];
            const open = isOpen(w);

            if (!fx) {
                effect(w, 0, (t) => t.to(w, { '--p': 100, duration: 0.45, ease: 'none' }), { open });
                return;
            }

            const chars = gsap.utils.toArray(w.children);
            gsap.set(chars, FX[fx]);

            effect(w, CHAR_CUE, (t) => t.to(chars, {
                rotate: 0,
                rotationX: 0,
                yPercent: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.042,
                ease: 'back.out(1.9)',
            }), { open });
        });

        // ── Banners ──────────────────────────────────────────────────────
        // Each one swings in out of depth, arrives empty, and only then takes
        // its words. The z-flight is a real 3D transform with per-element
        // perspective, so the banner foreshortens as it turns rather than just
        // scaling up.
        cards.forEach((card, i) => {
            const bg = card.querySelector('.stmt-card-bg');
            const inner = cardWords[i];
            const tilt = TILT[i % TILT.length];

            gsap.set(card, { rotate: tilt, transformPerspective: 1000 });
            gsap.set(bg, { transformOrigin: '0% 50%' });
            gsap.set(inner, {
                display: 'inline-block', autoAlpha: 0,
                scaleX: 0.18, scaleY: 0.6, transformOrigin: '0% 62%',
            });

            effect(card, CARD_CUE, (t) => t
                .from(card, {
                    z: -1400,
                    rotationY: i % 2 ? -34 : 34,
                    rotationX: -14,
                    autoAlpha: 0,
                    duration: 0.85,
                    ease: EASE.arrive,
                })
                // The banner widens as it fills. Layout width never changes —
                // only the painted background scales — so the rest of the
                // sentence stays exactly where it was measured.
                .from(bg, { scaleX: 0.72, duration: 0.5, ease: EASE.text }, 0.62)
                .to(inner, {
                    autoAlpha: 1, scaleX: 1, scaleY: 1,
                    duration: 0.4,
                    stagger: 0.12,
                    ease: 'back.out(2.2)',
                }, 0.68), { open: isOpen(card) });
        });

        // ── Decorations ──────────────────────────────────────────────────
        // They live inside the banner they hang off and are placed in percent,
        // so there is nothing to measure and nothing to re-measure: they travel
        // with the banner and survive a reflow at any font size.
        gsap.utils.toArray('.stmt-decor').forEach((el) => {
            gsap.set(el, { xPercent: -50 });
            effect(el.closest('.stmt-card'), DECOR_CUE, (t) => t.from(el, {
                scale: 0, rotate: Number(el.dataset.spin), autoAlpha: 0,
                duration: 0.7, ease: 'back.out(2)',
            }));
        });

        // ── Spark hops between the beats, and they react ─────────────────
        // Banners and character-animated words are the same kind of event as
        // far as the spark is concerned. Document order, not measured position:
        // it's reading order either way, which is left-to-right on the desktop
        // line and top-to-bottom in the mobile paragraph.
        const beats = [
            ...cards.map((el, i) => ({ el, rest: TILT[i % TILT.length] })),
            ...words.filter((w) => WORD_FX[fxKey(w)]).map((el) => ({ el, rest: 0 })),
        ].sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

        const px = (el) => () => offsetX(el) + el.offsetWidth / 2 - 14;
        const py = (el) => () => offsetY(el) - 34;
        const HOP = 0.5;

        beats.forEach(({ el, rest }, k) => {
            // The beat reacts to the spark landing on it: a tilt and a small
            // duck, alternating direction so consecutive hits don't look
            // mechanical. Rotation and y only — no scale, and because both are
            // transforms the line never reflows.
            const dir = k % 2 === 0 ? -1 : 1;

            effect(el, BEAT_CUE, (t) => t
                .to(el, {
                    rotate: rest + 3.5 * dir, y: -9, duration: 0.22, ease: 'back.out(3)',
                }, HOP)
                .to(el, {
                    rotate: rest, y: 0, duration: 0.5, ease: EASE.text,
                }, HOP + 0.22));

            // The spark is the wide layout's alone. In the wrapped paragraph
            // the lines sit on top of each other, so there is no clear air for
            // it to hop through — it just lands on the type.
            //
            // overwrite:'auto' because two hops can be in flight at once when
            // the scroll is fast; without it they blend and the spark settles
            // somewhere between two beats instead of on the second one.
            effect(el, BEAT_CUE, (t) => {
                if (k === 0) {
                    t.set(marker, { x: px(el), y: py(el), autoAlpha: 1 });
                    return;
                }
                // Parabolic hop: x travels linearly while y arcs up then down.
                const arc = () => py(el)() - Math.max(34, el.offsetHeight * 0.55);
                t.to(marker, { x: px(el), duration: HOP, ease: 'none', overwrite: 'auto' }, 0)
                    .to(marker, { y: arc, duration: HOP / 2, ease: 'power2.out' }, 0)
                    .to(marker, { y: py(el), duration: HOP / 2, ease: 'power2.in' }, HOP / 2)
                    .to(marker, { rotate: '+=200', duration: HOP, ease: 'none' }, 0);
            }, { wide: true });
        });

        // ── Playback ─────────────────────────────────────────────────────
        const mm = gsap.matchMedia();

        // Desktop: the sentence runs sideways under a pin. The travel stays
        // scrubbed in both directions — it IS the scroll position, and a line
        // that refused to run backwards would strand you mid-sentence on the
        // way up — while the effects fire off the playhead, once each.
        mm.add('(min-width: 768px)', () => {
            // Measured, not assumed — the sentence's real width depends on the
            // font, the viewport and where clamp() lands.
            const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

            // Each element is timed from where it ACTUALLY sits, not from an
            // even stagger — so it fires at the moment it crosses the centre of
            // the viewport and the fill point stays put instead of drifting.
            //
            // Track x at time t is -distance × (t / TRAVEL). A word is centred
            // when its centre minus that offset equals half the viewport, so:
            //     t = TRAVEL × (centreX − halfViewport) / distance
            const posOf = (el) => {
                const d = distance();
                if (d <= 0) return 0;
                const centreX = offsetX(el) + el.offsetWidth / 2;
                return gsap.utils.clamp(0, TRAVEL, TRAVEL * ((centreX - window.innerWidth / 2) / d));
            };

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

            // ease:'none' — the translation is the scroll surrogate. Any curve
            // and the words stop lining up with where they actually are.
            tl.to({}, { duration: LEAD })
                .addLabel('travel')
                .to(track, { x: () => -distance(), ease: 'none', duration: TRAVEL }, 'travel')
                .to({}, { duration: TAIL });

            const cues = [];
            effects.forEach(({ el, lead, fx, open }) => {
                if (open) { fx.progress(1); return; }
                cues.push({ at: LEAD + Math.max(0, posOf(el) - lead), fx, fired: false });
            });

            // Anything more than LATE behind the playhead is snapped to its end
            // state rather than replayed — otherwise reloading the page halfway
            // through the section fires the whole sentence at once.
            const LATE = 0.8;

            const sweep = () => {
                const t = tl.time();
                for (const c of cues) {
                    if (c.fired || t < c.at) continue;
                    c.fired = true;
                    if (t > c.at + LATE) c.fx.progress(1);
                    else c.fx.play(0);
                }
            };
            tl.eventCallback('onUpdate', sweep);
            sweep();
        });

        // Mobile: no pin, no travel — it's a paragraph you scroll past, and
        // each effect is cued off its own arrival in the viewport. `once` is
        // doing the same job the cue latch does on desktop.
        mm.add('(max-width: 767px)', () => {
            effects.filter((e) => !e.wide).forEach(({ el, fx }) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                    onEnter: () => fx.play(0),
                });
            });
        });

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
                    {/* Kept deliberately short. Everything above the pinned
                        line is dead height you scroll past once, and it was
                        pushing the sentence most of a viewport down the page. */}
                    <header className="px-6 md:px-10 flex flex-col md:flex-row gap-8 md:gap-14 pt-2 md:pt-4">
                        <div className="shrink-0">
                            <img
                                ref={destRef}
                                src={photo}
                                alt="Rudra Pratap Singh"
                                /* drop-shadow, not shadow-xl: these PNGs carry transparent
                                   margins, and box-shadow traces the bounding rect. */
                                className="about-photo w-32 md:w-44 -rotate-[5deg] drop-shadow-xl"
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
                {/* Below md this is an ordinary block and the sentence wraps.
                    From md up it becomes the pinned viewport the line travels
                    across — pb, not items-start, so the line still centres,
                    just above the true middle: that reclaims some of the gap
                    under the header and leaves the decorations room to sit. */}
                <div className="hscroll-pin flex items-center py-16 md:py-0 md:h-screen md:overflow-hidden md:pb-[12vh]">
                    {/* relative: the spark is absolutely positioned against the
                        track, so it travels with the text and only ever needs
                        offsets relative to the words themselves. */}
                    <div ref={trackRef} className="relative w-full md:w-max will-change-transform">
                        <p
                            /* Desktop padding is asymmetric on purpose. 50vw on
                               the right is load-bearing — without it the last
                               words can never reach the centre of the screen,
                               so the fill point would end up pinned to the right
                               edge. On the left it only bought half a blank
                               screen at rest; the opening words simply land
                               pre-filled instead, because posOf() clamps
                               anything already left of centre to the start of
                               the travel. */
                            /* leading-[1.34] below md, not 1.08.

                               The banners are inline-block with py-[0.04em] and
                               a background painted at inset-0, so their boxes are
                               TALLER than the type they hold. At 1.08 the line
                               box is shorter than the banner, and on a phone —
                               where this sentence wraps to five or six lines
                               instead of running as one — consecutive banners
                               overlapped each other. Desktop never showed it
                               because desktop never wraps. */
                            className="statement font-lexend font-medium tracking-tighter px-6 leading-[1.34] md:whitespace-nowrap md:pl-[14vw] md:pr-[50vw] md:leading-none"
                            style={{ fontSize: STATEMENT_SIZE }}
                        >
                            {TOKENS.map((t, i) => (
                                <Fragment key={t.card ?? t.text}>
                                    {/* A bare text node, owned by the paragraph
                                        and not by any split target. */}
                                    {i > 0 && !t.tight && ' '}
                                    {t.card ? (
                                        <span
                                            className="stmt-card relative inline-block px-[0.26em] py-[0.04em]"
                                            data-open={t.open ? 'true' : undefined}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="stmt-card-bg absolute inset-0 rounded-[0.07em]"
                                                style={{
                                                    background: TONE[t.tone].bg,
                                                    boxShadow: '0.09em 0.11em 0 rgba(69, 26, 3, 0.22)',
                                                }}
                                            />
                                            <span
                                                className="stmt-card-text relative"
                                                style={{ color: TONE[t.tone].fg }}
                                            >
                                                {t.card}
                                            </span>

                                            {/* hidden below md: in the wrapped
                                                paragraph a mark above a banner
                                                lands on the line above it. */}
                                            {DECOR.filter((d) => d.anchor === CARD_TOKENS.indexOf(t)).map((d) => (
                                                <span
                                                    key={d.kind}
                                                    aria-hidden="true"
                                                    data-spin={d.spin}
                                                    className="stmt-decor absolute hidden md:block invisible pointer-events-none"
                                                    style={{
                                                        left: `${d.dx * 100}%`,
                                                        [d.place === 'top' ? 'bottom' : 'top']: '86%',
                                                    }}
                                                >
                                                    {MARKS[d.kind]}
                                                </span>
                                            ))}
                                        </span>
                                    ) : (
                                        <span className="stmt-plain" data-open={t.open ? 'true' : undefined}>
                                            {t.text}
                                        </span>
                                    )}
                                </Fragment>
                            ))}
                        </p>

                        <svg
                            ref={markerRef}
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            aria-hidden="true"
                            /* hidden below md — see the spark effect: the
                               wrapped paragraph gives it nowhere to hop. */
                            className="absolute top-0 left-0 hidden md:block invisible pointer-events-none"
                        >
                            <path
                                d="M14 0 L17.2 10.8 L28 14 L17.2 17.2 L14 28 L10.8 17.2 L0 14 L10.8 10.8 Z"
                                fill="#b45309"
                            />
                        </svg>
                    </div>
                </div>

                <PageColumn>
                    {/* mt-40 was measured against where the desktop pin
                        releases. On mobile there is no pin, so it was 160px of
                        nothing. */}
                    <div className="impact-row px-6 md:px-10 mt-16 md:mt-40 grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-amber-900/15 pt-12">
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
                                {/* Stacked below md: a 2xl company name and its
                                    period on one baseline crowds badly at 360px,
                                    where "Initializ Technologies" alone is most
                                    of the width. */}
                                <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-6">
                                    <h2 className="font-lexend text-2xl md:text-4xl font-semibold tracking-tighter text-amber-950">{company}</h2>
                                    <p className="font-lexend text-xs uppercase tracking-[0.18em] text-amber-700/60 shrink-0">{period}</p>
                                </div>
                                <p className="mt-4 font-lexend text-[15px] md:text-base leading-relaxed text-amber-950/70 max-w-4xl">{work}</p>
                            </div>
                        ))}
                    </div>

                    <div className="px-6 md:px-10 mt-28 md:mt-40">
                        <p className="reveal font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-700/60 mb-10">Toolkit</p>
                        {TOOLKIT.map(({ group, items }) => (
                            <div key={group} className="reveal grid md:grid-cols-[1fr_3fr] gap-2 md:gap-12 border-t border-amber-900/15 py-6">
                                <p className="font-lexend text-sm font-semibold uppercase tracking-[0.14em] text-amber-800">{group}</p>
                                <p className="font-lexend text-[15px] md:text-base text-amber-950/75 leading-relaxed">{items}</p>
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
