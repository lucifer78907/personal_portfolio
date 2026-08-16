import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { EASE } from '../../lib/eases';
import { SKILLS } from '../../lib/skills';
import { setPendingTransition } from '../../lib/pageTransition';
import { rememberScroll } from '../../lib/scrollMemory';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, SplitText);

// amber-800. Stated once, because the icons are stroked before they are filled
// and both halves have to name the same colour.
const INK = '#92400e';
// amber-700, for the edges and the pulses that run along them.
const WIRE = '#b45309';

/**
 * The stack as a graph: the heading held in the middle of one viewport, every
 * skill a node wired back to it, cards square to the page.
 *
 * Edges fade along their length — nearly invisible where they leave the
 * heading, strongest where they meet a node — so the eye is pulled outward to
 * the skills rather than into the middle, where the type already is.
 *
 * A few pulses run inward along random edges at any moment. They travel node →
 * centre, so the board reads as fifteen things reporting in.
 *
 * Click a card and its icon carries across into /skills/<slug> as a shared
 * element — the same handoff the hero's polaroids use to reach /about.
 *
 * Below md the graph is abandoned for an ordinary grid: fifteen nodes around a
 * heading needs width a phone does not have, and the edges are only correct
 * once the nodes have been placed by measurement.
 */

// The lattice the scatter is built on.
//
// Seven by three. The heading's exclusion zone eats a block of middle cells,
// and too small a lattice can leave fewer cells than there are cards — which is
// not a layout bug but a correctness one: a card with no cell keeps no
// transform and piles up untransformed in the field's corner, on top of
// whatever is already there.
const COLS = 7;
const ROWS = 3;

// Clear air kept between the heading's box and the nearest edge of any card.
const CLEARANCE = 26;

// Card width as a fraction of the field, then clamped. Sized to hold a couple
// of lines of description on hover — the previous cap was small enough that the
// blurb ran straight out of the bottom of the panel.
const SIZE = { sm: 0.062, md: 0.073, lg: 0.084 };
const MIN_W = 104;
const MAX_W = 168;

// Pulses in flight at once.
const PULSES = 3;

// Deterministic scatter. NOT Math.random: that re-rolls on every render, so a
// hot reload would rearrange the board and no layout could ever be judged. The
// golden-ratio fractional part scatters just as well and is identical on every
// load. (The pulses below DO use randomness — they are timing, not layout.)
const frac = (i, k) => (i * k) % 1;

const sizeFor = (i) => {
    const f = frac(i, 0.6180339887);
    return f < 0.34 ? 'sm' : f < 0.72 ? 'md' : 'lg';
};

/**
 * Distance from a rectangle's centre to its edge, along a unit direction.
 *
 * Used at both ends of every edge, so a line starts at the heading's boundary
 * rather than under its type, and stops at the card's boundary rather than
 * running beneath a card whose ground is the page and would show it through.
 */
const rectHit = (halfW, halfH, ux, uy) => Math.min(
    ux === 0 ? Infinity : halfW / Math.abs(ux),
    uy === 0 ? Infinity : halfH / Math.abs(uy),
);

