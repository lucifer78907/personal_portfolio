import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Coordinates the page-load intro.
 *
 * The loader owns the sequence and calls finishIntro() when the overlay is
 * clearing; anything that should animate in on first paint waits for
 * `introComplete` instead of guessing at a delay.
 *
 * This replaces the old shared GSAP master timeline, where each component
 * appended itself with a relative position string ("-=0.2", "+=2") — so a
 * component's start time silently depended on which other components had
 * already mounted.
 */
const IntroContext = createContext({
    introComplete: false,
    finishIntro: () => { },
});

export const useIntro = () => useContext(IntroContext);

export const IntroProvider = ({ children }) => {
    const [introComplete, setIntroComplete] = useState(false);

    const finishIntro = useCallback(() => setIntroComplete(true), []);

    const value = useMemo(
        () => ({ introComplete, finishIntro }),
        [introComplete, finishIntro]
    );

    return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
};
