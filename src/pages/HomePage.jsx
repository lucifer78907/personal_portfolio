import React from 'react';
import imagePoloroid from '../assets/poloroid_1.png'

const HomePage = () => {
    return (
        <section className='p-4 flex flex-col gap-4'>
            <h1 className='font-lexend text-5xl tracking-tighter font-semibold text-yellow-950'>Hi there! <br /> I'm Rudra.</h1>
            <aside>
                <img src={imagePoloroid} alt='Rudra Pratap Singh' />
            </aside>
        </section>
    );
};

export default HomePage;