const Skills = () => {
    const containerRef = useRef(null);
    const fieldRef = useRef(null);
    const headingRef = useRef(null);
    const cardsRef = useRef([]);
    const linesRef = useRef([]);
    const gradsRef = useRef([]);
    const pulsesRef = useRef([]);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    // The icon is the shared element, so the rect handed across is the icon's,
    // not the card's — the destination page lands an icon, and measuring the
    // card here would make it fly from the wrong box.
    //
    // The hover face's icon first, because a click can only happen while that
    // face is up, and the two faces put their icons in different places. Falling
    // back to the resting one covers a tap on the rail, and keyboard
    // activation, where nothing is hovered at all.
    const open = (e, skill) => {
        const icon = e.currentTarget.querySelector('.skill-icon-hover')
            || e.currentTarget.querySelector('.skill-icon');
        if (!icon) return;

        // The board sits near the bottom of a long page. Without this, coming
        // back from a skill lands you at the top of the home page with the board
        // you were reading somewhere below the fold.
        rememberScroll(pathname, ScrollSmoother.get()?.scrollTop() ?? window.scrollY);
        const { top, left, width, height } = icon.getBoundingClientRect();
        setPendingTransition({ kind: 'skill', slug: skill.slug, rect: { top, left, width, height } });
        navigate(`/skills/${skill.slug}`);
    };

    useGSAP(() => {
        const field = fieldRef.current;
        const cards = cardsRef.current.filter(Boolean);
        const veils = gsap.utils.toArray('.skill-veil');
        const lines = linesRef.current.filter(Boolean);
        const grads = gradsRef.current.filter(Boolean);
        const pulses = pulsesRef.current.filter(Boolean);

        // ── Placement ────────────────────────────────────────────────────
        // Runs BEFORE the reveal timeline is built, and writes to a different
        // element than the reveal animates. Both halves matter: a from() tween
        // records its end values the moment it is created, so a reveal built
        // first would have captured x:0/y:0 and then dragged every card back to
        // the centre when it played — which is what stacked them into one pile.
        const mm = gsap.matchMedia();

        mm.add('(min-width: 768px)', () => {
            /**
             * One card per cell, jittered inside it.
             *
             * The jitter is bounded by the room the LARGEST card leaves in a
             * cell, which is what makes overlap impossible rather than merely
             * unlikely — no card can reach out of its own cell, so no two can
             * meet. Every generated scatter tried before this one (golden
             * angle, elliptical ring) put cards on top of each other, because
             * spreading points evenly by angle says nothing about the boxes
             * drawn around them.
             */
            const place = () => {
                const W = field.offsetWidth;
                const H = field.offsetHeight;
                const cx = W / 2;
                const cy = H / 2;
                const cellW = W / COLS;
                const cellH = H / ROWS;

                const dims = cards.map((_, i) => {
                    const w = gsap.utils.clamp(MIN_W, MAX_W, W * SIZE[sizeFor(i)]);
                    return { w, h: (w * 4) / 3 };
                });

                // Cells are tested against the biggest card, so a cell that
                // survives is safe for whichever card ends up in it.
                const maxW = Math.max(...dims.map((d) => d.w));
                const maxH = Math.max(...dims.map((d) => d.h));
                const roomX = Math.max(0, (cellW - maxW) / 2);
                const roomY = Math.max(0, (cellH - maxH) / 2);

                // Measured, not assumed: the heading is fluid type, so its box
                // changes with the viewport and with whether Lexend has landed.
                const head = headingRef.current;
                const headHalfW = head.offsetWidth / 2;
                const headHalfH = head.offsetHeight / 2;
                const hw = headHalfW + CLEARANCE + maxW / 2;
                const hh = headHalfH + CLEARANCE + maxH / 2;

                const cells = [];
                const blocked = [];
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        const k = r * COLS + c;
                        const x = (c + 0.5) * cellW + (frac(k, 0.6180339887) - 0.5) * 2 * roomX;
                        const y = (r + 0.5) * cellH + (frac(k, 0.7320508076) - 0.5) * 2 * roomY;
                        const dx = x - cx;
                        const dy = y - cy;

                        if (Math.abs(dx) < hw && Math.abs(dy) < hh) {
                            // Shunted straight up or down to the near edge of
                            // the heading's box, keeping its column.
                            blocked.push({ x, y: cy + Math.sign(dy || 1) * hh, k });
                            continue;
                        }
                        cells.push({ x, y, k, d: Math.hypot(dx, dy) });
                    }
                }

                // The lattice is sized to make this unreachable; the guard is
                // here because "unreachable" depends on how wide the heading
                // renders, which depends on the font and the viewport.
                if (cells.length < cards.length) {
                    blocked.slice(0, cards.length - cells.length).forEach((b) => {
                        cells.push({ ...b, d: Math.hypot(b.x - cx, b.y - cy) });
                    });
                }

                // More cells survive than there are cards. Dropping the ones
                // nearest the middle keeps the board pushed out and the type in
                // clear air; sorting back by cell index after means a card's
                // position does not depend on how many cells the heading
                // happened to eat at this width.
                const chosen = cells
                    .sort((a, b) => b.d - a.d)
                    .slice(0, cards.length)
                    .sort((a, b) => a.k - b.k);

                cards.forEach((card, i) => {
                    const slot = chosen[i];
                    if (!slot) return;
                    const { w, h } = dims[i];
                    const nx = gsap.utils.clamp(w / 2 + 4, W - w / 2 - 4, slot.x);
                    const ny = gsap.utils.clamp(h / 2 + 4, H - h / 2 - 4, slot.y);

                    gsap.set(card, { width: w, xPercent: -50, yPercent: -50, x: nx, y: ny });

                    // ── The edge to this node ────────────────────────────
                    const dx = nx - cx;
                    const dy = ny - cy;
                    const len = Math.hypot(dx, dy) || 1;
                    const ux = dx / len;
                    const uy = dy / len;

                    const from = rectHit(headHalfW + 14, headHalfH + 14, ux, uy);
                    const to = len - rectHit(w / 2 + 6, h / 2 + 6, ux, uy);

                    const line = lines[i];
                    const grad = grads[i];
                    if (!line || !grad) return;

                    // A node closer in than the heading's own box leaves no
                    // edge to draw; hide it rather than drawing it backwards.
                    if (to <= from) {
                        line.setAttribute('opacity', '0');
                        return;
                    }
                    line.setAttribute('opacity', '1');

                    const x1 = cx + ux * from;
                    const y1 = cy + uy * from;
                    const x2 = cx + ux * to;
                    const y2 = cy + uy * to;

                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);

                    // The gradient runs in user space along the same two
                    // points as the line, so "light at the centre, darker at
                    // the node" holds whichever direction the edge points.
                    grad.setAttribute('x1', x1);
                    grad.setAttribute('y1', y1);
                    grad.setAttribute('x2', x2);
                    grad.setAttribute('y2', y2);
                });
            };

            place();
            // The lattice is measured off the field, and the field is sized in
            // vh — so a resize moves every card, and every edge, at once.
            ScrollTrigger.addEventListener('refresh', place);
            return () => ScrollTrigger.removeEventListener('refresh', place);
        });

        // ── Arrival ──────────────────────────────────────────────────────
        // Every drawable shape inside every icon. react-icons ship filled paths,
        // so to draw them they first have to be turned inside out: no fill, a
        // stroke to trace, and only once the outline is complete does the fill
        // arrive underneath it.
        const glyphs = gsap.utils.toArray('.skill-icon path, .skill-icon circle, .skill-icon rect, .skill-icon polygon, .skill-icon polyline, .skill-icon ellipse');

        // The packs disagree about viewBox — Font Awesome draws on 512 units,
        // the Simple Icons set on 24 — so a shared strokeWidth would be a
        // hairline on one icon and a slab on the next. non-scaling-stroke takes
        // the width in screen pixels instead, which makes one number correct
        // everywhere. Set as an attribute: it is an SVG presentation attribute
        // first and a CSS property only in newer engines.
        glyphs.forEach((g) => g.setAttribute('vector-effect', 'non-scaling-stroke'));
        gsap.set(glyphs, { fill: 'transparent', stroke: INK, strokeWidth: 1.1 });

        const heading = SplitText.create('.skills-heading', { type: 'chars', mask: 'chars' });

        gsap.timeline({ scrollTrigger: { trigger: containerRef.current, start: 'top 65%', once: true } })
            .from(heading.chars, {
                yPercent: 110, duration: 0.9, stagger: 0.03, ease: EASE.arrive,
            }, 0)
            .from('.skills-sub', {
                autoAlpha: 0, y: 14, duration: 0.6, ease: EASE.text,
            }, 0.25)
            // A cream panel covers each card and slides down out of it, so the
            // card is uncovered top edge first. A real overlay rather than a
            // clip-path: the clip had to sit on the same element as the border
            // and the hover transform, and it silently swallowed the hover
            // shadow, since box-shadow paints outside the border box.
            .to(veils, {
                yPercent: 100, duration: 0.9, stagger: 0.05, ease: EASE.travel,
            }, 0.3)
            // Edges run out from the heading to meet the nodes already there.
            .from(lines, {
                drawSVG: '0%', duration: 0.9, stagger: 0.04, ease: EASE.travel,
            }, 0.9)
            // Then the icons draw themselves. No stagger here, deliberately:
            // every glyph is on the same clock, so the board resolves as one
            // gesture rather than fifteen.
            .from(glyphs, {
                drawSVG: '0%', duration: 1.1, ease: EASE.travel,
            }, 1.7)
            // Fill arrives under the finished outline, then the outline retires,
            // leaving the icons exactly as they render normally.
            .to(glyphs, { fill: INK, duration: 0.45, ease: EASE.text }, 2.7)
            .to(glyphs, { strokeWidth: 0, duration: 0.4, ease: EASE.text }, 2.85)
            // Hand colour back to CSS once the reveal owns nothing: react-icons
            // paint with currentColor, so an inline fill left by the tween above
            // would outrank the hover's text colour and the icon would stay
            // amber-800 over the dark panel instead of inverting to cream.
            .set(glyphs, { clearProps: 'fill,stroke,strokeWidth' })
            .call(() => pulses.forEach((p, i) => gsap.delayedCall(i * 0.55, () => beat(p))));

        // ── Pulses ───────────────────────────────────────────────────────
        // Each one picks an edge, runs it inward, rests, and picks again — so at
        // any moment two or three are in flight on unrelated edges and the
        // pattern never loops visibly.
        //
        // Math.random is fine here and nowhere else in this file: this is
        // timing, which nobody can diff between reloads, not layout, which is
        // judged by eye and has to hold still.
        const beat = (dot) => {
            const line = lines[Math.floor(Math.random() * lines.length)];
            if (!line || line.getAttribute('opacity') === '0') {
                gsap.delayedCall(0.6, () => beat(dot));
                return;
            }

            const x1 = Number(line.getAttribute('x1'));
            const y1 = Number(line.getAttribute('y1'));
            const x2 = Number(line.getAttribute('x2'));
            const y2 = Number(line.getAttribute('y2'));
            const run = 1.1 + Math.random() * 0.9;

            gsap.timeline({
                onComplete: () => gsap.delayedCall(0.3 + Math.random() * 2.4, () => beat(dot)),
            })
                // Node to centre: the skill reporting in, not the other way.
                .set(dot, { attr: { cx: x2, cy: y2 }, opacity: 0 })
                .to(dot, { opacity: 1, duration: 0.25 }, 0)
                .to(dot, { attr: { cx: x1, cy: y1 }, duration: run, ease: 'none' }, 0)
                .to(dot, { opacity: 0, duration: 0.35 }, run - 0.35);
        };
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="px-4 md:px-6 py-16 md:py-0 mb-24 overflow-hidden">
            <div ref={fieldRef} className="relative md:h-[96vh] md:min-h-[680px]">
                {/* The wiring. Below md the nodes are in a grid and were never
                    measured, so there is nothing correct to draw. */}
                <svg
                    className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
                    aria-hidden="true"
                >
                    <defs>
                        {SKILLS.map((s, i) => (
                            <linearGradient
                                key={s.slug}
                                id={`skill-edge-${i}`}
                                ref={(el) => { gradsRef.current[i] = el; }}
                                gradientUnits="userSpaceOnUse"
                            >
                                {/* Barely there where it leaves the type… */}
                                <stop offset="0%" stopColor={WIRE} stopOpacity="0.04" />
                                <stop offset="55%" stopColor={WIRE} stopOpacity="0.2" />
                                {/* …and strongest where it arrives. */}
                                <stop offset="100%" stopColor={WIRE} stopOpacity="0.6" />
                            </linearGradient>
                        ))}
                    </defs>

                    {SKILLS.map((s, i) => (
                        <line
                            key={s.slug}
                            ref={(el) => { linesRef.current[i] = el; }}
                            stroke={`url(#skill-edge-${i})`}
                            strokeWidth="1"
                            strokeLinecap="round"
                        />
                    ))}

                    {Array.from({ length: PULSES }, (_, i) => (
                        <circle
                            key={i}
                            ref={(el) => { pulsesRef.current[i] = el; }}
                            r="2.6"
                            fill={WIRE}
                            opacity="0"
                        />
                    ))}
                </svg>

                {/* Flat, and outside anything the cards are transformed by. */}
                <div
                    ref={headingRef}
                    className="pointer-events-none z-10 mb-12 w-max max-w-full mx-auto text-center md:absolute md:left-1/2 md:top-1/2 md:mb-0 md:-translate-x-1/2 md:-translate-y-1/2"
                >
                    <h2 className="skills-heading font-lexend text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tighter text-amber-950">
                        Ctrl + Alt + Skills
                    </h2>
                    <p className="skills-sub mt-3 font-lexend text-sm sm:text-base font-medium tracking-tighter text-amber-700/50">
                        Endorsed by Mom and LinkedIn
                    </p>
                </div>

                {/*
                  A horizontal snap rail below md; at md+ it becomes the field's
                  own box again so the absolutely-placed cards resolve against
                  the same rect that place() measures.

                  Native scroll-snap, no JavaScript in the loop — which is the
                  same reasoning as dropping normalizeScroll in RootLayout: the
                  platform's own momentum is better than anything re-implemented
                  on top of it, and this rail scrolls inside a page that is
                  already scrolling.

                  The horizontal padding is what centres the first and last card
                  rather than leaving them jammed against the edges, since
                  snap-center aligns to the scrollport's middle.
                */}
                <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[28vw] pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:absolute md:inset-0 md:mx-0 md:block md:overflow-visible md:px-0 md:pb-0">
                    {SKILLS.map((skill, i) => {
                        const { slug, label, group, Icon, blurb } = skill;
                        return (
                            <button
                                key={slug}
                                ref={(el) => { cardsRef.current[i] = el; }}
                                type="button"
                                onClick={(e) => open(e, skill)}
                                aria-label={`${label} — ${blurb}`}
                                /* Sized to sit in the same proportion as a tile
                                   on the desktop board, now that the rail shows
                                   the same card rather than a big dark one with
                                   a paragraph in it — and small enough that two
                                   or three are in view, so it reads as a set.
                                   At md+ the scatter takes over and GSAP writes
                                   an inline width, which is why there is no
                                   width utility past that breakpoint to fight. */
                                className="skill-card group relative block w-[44vw] max-w-[180px] shrink-0 snap-center text-left md:absolute md:left-0 md:top-0 md:w-auto md:max-w-none md:shrink"
                            >
                                {/* Clipping shell. Carries the hover transform —
                                    which lives here and not on the button,
                                    because the button's box is what the scatter
                                    placed and what the pointer is tested
                                    against, and growing it would shift both —
                                    plus the shadow, plus the overflow that hides
                                    the veil once it has slid away.

                                    The border lives one level in, so the veil
                                    can cover that too: a card revealing its
                                    contents while its own outline was already
                                    drawn would give the trick away. */}
                                <div className="skill-card-inner relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-[#fffbeb] transition-[transform,box-shadow] duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.1] group-hover:shadow-[0_20px_44px_rgba(69,26,3,0.18)]">
                                    {/* ── The resting card ───────────────────
                                        Its own finished thing. Nothing in here
                                        animates on hover: it is not transformed
                                        into the other card, it is covered by it. */}
                                    <div className="absolute inset-0 rounded-sm border border-amber-900/25">
                                        <div className="flex h-full w-full flex-col items-center justify-center px-3 text-center">
                                            <span className="absolute inset-x-0 top-3.5 font-lexend text-[7.5px] uppercase tracking-[0.24em] text-amber-700/50">
                                                {group}
                                            </span>

                                            {/* text-amber-800, not a fill class:
                                                react-icons paint with
                                                currentColor, and the reveal
                                                clears the inline fill it tweened
                                                so colour goes back to being
                                                CSS's to change. */}
                                            <Icon className="skill-icon shrink-0 text-amber-800" size="2.3em" />
                                            <span className="mt-2 font-lexend text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-950">
                                                {label}
                                            </span>
                                        </div>
                                    </div>

                                    {/* ── The hovered card ───────────────────
                                        A second, complete card — dark ground,
                                        its own icon, its own type — revealed by
                                        a window opening downward over the first.

                                        Two counter-translated layers, and that
                                        is the whole trick of a mask: the OUTER
                                        one is the window, parked a full card
                                        above and sliding down to 0; the INNER
                                        one is pushed a full card DOWN inside it,
                                        so while the window travels the card it
                                        holds sits perfectly still in the page.
                                        Cancel either translate and the content
                                        slides instead of being uncovered.

                                        Transforms, not height or clip-path: both
                                        layers composite on the GPU, and nothing
                                        here is ever squashed the way a scaleY on
                                        a filled box would squash it.

                                        No group tag: once the description is
                                        showing, a category label is the least
                                        interesting thing on the card.

                                        Hidden at every width, including mobile.
                                        It was pinned open on the rail so touch
                                        users would see the description, but a
                                        board of dark cards on a cream page is a
                                        different design, not the same one — the
                                        rail now shows exactly the card the
                                        desktop board does, and the description
                                        lives on the page a tap away. */}
                                    <div className="pointer-events-none absolute inset-0 -translate-y-full overflow-hidden transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                                        <div className="absolute inset-0 translate-y-full transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
                                            {/* One scale again, now that this face
                                                only ever appears on hover and so
                                                only ever on the desktop tile.
                                                Sized in h/w rather than
                                                react-icons' `size` prop, which
                                                writes fixed width/height
                                                attributes CSS then has to fight. */}
                                            <div className="flex h-full w-full flex-col items-center justify-center bg-[#451a03] px-3 py-4 text-center">
                                                <Icon className="skill-icon-hover h-7 w-7 shrink-0 text-amber-50" />
                                                <span className="mt-2 font-lexend text-[9px] font-semibold uppercase tracking-[0.14em] text-amber-50">
                                                    {label}
                                                </span>
                                                <p className="mt-2 font-lexend text-[8px] leading-[1.5] text-amber-100/70">
                                                    {blurb}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* The veil. Sits over the finished card and
                                        slides down out of the shell on reveal.
                                        Above everything, never a pointer target. */}
                                    <div className="skill-veil pointer-events-none absolute inset-0 z-20 bg-[#fffbeb]" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Skills;
