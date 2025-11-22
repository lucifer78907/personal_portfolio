import React, { useContext } from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Experience from '../components/Experience/Experience';
import timelineContext from '../context/timelineContext';

const HomePage = () => {
    const { addAnimation } = useContext(timelineContext)

    return (
        <>
            <Hero addAnimation={addAnimation} />
            <About />
            <Experience />
            <Skills />
        </>
    );
};

export default HomePage;