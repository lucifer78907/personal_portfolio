/**
 * The panel stack, shared by the menu and the loader.
 *
 * Both use these three colours in this order — the menu traverses it forward
 * (light lands first, the deepest panel arrives last and carries the links),
 * the loader traverses it backward (deepest leaves first, unpeeling to light).
 *
 * One array, so that inversion is literal instead of a coincidence two files
 * have to keep agreeing on.
 */
export const PANELS = [
    { bg: '#fde68a' }, // amber-200
    { bg: '#d97706' }, // amber-600
    { bg: '#451a03' }, // amber-950 — deepest; carries the menu links / the counter
];
