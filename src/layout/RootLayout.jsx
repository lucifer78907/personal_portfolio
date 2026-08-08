import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Header from '../components/Header';
import HeroLoader from '../components/Loader';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);

const RootLayout = () => {
    const { pathname } = useLocation();

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
        </>
    );
};

export default RootLayout;
