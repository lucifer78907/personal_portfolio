import { EASE } from './eases';

/**
 * The site's covering gesture, in one place.
 *
 * A row of control points is released, each on its own random delay, and the
 * bezier drawn through them becomes the leading edge of a sheet sweeping across
 * the screen. Stack two or three sheets on a stagger and you get the layered
 * ripple the loader, the menu and the page transition all now share.
 *
 * The randomness is the effect. Give the points an even stagger and the edge
 * arrives as a straight diagonal wipe; scatter them and it reads as liquid.
 * Everything else here is bookkeeping around that one idea.
 *
 * Timings are the nav menu's, which is where this vocabulary started: panels
 * travelling for 1s on quartInOut, 0.08 apart. Every sweep on the site is
 * therefore literally the same move at a different angle.
 */

export const NUM_POINTS = 10;

const DURATION = 1;            // the menu's panel travel
const DELAY_PER_PATH = 0.08;   // the menu's panel stagger
const DELAY_POINTS_MAX = 0.16; // the ripple — each point waits its own slice

/**
 * Build one sheet's path.
 *
 * `pts` are the positions of the leading edge along the sweep axis, in the
 * 0–100 user space of a `viewBox="0 0 100 100"` with `preserveAspectRatio
 * ="none"`. Each pair is joined by a cubic whose control points sit halfway
 * between them, which is what turns a row of independent numbers into one
 * continuous curve rather than a chain of visible arcs.
 *
 * Every sweep animates its points 100 → 0, in both directions. `covering`
 * chooses which side of the curve is solid, and that alone is the difference
 * between a sheet arriving and the same sheet leaving — which is why a
 * transition can carry straight on through in one direction instead of
 * retreating the way it came.
 *
 * axis 'y' sweeps vertically (edge runs left to right, travels up).
 * axis 'x' sweeps horizontally (edge runs top to bottom, travels left).
 */
export const buildPath = (pts, covering, axis = 'y') => {
    const step = 100 / (NUM_POINTS - 1);
    const vertical = axis === 'y';

    let d = vertical
        ? (covering ? `M 0 0 V ${pts[0]} C` : `M 0 ${pts[0]} C`)
        : (covering ? `M 100 0 H ${pts[0]} C` : `M ${pts[0]} 0 C`);

    for (let i = 0; i < NUM_POINTS - 1; i++) {
        const p = (i + 1) * step;
        const cp = p - step / 2;

        // The control points sit on the cross-axis, so the two orders are
        // mirror images of each other rather than different maths.
        d += vertical
            ? ` ${cp} ${pts[i]} ${cp} ${pts[i + 1]} ${p} ${pts[i + 1]}`
            : ` ${pts[i]} ${cp} ${pts[i + 1]} ${cp} ${pts[i + 1]} ${p}`;
    }

    if (vertical) return d + (covering ? ' V 100 H 0' : ' V 0 H 0');
    return d + (covering ? ' H 100 Z' : ' H 0 V 0 Z');
};

/**
 * Bind a set of <path> elements to a sweep.
 *
 * `elements` is a live array of refs — read at draw time, not captured — so a
 * component can hand this over before React has attached them.
 */
export const createShapeOverlay = ({ elements, axis = 'y' }) => {
    const count = elements.length;

    // Plain arrays, not component state: these are tweened sixty times a second
    // and re-rendering React per frame would be absurd. GSAP writes the numbers,
    // draw() writes the DOM.
    const pts = Array.from({ length: count }, () => new Array(NUM_POINTS).fill(100));
    const state = { covering: true };

    const draw = () => {
        for (let i = 0; i < count; i++) {
            elements[i]?.setAttribute('d', buildPath(pts[i], state.covering, axis));
        }
    };

    const reset = (value = 100) => pts.forEach((p) => p.fill(value));

    const setCovering = (covering) => { state.covering = covering; };

    /**
     * Queue one sweep onto a timeline.
     *
     * Every point of every sheet gets its own tween at its own offset, which is
     * why this is a nest of loops rather than one staggered tween: a stagger
     * distributes delays evenly by definition, and even is exactly what this
     * must not be.
     *
     * `lead` reverses which sheet goes first. Flipping it between the covering
     * and uncovering halves is what stops the layers crossing over each other
     * on the way back out.
     */
    const sweep = (tl, at = 0, { lead = 'first' } = {}) => {
        // Fresh scatter each time, so the ripple never repeats. Random is fine
        // here and nowhere near the layout code: this is timing, which nobody
        // can diff between runs.
        const jitter = Array.from({ length: NUM_POINTS }, () => Math.random() * DELAY_POINTS_MAX);

        for (let i = 0; i < count; i++) {
            const order = lead === 'first' ? i : count - i - 1;
            const pathDelay = DELAY_PER_PATH * order;

            for (let j = 0; j < NUM_POINTS; j++) {
                tl.to(pts[i], {
                    [j]: 0,
                    duration: DURATION,
                    ease: EASE.travel,
                }, at + jitter[j] + pathDelay);
            }
        }
    };

    // How long a sweep takes end to end, including the slowest point's delay.
    const span = DURATION + DELAY_POINTS_MAX + DELAY_PER_PATH * (count - 1);

    return { draw, reset, setCovering, sweep, span, pts };
};

export { DURATION, DELAY_PER_PATH, DELAY_POINTS_MAX };
export const WORD_DURATION = 0.7; // the menu's link reveal
