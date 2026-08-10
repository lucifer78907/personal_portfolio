import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { useIntro } from "../context/introContext";
import { EASE } from "../lib/eases";
import { PANELS } from "../lib/palette";

gsap.registerPlugin(Flip, MorphSVGPlugin);

/**
 * The cycle, and the word it has to land on.
 *
 * The last entry is the one carrying structure: it is the hero's first line
 * verbatim — not a greeting that resembles it. That identity is the whole
 * trick: because the string, family, weight and tracking all match
 * [Hero.jsx]'s `.heading-line-1`, the loader's box and the heading's box are
 * similar rectangles, so a single uniform scale maps one onto the other
 * exactly. Reorder the greetings freely; change what sits last and the Flip
 * stops landing flush.
 *
 * Everything before it is free text, with one constraint: Lexend carries no
 * CJK glyphs, so こんにちは resolves by per-glyph fallback to Noto Sans JP,
 * requested alongside Lexend in index.css. A greeting in a script neither font
 * covers renders in whatever the OS substitutes, at a weight and width that
 * match nothing else in the cycle.
 */
const GREETINGS = ["Namaste", "Hola", "Bonjour", "こんにちは", "Ciao", "Hi there!"];
const WORD = GREETINGS[GREETINGS.length - 1];
const HEADING_TARGET = ".heading-line-1";
const HEADING_COLOR = "#422006"; // text-yellow-950, what the heading resolves to

// One tween, one curve, no stalls. The count runs on quartInOut — the same ease
// the nav panels travel on — so it eases in, carries through the middle, and
// settles into 100 as a single move.
const COUNT_DURATION = 7.8;

/**
 * The cycle runs the exact length of the count, split into equal slots.
 *
 * Derived from COUNT_DURATION rather than typed, so the two cannot drift:
 * retime the counter and the greetings retime with it, and the last one still
 * resolves as 100 arrives. The budget is fixed and the slots divide it, so
 * adding a greeting makes the cycle quicker rather than making the loader
 * longer — which is the right default for the one thing standing between a
 * visitor and the page.
 *
 * Each slot is a flip followed by a rest. The rest is what makes a greeting
 * readable instead of a smear, and the final slot's rest is what leaves the
 * word sitting still for a beat before the panels start to peel.
 */
const SLOT = COUNT_DURATION / GREETINGS.length;

/**
 * One flap, and the lag between neighbouring flaps.
 *
 * FLAP is solved for rather than typed, because a transition's real length is
 * two half-flaps — the old character falling to edge-on, the new one dropping
 * from edge-on — plus a stagger tail, and that tail is set by the LONGEST
 * greeting in the cycle rather than by whichever one is currently turning.
 * Budgeting against the longest is what keeps every transition inside its slot.
 * Shorter words simply land early and rest longer, while the beat they arrive
 * on stays metronomic, which is the half of a departure board that sells it.
 */
const LONGEST = Math.max(...GREETINGS.map((text) => [...text].length));
const FLIP_SHARE = 0.55; // how much of a slot the flip may eat; the rest is rest
const FLAP_LAG = 0.35; // stagger between neighbours, as a fraction of one flap

const FLAP = (SLOT * FLIP_SHARE) / (2 + FLAP_LAG * (LONGEST - 1));
const FLAP_STAGGER = FLAP * FLAP_LAG;

// Each character hinges on its own vanishing point rather than sharing the
// row's. A single shared perspective fans the row — characters at the edges
// turning visibly askew while the middle ones turn flat-on — which reads as one
// solid card being rotated instead of a row of independent flaps.
const FLAP_PERSPECTIVE = 520;

/**
 * The hem of each curtain.
 *
 * The panels rise, so their trailing edge is the BOTTOM one and the belly hangs
 * down behind them as they go. Same command structure as the menu's pair (one
 * cubic + a close) so MorphSVG still gets a clean 1:1 point map — only the axis
 * differs, since the menu's panels travel sideways and these travel up.
 */
const CURVE_FLAT = "M0,0 C25,0 75,0 100,0 Z";
const CURVE_DRAGGED = "M0,0 C25,100 75,100 100,0 Z";

// Height of that hem in vh. It hangs BELOW its panel, so a panel parked at
// yPercent:-100 would still leave CURVE_H of belly on screen. They travel to
// -(100 + CURVE_H) to clear it — the mirror of the menu's PANEL_PARKED.
const CURVE_H = 18;
const PANEL_EXIT = 100 + CURVE_H;

/**
 * The menu's panel choreography, verbatim — then stretched.
 *
 * NAV is copied from [Header.jsx]: the same eases, the same stagger, and the
 * same relationship between the two tweens (the hem only starts dragging 0.35
 * of the way into the travel). PACE scales the clock and nothing else, so the
 * curves stay identical to the menu's while the whole thing gets more room.
 */
const NAV = { travel: 1, morph: 0.9, stagger: 0.08, morphOffset: 0.35 };
const PACE = 1.35;

const PANEL_TRAVEL = NAV.travel * PACE;
const PANEL_STAGGER = NAV.stagger * PACE;
const CURVE_MORPH = NAV.morph * PACE;
const CURVE_OFFSET = NAV.morphOffset * PACE;

