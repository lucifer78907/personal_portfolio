import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import HeroLoader from '../components/Loader';

const RootLayout = () => {
    return (
        <>
            <HeroLoader />
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