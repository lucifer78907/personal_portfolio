import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import HeroLoader from '../components/Loader';
import Cursor from '../components/Cursor';
import ThemeSwitcher from '../components/ThemeSwitcher';
import timelineContext from '../context/timelineContext';

const RootLayout = () => {
    const { addAnimation } = useContext(timelineContext)

    return (
        <div className="min-h-screen bg-primary text-text-main selection:bg-accent selection:text-primary transition-colors duration-500">
            <Cursor />
            <HeroLoader addAnimation={addAnimation} index={1} />
            <Header />
            <ThemeSwitcher />
            <main className='w-full overflow-x-hidden'>
                <Outlet />
            </main>
        </div>
    );
};


export default RootLayout;