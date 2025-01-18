import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
    return (
        <header className='bg-amber-100/30 backdrop-blur-md m-4 p-2 flex justify-evenly  items-center rounded-full sticky top-2 z-50 shadow-md'>
            <NavLink to='/' className='text-base font-bold text-amber-50 bg-amber-800 px-4 rounded-full'>Home</NavLink>
            <NavLink to='/' className='text-base font-bold text-amber-800'>Gallery</NavLink>
            <NavLink to='/' className='text-base font-bold text-amber-800'>Contact</NavLink>
            <NavLink to='/' className='text-base font-bold text-amber-800'>Blog</NavLink>
        </header>
    );
};

export default Header;