import React from 'react';
import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Grid from '../components/Grid/Grid';

const HomePage = () => {
    return (
        <>
            <Hero />
            <About />
            <Grid />
            <Skills />
        </>
    );
};

export default HomePage;