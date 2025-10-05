import React, { useRef, useState } from 'react';
import Poloroids from './Poloroids';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/all';
import gsap from 'gsap';

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

const Hero = ({ addAnimation, index }) => {
    const containerRef = useRef();
    const [totalTime, setTotalTime] = useState();

    useGSAP(() => {

        let splitHeading = SplitText.create('.heading', {
            type: 'chars',
            mask: 'chars',
        })

        let splitTagLine = SplitText.create('.para', {
            type: 'lines',
            mask: 'lines',
        });


        let tl = gsap.timeline();

        tl.from(splitHeading.chars, {
            duration: 0.8,
            yPercent: 100,
            opacity: 0,
            stagger: 0.04,
            ease: "power3.out",
        })

        tl.from(splitTagLine.lines, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.1,
            ease: 'power2.out',
            duration: 0.6,
        }, "-=0.4")

        tl.from('.desc', {
            opacity: 0,
            y: 30,
            ease: 'power2.out',
            duration: 0.8,
        }, "-=0.3")

        setTotalTime(tl.totalDuration());
        addAnimation(tl, "+=0.1");



    }, { scope: containerRef })


    return (
        <section ref={containerRef} className='p-4 flex flex-col mb-12 xl:mt-4' >
            <h1 className='heading font-lexend text-5xl sm:text-6xl md:text-7xl xl:text-9xl xl:text-center tracking-tighter  font-semibold text-yellow-950'>Hi there! <br /> I'm Rudra.</h1>
            <p className='para mt-4 font-lexend sm:text-lg lg:text-xl xl:text-center xl:text-2xl text-amber-700 text-xs'>{`<FullStackDev/>`} turning ideas into fast, scalable web apps with real impact.</p>
            <div className='xl:grid xl:grid-cols-2 xl:gap-8 2xl:gap-16 xl:items-center'>
                <Poloroids delay={totalTime} />
                <p className='font-lexend desc text-2xl md:text-3xl xl:-mt-32 -mt-2 2xl:text-4xl font-medium tracking-wide leading-snug'>
                    {
                        description.map((text, index) => {
                            return <span key={index} className={`block ${text.color} `}>&#x2022; {text.text}</span>
                        })
                    }
                </p>
            </div>
        </section >
    );
};

export default Hero;