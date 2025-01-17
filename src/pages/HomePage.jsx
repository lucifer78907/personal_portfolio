import React from 'react';
import Poloroids from '../components/Hero/Poloroids';

const HomePage = () => {
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
        }
    ]

    return (
        <section className='p-4 flex flex-col '>
            <h1 className='font-lexend text-5xl tracking-tighter leading-tight font-semibold text-yellow-950'>Hi there! <br /> I'm Rudra.</h1>
            <Poloroids />
            <p className='font-lexend text-2xl -mt-4  font-medium tracking-wide leading-snug'>
                {
                    description.map((text, index) => {
                        return <span key={index} className={`block ${text.color}`}>&#x2022; {text.text}</span>
                    })
                }
            </p>
        </section>
    );
};

export default HomePage;