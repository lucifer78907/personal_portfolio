import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Header from '../components/Header';
import Seo from '../components/Seo';
// import HeroLoader from '../components/Loader';
import { useIntro } from '../context/introContext';
import { ChapterProvider } from '../context/chapterContext';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const RootLayout = () => {
    const { pathname } = useLocation();
    const { finishIntro } = useIntro();

    // TEMPORARY — loader disabled for development; see the commented-out
    // <HeroLoader /> below and restore both together.
    //
    // This is not optional while the loader is off. The loader is what calls
    // finishIntro(), and everything that animates in on first paint is built
    // PAUSED waiting on it: the hero's first heading line sits at autoAlpha 0
    // as the loader's Flip target, the polaroid deck is parked off-screen at
    // xPercent 100, and the burger is hidden. Without this the homepage loads
    // with half its heading missing and no navigation.
    useEffect(() => {
        finishIntro();
    }, [finishIntro]);

    // ScrollSmoother owns scrolling for the whole app. Created once, here, because
    // it needs a single wrapper/content pair that outlives route changes.
    useGSAP(() => {
        const smoother = ScrollSmoother.create({
            wrapper: '#smooth-wrapper',
            content: '#smooth-content',
            smooth: 1.5,   // seconds for content to catch up — pointer devices only
            effects: true, // enables data-speed / data-lag on any element

            // Touch scrolling is left entirely alone.
            //
            // normalizeScroll intercepts touch and re-implements scrolling in
            // JavaScript. It was here to stop the address bar showing/hiding
            // from jolting the page, but the price is the platform's own
            // momentum and rubber-banding — which is exactly what "smooth"
            // means on a phone. Running every scroll frame through JS to
            // approximate what the OS already does for free is why it felt
            // worse, not better.
            //
            // ignoreMobileResize solves the address-bar problem on its own:
            // ScrollTrigger stops refreshing on the resize events that a
            // collapsing toolbar fires, without touching the scroll itself.
            //
            // smoothTouch is deliberately left at its default of 0. Desktop
            // keeps the 1.5s glide; mobile is native.
            normalizeScroll: false,
            ignoreMobileResize: true,
        });

        return () => smoother.kill();
    });

    // A new route means new content height and a stale scroll position.
    useEffect(() => {
        ScrollSmoother.get()?.scrollTo(0, false);
        const id = requestAnimationFrame(() => ScrollTrigger.refresh());
        return () => cancelAnimationFrame(id);
    }, [pathname]);

    return (
        // Inside the router, because the transition navigates; outside
        // #smooth-content, because its overlay is position:fixed. Both are
        // satisfied here and nowhere else.
        <ChapterProvider>
            {/*
              Anything position:fixed MUST live outside #smooth-content.
              ScrollSmoother transforms that element, which makes fixed/sticky
              children resolve against it instead of the viewport.
            */}
            {/* Renders nothing; keeps document.head in step with the route on
                client-side navigation. The served HTML already carries the
                right tags per page — see scripts/generate-seo.mjs. */}
            <Seo />

            {/* TEMPORARY — disabled for development. Restore together with the
                useEffect above that stands in for its finishIntro() call. */}
            {/* <HeroLoader /> */}
            <Header />

            <div id="smooth-wrapper">
                <div id="smooth-content">
                    {/*
                      No width constraint here. Pages set their own, because a
                      layout-level column forces anything full-bleed (the
                      horizontal About section) to escape with a transform or a
                      negative margin — and both of those fight ScrollTrigger's
                      pin-spacer and clip the pinned content.
                      Shared column lives in <PageColumn>.
                    */}
                    <main className="overflow-x-hidden pt-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ChapterProvider>
    );
};

export default RootLayout;
