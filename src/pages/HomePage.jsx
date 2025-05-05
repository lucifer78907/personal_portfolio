import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Grid from '../components/Grid/Grid';

// #TODO - Responsive
// #TODO - Anmiations
// #TODO - Home section revamp - add TLDR, experience etc
// #TODO - theme switcher

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