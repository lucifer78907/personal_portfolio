import gsap from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);

/**
 * The site's easing vocabulary, in one place.
 *
 * CustomEase accepts a four-number cubic-bezier string, so the curves awwwards
 * sites actually use go in directly instead of being approximated with
 * power4/expo. Values are the standard easings.net equivalents.
 *
 * Registered by name on the global GSAP ease registry, so tweens reference them
 * as plain strings: ease: 'quartInOut'.
 *
 * Import this module anywhere that uses these names — the registration is a
 * side effect of importing, and relying on some *other* component having been
 * imported first is how you get a silent fallback to the default ease.
 */
CustomEase.create('quartInOut', '0.76, 0, 0.24, 1'); // easeInOutQuart — heavy, deliberate. Travel.
CustomEase.create('expoOut', '0.16, 1, 0.3, 1');     // easeOutExpo — violent start, long glide. Arrivals.
CustomEase.create('quintOut', '0.22, 1, 0.36, 1');   // easeOutQuint — softer sibling. Text, small moves.

export const EASE = {
    travel: 'quartInOut',
    arrive: 'expoOut',
    text: 'quintOut',
};