// Absolute beats, so the Flip can be scheduled against real numbers instead of
// label arithmetic. Derived rather than typed in, so retiming the peel doesn't
// silently leave the word landing on a page that's still covered.
const METER_OUT = COUNT_DURATION + 0.4;
const PEEL_AT = COUNT_DURATION + 0.5;
const PEEL_END = PEEL_AT + PANEL_STAGGER * (PANELS.length - 1) + PANEL_TRAVEL;
const FLIP_DUR = 1.1;
const FLIP_AT = PEEL_END - FLIP_DUR + 0.28; // lands just after the last panel clears

const HeroLoader = () => {
    const overlayRef = useRef(null);
    const markRef = useRef(null);
    const counterRef = useRef(null);
    const ruleRef = useRef(null);
    const { finishIntro } = useIntro();

    useGSAP(() => {
        const panels = gsap.utils.toArray(".loader-panel");
        const curves = gsap.utils.toArray(".loader-curve");

        const counter = { value: 0 };
        const tl = gsap.timeline();

        tl.to(counter, {
            value: 100,
            duration: COUNT_DURATION,
            ease: EASE.travel,
            snap: { value: 1 },
            onUpdate: () => {
                counterRef.current.textContent = counter.value;
                gsap.set(ruleRef.current, { scaleX: counter.value / 100 });
            },
        }, 0);

        // Every greeting is in the markup from the start, stacked in one box.
        // Splitting text at runtime would mean tearing these nodes down and
        // rebuilding them five times mid-timeline; rendering them once means the
        // tweens hold stable element references for the whole cycle.
        const rows = gsap.utils.toArray(".loader__greeting");
        const flapsOf = (row) => row.querySelectorAll(".loader__flap");

        // Face-down everywhere except the opening greeting, which is already
        // standing. autoAlpha rather than parking them edge-on and leaving them
        // there: six rows of zero-height glyphs share the same baseline and would
        // stack into one visible seam across the middle of the screen.
        rows.forEach((row, i) => {
            gsap.set(flapsOf(row), {
                transformPerspective: FLAP_PERSPECTIVE,
                rotationX: i === 0 ? 0 : 90,
                autoAlpha: i === 0 ? 1 : 0,
            });
        });

        // Placed at absolute beats rather than appended, the same way the peel and
        // the Flip are scheduled below — so the gap between one transition ending
        // and the next beginning IS the rest, with no filler tweens to keep in step.
        //
        // Deliberately on its own clock rather than scrubbed off the counter.
        // Scrubbing would map the cycle onto quartInOut's curve, which crawls at
        // both ends: the opening greeting would hang there, then the middle of the
        // list would flick past unread. It still cannot drift from the count,
        // because both are anchored to this timeline and both run COUNT_DURATION.
        rows.forEach((row, i) => {
            if (i === 0) return;

            const at = i * SLOT;
            const falling = flapsOf(rows[i - 1]);
            const rising = flapsOf(row);

            // Out on `leave`, in on `arrive` — the file's departure/arrival pairing,
            // which here is also what a hinged flap does under its own weight: it
            // drops away gathering speed, and the next one slams down and settles.
            tl.to(falling, {
                rotationX: -90,
                duration: FLAP,
                ease: EASE.leave,
                stagger: FLAP_STAGGER,
            }, at)
                // Handed off exactly one flap in, so each replacement starts
                // dropping on the frame its predecessor reaches edge-on. Overlap
                // any more than that and both are briefly face-on in the same spot.
                .set(rising, { autoAlpha: 1 }, at + FLAP)
                .to(rising, {
                    rotationX: 0,
                    duration: FLAP,
                    ease: EASE.arrive,
                    stagger: FLAP_STAGGER,
                }, at + FLAP)
                // Once the whole row is edge-on, not per character — anything that
                // has already fallen is projecting zero height and is invisible
                // regardless, so one set at the end of the tail is enough.
                .set(falling, { autoAlpha: 0 }, at + FLAP + FLAP_STAGGER * (falling.length - 1));
        });

        // The word is home, so drop the 3D entirely. Flip.fit scales this subtree,
        // and leaving a perspective() on every character means compositing each one
        // through its own 3D context for the length of that scale — to express a
        // transform that is identity by now anyway.
        tl.set(flapsOf(rows[rows.length - 1]), { clearProps: "transform" }, COUNT_DURATION);

        tl.to(".loader__meter", {
            opacity: 0,
            y: 20,
            duration: 0.35,
            ease: EASE.leave,
        }, METER_OUT)
            // from: "end" is the inversion the palette describes. The menu deals
            // these panels out light-first and lands the deepest one last; here the
            // deepest leaves first and the stack unpeels back up to light.
            .to(panels, {
                yPercent: -PANEL_EXIT,
                duration: PANEL_TRAVEL,
                ease: EASE.travel,
                stagger: { each: PANEL_STAGGER, from: "end" },
            }, PEEL_AT)
            // Starts 0.35 of the way into the travel, exactly as the menu's does.
            // The hem is being dragged by a curtain already moving, not animated
            // alongside it — starting them together is what makes it read as a
            // shape doing a trick instead of as weight.
            .to(curves, {
                morphSVG: CURVE_DRAGGED,
                duration: CURVE_MORPH,
                ease: EASE.arrive,
                stagger: { each: PANEL_STAGGER, from: "end" },
            }, PEEL_AT + CURVE_OFFSET)
            // The word sits above the panels, so the sheets peel out from behind it
            // and leave it floating on the bare page. Cream reads on the deep panel
            // but not on #fffbeb, so it darkens into the heading's colour on the way
            // — timed to be fully dark by the time the last panel is gone.
            .to(markRef.current, {
                color: HEADING_COLOR,
                duration: 0.9,
                ease: EASE.text,
            }, PEEL_AT + CURVE_OFFSET);

        // The heading only exists on the home route. Everywhere else there's
        // nothing to hand off to, so the word just leaves with the panels.
        const target = document.querySelector(HEADING_TARGET);

        if (target) {
            // Built inside a .call() rather than added to the timeline up front,
            // because Flip.fit measures both boxes the moment it's constructed. At
            // build time Lexend may still be loading, and a late-arriving font moves
            // both rects — measuring here means measuring what's actually on screen.
            tl.call(() => {
                Flip.fit(markRef.current, target, {
                    scale: true,
                    duration: FLIP_DUR,
                    ease: EASE.travel,
                });
            }, null, FLIP_AT)
                // The swap. finishIntro reveals the real heading line in the same
                // frame the loader's copy is hidden, and they're identical text at
                // an identical size, so there's nothing to see.
                .call(finishIntro, null, FLIP_AT + FLIP_DUR)
                .set(markRef.current, { opacity: 0 })
                .set(overlayRef.current, { display: "none" });
        } else {
            tl.to(markRef.current, {
                y: -120,
                opacity: 0,
                duration: 0.7,
                ease: EASE.leave,
            }, PEEL_AT + CURVE_OFFSET)
                .call(finishIntro, null, PEEL_END - 0.3)
                .set(overlayRef.current, { display: "none" });
        }
    }, { scope: overlayRef });

    return (
        <section ref={overlayRef} className="hero__overlay fixed inset-0 z-[101] overflow-hidden">
            {PANELS.map(({ bg }, i) => (
                // Stacked in palette order, so the deepest is on top and is what
                // you see at rest. zIndex follows the index for the same reason.
                <div
                    key={bg}
                    className="loader-panel absolute inset-0"
                    style={{ backgroundColor: bg, zIndex: i }}
                >
                    {/*
                      Hangs just past the bottom edge (top-full) and is clipped away
                      by the section's overflow-hidden, so at rest there is no hem to
                      see — it only exists once the curtain has started to lift.
                    */}
                    <svg
                        className="absolute top-full left-0 w-full"
                        style={{ height: `${CURVE_H}vh` }}
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        <path className="loader-curve" d={CURVE_FLAT} fill={bg} />
                    </svg>
                </div>
            ))}

            {/*
              Above every panel, so the peel happens behind it. Weight and tracking
              match the heading's, not the loader's own taste — see WORD.
            */}
            <div className="absolute inset-0 z-10 flex items-center justify-center">
                {/*
                  Hidden from the accessibility tree wholesale. Every greeting is in
                  the DOM at once, so without this a screen reader reads the entire
                  cycle as one run-on line — and the word it ends on is about to be
                  announced properly by the hero's real heading anyway.
                */}
                <div
                    ref={markRef}
                    aria-hidden="true"
                    className="loader__mark relative grid place-items-center font-lexend text-6xl font-semibold tracking-tighter text-amber-100 md:text-8xl"
                >
                    {/*
                      The hidden copy reserves the box at the final word's width, so
                      the mark measures the same before the cycle as after it. The
                      greetings sit on top of it absolutely and overflow it
                      symmetrically — こんにちは is full-width and runs wider than
                      "Hi there!" — but the box the Flip measures never moves.
                    */}
                    <span className="invisible">{WORD}</span>

                    {GREETINGS.map((text, i) => (
                        <span
                            key={i}
                            className="loader__greeting absolute inset-0 flex items-center justify-center whitespace-pre"
                        >
                            {/*
                              inline-block because transforms do not apply to inline
                              boxes at all — a rotationX on a bare glyph is silently
                              ignored. whitespace-pre on the row is what stops the
                              space in "Hi there!" collapsing once every character
                              has become a box of its own.
                            */}
                            {[...text].map((char, j) => (
                                <span key={j} className="loader__flap inline-block">
                                    {char}
                                </span>
                            ))}
                        </span>
                    ))}
                </div>
            </div>

            <div className="loader__meter absolute bottom-14 left-0 right-0 z-10 flex flex-col items-center">
                <p className="font-lexend text-3xl font-semibold tracking-tight text-amber-100">
                    <span ref={counterRef}>0</span> %
                </p>
                <div className="mt-3 h-px w-[min(60vw,320px)] bg-amber-100/25">
                    <div
                        ref={ruleRef}
                        className="h-full w-full origin-left bg-amber-100"
                        style={{ transform: "scaleX(0)" }}
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroLoader;
