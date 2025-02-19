import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className='bg-amber-100/30 backdrop-blur-md m-4 p-2 flex justify-evenly  items-center rounded-full sticky top-2 z-50 shadow-md'>
            <NavLink to='/' className={({ isActive }) =>
                isActive ? "text-base font-bold text-amber-50 bg-amber-800 px-4 rounded-full" : "text-base font-bold text-amber-800"
            } >Home</NavLink>
            <NavLink to='/random-photos' className={({ isActive }) =>
                isActive ? "text-base font-bold text-amber-50 bg-amber-800 px-4 rounded-full" : "text-base font-bold text-amber-800"
            } >Gallery</NavLink>
            <NavLink to='/contact-me' className={({ isActive }) =>
                isActive ? "text-base font-bold text-amber-50 bg-amber-800 px-4 rounded-full" : "text-base font-bold text-amber-800"
            } >Contact</NavLink>
            <NavLink to='/blogs' className={({ isActive }) =>
                isActive ? "text-base font-bold text-amber-50 bg-amber-800 px-4 rounded-full" : "text-base font-bold text-amber-800"
            } >Blog</NavLink>
        </header>
    );
};

export default Header;