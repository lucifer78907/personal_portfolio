import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import HeroLoader from '../components/Loader';
import timelineContext from '../context/timelineContext';

const RootLayout = () => {
    const { addAnimation } = useContext(timelineContext)

    return (
        <>
            <HeroLoader addAnimation={addAnimation} index={1} />
            <div className='sm:w-3/4 mx-auto lg:w-3/5'>
                <Header />
                <main className='overflow-x-hidden'>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default RootLayout;