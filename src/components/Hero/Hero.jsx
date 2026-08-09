import { useEffect, useRef } from 'react';
import Poloroids from './Poloroids';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/all';
import gsap from 'gsap';
import { useIntro } from '../../context/introContext';
import { EASE } from '../../lib/eases';

const description = [
    {
        text: 'travel || code || fun',
        color: 'text-amber-800'
    },
    {
        text: 'Error at line 98:57',
        color: 'text-red-500'
    },
    {
        text: 'humorous',
        color: 'text-amber-800'
    },
    {
        text: 'coffee && gym addict',
        color: 'text-amber-800'
    },
]

const Hero = () => {
    const containerRef = useRef(null);
    const introTl = useRef(null);
    const { introComplete } = useIntro();

    useGSAP(() => {
        // Line one is deliberately absent: the loader's word Flips into it, and
        // that landing IS its reveal. Splitting it here would animate it a second
        // time, on top of the copy that just arrived.
        const splitHeading = SplitText.create('.heading-line-2', {
            type: 'chars',
            mask: 'chars',
        });

        // Hidden until the handoff. autoAlpha, not display — the loader has to
        // measure this box to know where to fly to, and a display:none element
        // has no box to measure.
        gsap.set('.heading-line-1', { autoAlpha: 0 });

        const splitTagLine = SplitText.create('.para', {
            type: 'lines',
            mask: 'lines',
        });

        // Built paused. from() tweens render their start values immediately even
        // while paused, so the hero is already hidden behind the loader overlay —
        // no flash of finished text when the bars open.
        // Three distinct beats. The overlaps are deliberately small (-0.15/-0.1)
        // so each one reads as its own move instead of all landing together.
        introTl.current = gsap.timeline({ paused: true })
            // Frame-exact swap: the loader hides its copy on the same tick it calls
            // finishIntro, which plays this. Same string, same size, same place.
            .set('.heading-line-1', { autoAlpha: 1 }, 0)
            .from(splitHeading.chars, {
                duration: 0.9,
                yPercent: 100,
                opacity: 0,
                stagger: 0.05,
                ease: EASE.arrive,
            })
            .from(splitTagLine.lines, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7,
                ease: EASE.text,
            }, '-=0.15')
            .from('.desc', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: EASE.text,
            }, '-=0.1');
    }, { scope: containerRef });

    // Plays the instant the loader hands off — no guessed delay.
    useEffect(() => {
        if (introComplete) introTl.current?.play();
    }, [introComplete]);

    return (
        <section ref={containerRef} className='p-4 flex flex-col mb-12 xl:mt-4' >
            {/*
              Two spans instead of a <br>, because line one is the loader's Flip
              target and needs a box of its own. w-fit is what makes that box hug
              the text — as a plain block it would span the full column width and
              the loader would scale its word to fit *that* instead of the words.
              mx-auto reproduces what xl:text-center used to do.
            */}
            <h1 className='heading font-lexend text-5xl sm:text-6xl md:text-7xl xl:text-9xl tracking-tighter font-semibold text-yellow-950'>
                <span className='heading-line-1 block w-fit xl:mx-auto'>Hi there!</span>
                <span className='heading-line-2 block w-fit xl:mx-auto'>I&apos;m Rudra.</span>
            </h1>
            <p className='para mt-4 font-lexend sm:text-lg lg:text-xl xl:text-center xl:text-2xl text-amber-700 text-xs'>{`<FullStackDev/>`} turning ideas into fast, scalable web apps with real impact.</p>
            <div className='xl:grid xl:grid-cols-2 xl:gap-8 2xl:gap-16 xl:items-center'>
                <Poloroids />
                <p className='font-lexend desc text-2xl md:text-3xl xl:-mt-32 -mt-2 2xl:text-4xl font-medium tracking-wide leading-snug'>
                    {
                        description.map((item, index) => {
                            return <span key={index} className={`block ${item.color} `}>&#x2022; {item.text}</span>
                        })
                    }
                </p>
            </div>
        </section >
    );
};

export default Hero;
