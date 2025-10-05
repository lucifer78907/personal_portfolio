import React, { useContext } from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Grid from '../components/Grid/Grid';
import Experience from '../components/Experience/Experience';
import timelineContext from '../context/timelineContext';

// #TODO - Anmiations
// #TODO - Entry loader animation
// #TODO - theme switcher
// #TODO - favicon add

const HomePage = () => {
    const { addAnimation } = useContext(timelineContext)

    return (
        <>
            <Hero addAnimation={addAnimation} index={60} />
            <Grid />
            <About />
            <Experience />
            <Skills />
        </>
    );
};

export default HomePage;