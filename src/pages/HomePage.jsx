import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Grid from '../components/Grid/Grid';

// #TODO - Anmiations
// #TODO - Entry loader animation
// #TODO - theme switcher
// #TODO - favicon add

const HomePage = () => {
    return (
        <>
            <Hero />
            <Grid />
            <About />
            <Skills />
        </>
    );
};

export default HomePage;