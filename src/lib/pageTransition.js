/**
 * Hands a shared-element transition across a route change.
 *
 * A GSAP Flip state object can't ride along in react-router's `location.state`
 * (that has to be serialisable), and the source element unmounts the moment the
 * route swaps — so the measurement is taken before navigating and parked here.
 *
 * Deliberately a plain module singleton rather than context: this value is
 * consumed exactly once, immediately, by the incoming page. Putting it in state
 * would trigger a re-render on the way out for no benefit.
 */
let pending = null;

/** Record where the clicked element was, in viewport coordinates. */
export const setPendingTransition = (data) => {
    pending = data;
};

/** Read without consuming — safe to call during render. */
export const peekPendingTransition = () => pending;

/** Consume. Call from an effect, once the transition has been started. */
export const clearPendingTransition = () => {
    pending = null;
};
