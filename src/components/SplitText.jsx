import React from 'react';

const SplitText = ({ text, className }) => {
    return (
        <span className="inline-block">
            {text.split('').map((char, index) => (
                <span key={index} className={className} style={{ display: 'inline-block' }}>
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
};

export default SplitText;
