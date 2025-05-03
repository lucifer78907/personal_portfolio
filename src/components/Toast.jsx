// Toast.jsx
import React from 'react';
import { MdOutlineError } from 'react-icons/md';

const Toast = ({ message, show }) => {
    return (
        <div
            className={`fixed flex items-center gap-2 inset-x-2 bottom-4 px-4 py-2 bg-amber-800 text-amber-100 rounded-full  shadow-md transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <MdOutlineError fill='white' /> {message}
        </div>
    );
};

export default Toast;
