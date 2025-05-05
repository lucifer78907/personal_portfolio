import React from 'react';
import Poloroids from './Poloroids';

const Hero = () => {
    const description = [
        {
            text: 'a <FullStackDev/>',
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
            text: 'coffee & gym addict',
            color: 'text-amber-800'
        },
    ]

    return (
        <section className='p-4 flex flex-col mb-12 '>
            <h1 className='font-lexend text-5xl sm:text-6xl tracking-tighter  font-semibold text-yellow-950'>Hi there! <br /> I'm Rudra.</h1>
            <p className='mt-4 font-lexend sm:text-lg text-amber-700 text-xs'>Full-stack dev turning ideas into fast, scalable web apps with real impact.</p>
            <Poloroids />
            <p className='font-lexend text-2xl md:text-3xl -mt-4  font-medium tracking-wide leading-snug'>
                {
                    description.map((text, index) => {
                        return <span key={index} className={`block ${text.color} `}>&#x2022; {text.text}</span>
                    })
                }
            </p>
        </section>
    );
};

export default Hero;