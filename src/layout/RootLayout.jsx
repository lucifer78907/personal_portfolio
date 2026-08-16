import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Header from '../components/Header';
// import HeroLoader from '../components/Loader';
import { useIntro } from '../context/introContext';

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
            smooth: 1.5,           // seconds for content to catch up to native scroll
            effects: true,         // enables data-speed / data-lag on any element
            normalizeScroll: true, // steadier mobile scroll, no address-bar resize jumps
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
        <>
            {/*
              Anything position:fixed MUST live outside #smooth-content.
              ScrollSmoother transforms that element, which makes fixed/sticky
              children resolve against it instead of the viewport.
            */}
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
        </>
    );
};

export default RootLayout;
