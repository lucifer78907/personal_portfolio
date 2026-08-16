import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Header from '../components/Header';
import Seo from '../components/Seo';
import HeroLoader from '../components/Loader';
import { ChapterProvider } from '../context/chapterContext';
import { takeScroll } from '../lib/scrollMemory';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const RootLayout = () => {
    const { pathname } = useLocation();

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

    // A new route means new content height and a stale scroll position — so the
    // top, unless this is a return to somewhere we recorded on the way out (see
    // lib/scrollMemory.js), in which case put them back where they were.
    //
    // ORDER IS LOAD-BEARING: top first, then refresh, then restore. Never the
    // other way round. ScrollTrigger.refresh() re-measures every pinned section
    // and computes its pin-spacer against wherever the page currently sits, so
    // refreshing while already scrolled deep into a route whose content has only
    // just mounted leaves the spacers sized against a layout that does not exist
    // yet — and the page comes back blank, with its content stranded off-screen.
    //
    // Two frames, not one: the first lets the incoming route paint so refresh()
    // has real heights to measure, the second lets those heights settle before
    // the position is read back. All of it happens under the chapter card's
    // cover, so none of it is visible.
    useEffect(() => {
        const y = takeScroll(pathname);
        ScrollSmoother.get()?.scrollTo(0, false);

        let second = 0;
        const first = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            if (y == null) return;

            second = requestAnimationFrame(() => {
                const smoother = ScrollSmoother.get();
                if (!smoother) return;
                // Clamped: the page being returned to can be shorter than it was
                // on the way out, and scrolling past its end is the same blank
                // screen by a different route.
                smoother.scrollTo(Math.min(y, ScrollTrigger.maxScroll(window)), false);
            });
        });

        return () => {
            cancelAnimationFrame(first);
            cancelAnimationFrame(second);
        };
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

            {/* Owns the intro: it calls finishIntro(), and the hero's first
                heading line, the polaroid deck and the burger are all built
                PAUSED waiting on that. Disabling it needs a stand-in for the
                call, or the homepage loads with half its heading missing. */}
            <HeroLoader />
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
