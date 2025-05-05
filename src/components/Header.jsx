import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className='bg-amber-100/30 backdrop-blur-md m-4 p-2 flex justify-evenly  items-center rounded-full sticky top-2 z-50 shadow-md'>
            <NavLink to='/' className={({ isActive }) =>
                isActive ? "py-1 text-sm md:text-base font-bold text-amber-50 bg-amber-800 px-3  rounded-full" : "text-base font-bold text-amber-800"
            } >Home</NavLink>
            <NavLink to='/random-photos' className={({ isActive }) =>
                isActive ? "py-1 text-sm md:text-base font-bold text-amber-50 bg-amber-800 px-3  rounded-full" : "text-base font-bold text-amber-800"
            } >Gallery</NavLink>
            <NavLink to='/contact' className={({ isActive }) =>
                isActive ? "py-1 text-sm md:text-base font-bold text-amber-50 bg-amber-800 px-3  rounded-full" : "text-base font-bold text-amber-800"
            } >Contact</NavLink>
            <NavLink to='/projects' className={({ isActive }) =>
                isActive ? "py-1 text-sm md:text-base font-bold text-amber-50 bg-amber-800 px-3 rounded-full" : "text-base font-bold text-amber-800"
            } >Projects</NavLink>
        </header>
    );
};

export default Header;