import React, { useRef } from 'react';
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

const Hero = () => {
    const containerRef = useRef();
    gsap.registerPlugin(SplitText);

    useGSAP(() => {
        let split = SplitText.create('.heading', {
            type: 'chars',
            mask: 'chars',
            onSplit: (self) => {
                let split = gsap.from(self.chars, {
                    duration: 0.6,
                    yPercent: 100,
                    opacity: 0,
                    stagger: 0.1,
                    ease: "expo.out",
                });
                return split;
            }
        })
    }, [])


    return (
        <section ref={containerRef} className='p-4 flex flex-col mb-12 xl:mt-4' >
            <h1 className='heading font-lexend text-5xl sm:text-6xl md:text-7xl xl:text-9xl xl:text-center tracking-tighter  font-semibold text-yellow-950'>Hi there! <br /> I'm Rudra.</h1>
            <p className='mt-4 font-lexend sm:text-lg lg:text-xl xl:text-center xl:text-2xl text-amber-700 text-xs'>{`<FullStackDev/>`} turning ideas into fast, scalable web apps with real impact.</p>
            <div className='xl:grid xl:grid-cols-2 xl:gap-8 2xl:gap-16 xl:items-center'>
                <Poloroids />
                <p className='font-lexend text-2xl md:text-3xl xl:-mt-32 -mt-2 2xl:text-4xl font-medium tracking-wide leading-snug'>
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