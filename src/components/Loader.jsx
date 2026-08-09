import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useIntro } from "../context/introContext";
import { EASE } from "../lib/eases";
import { PANELS } from "../lib/palette";

gsap.registerPlugin(Flip, MorphSVGPlugin, ScrambleTextPlugin);

/**
 * The word is the hero's first line, verbatim — not a greeting that resembles it.
 *
 * That identity is the whole trick: because the string, family, weight and
 * tracking all match [Hero.jsx]'s `.heading-line-1`, the loader's box and the
 * heading's box are similar rectangles, so a single uniform scale maps one onto
 * the other exactly. Change this and the Flip stops landing flush.
 */
const WORD = "Hi there!";
const HEADING_TARGET = ".heading-line-1";
const HEADING_COLOR = "#422006"; // text-yellow-950, what the heading resolves to

// Seeded into the markup so frame zero is already scrambled — same length as
// WORD. A paused tween doesn't render until something asks it to, and progress(0)
// on a tween already at 0 can no-op, so the first frame would otherwise be empty.
const SEED = "#%X@!$Z&M";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&@!$";

// One tween, one curve, no stalls. The count runs on quartInOut — the same ease
// the nav panels travel on — so it eases in, carries through the middle, and
// settles into 100 as a single move.
const COUNT_DURATION = 2.8;

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
    const textRef = useRef(null);
    const counterRef = useRef(null);
    const ruleRef = useRef(null);
    const { finishIntro } = useIntro();

    useGSAP(() => {
        const panels = gsap.utils.toArray(".loader-panel");
        const curves = gsap.utils.toArray(".loader-curve");

        // Paused and never played — only scrubbed from the counter, so 0% is fully
        // scrambled and 100% is the resolved word by construction. Running it on
        // its own timer alongside the count would only ever approximate that, and
        // the two would drift apart the moment either duration changed.
        const scramble = gsap.to(textRef.current, {
            duration: 1,
            ease: "none",
            paused: true,
            scrambleText: {
                text: WORD,
                chars: SCRAMBLE_CHARS,
                speed: 0.6,
                revealDelay: 0,
                // Hold the full length from the first frame. Letting it tween would
                // make the word grow out of nothing and shove the layout around.
                tweenLength: false,
            },
        });

        const counter = { value: 0 };
        const tl = gsap.timeline();

        tl.to(counter, {
            value: 100,
            duration: COUNT_DURATION,
            ease: EASE.travel,
            snap: { value: 1 },
            onUpdate: () => {
                counterRef.current.textContent = counter.value;
                scramble.progress(counter.value / 100);
                gsap.set(ruleRef.current, { scaleX: counter.value / 100 });
            },
        }, 0);

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
                <div
                    ref={markRef}
                    className="loader__mark relative grid place-items-center font-lexend text-6xl font-semibold tracking-tighter text-amber-100 md:text-8xl"
                >
                    {/*
                      The hidden copy reserves the box at the resolved word's width.
                      Scramble characters are wider than the real ones, so without it
                      the centred text would shove itself left and right every frame
                      — and the Flip would measure a box that keeps changing.
                    */}
                    <span className="invisible" aria-hidden="true">{WORD}</span>
                    <span
                        ref={textRef}
                        className="absolute inset-0 grid place-items-center whitespace-pre"
                    >
                        {SEED}
                    </span>
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
