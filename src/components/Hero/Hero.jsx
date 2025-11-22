import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from '../SplitText';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline();

        // Text Reveal
        tl.from('.hero-char', {
            y: 100,
            opacity: 0,
            stagger: 0.02,
            duration: 1,
            ease: "power4.out",
            delay: 0.5
        })
            .from('.hero-subtitle', {
                y: 20,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5")
            .from('.scroll-indicator', {
                y: -10,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out"
            }, "-=0.3");

        // Scroll Parallax for Text
        gsap.to('.hero-content', {
            y: -100,
            opacity: 0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });

    }, { scope: containerRef });

    return (
        <section
            id="hero-section"
            ref={containerRef}
            className='relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-bg-primary'
        >
            <div className='hero-content relative z-10 text-center px-4 mix-blend-difference'>
                <h1 ref={textRef} className='font-display text-[8vw] md:text-[10vw] leading-[0.9] font-bold tracking-tighter text-text-main uppercase'>
                    <SplitText text="Creative" className="hero-char inline-block" />
                    <br />
                    <SplitText text="Developer" className="hero-char inline-block" />
                </h1>

                <div className='hero-subtitle mt-6 md:mt-8 flex flex-col items-center gap-4'>
                    <p className='text-base md:text-xl font-light text-text-muted tracking-wide max-w-lg'>
                        Crafting digital experiences with code & motion.
                    </p>
                </div>
            </div>

            <div className='scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 mix-blend-difference'>
                <span className='text-xs uppercase tracking-[0.2em] text-text-muted'>Scroll</span>
                <div className='w-[1px] h-12 bg-text-muted/50 overflow-hidden'>
                    <div className='w-full h-full bg-text-main animate-scroll-line'></div>
                </div>
            </div>
        </section>
    );
};

export default Hero;