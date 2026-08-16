/**
 * Where you were when you left.
 *
 * Every route change resets the scroll to the top, which is right for a
 * navigation and wrong for a return: clicking a skill halfway down the board
 * and coming back put you at the top of the home page, with the board you were
 * reading somewhere below the fold.
 *
 * One slot, not a map. This exists for round trips — leave a page, come back to
 * the same page — and a slot that only ever holds the most recent departure
 * cannot accumulate stale positions or restore one for a page you reached some
 * other way. Anything not explicitly recorded still lands at the top.
 *
 * A plain module singleton rather than context, for the same reason
 * lib/pageTransition.js is one: the value is written once and consumed once,
 * immediately, and putting it in state would re-render on the way out for no
 * benefit.
 */

let parked = null;

/** Record where `path` was scrolled to, on the way out of it. */
export const rememberScroll = (path, y) => {
    parked = { path, y };
};

/**
 * Consume the position for `path`, if the last departure was from there.
 *
 * Returns null otherwise — including on a second call for the same path, so a
 * restore can never happen twice.
 */
export const takeScroll = (path) => {
    if (!parked || parked.path !== path) return null;
    const { y } = parked;
    parked = null;
    return y;
};
