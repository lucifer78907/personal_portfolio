import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const RootLayout = () => {
    return (
        <>
            <Header />
            <main className='overflow-x-hidden'>
                <Outlet />
            </main>
        </>
    );
};

export default RootLayout;