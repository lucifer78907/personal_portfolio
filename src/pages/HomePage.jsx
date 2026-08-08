import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Grid from '../components/Grid/Grid';
import Experience from '../components/Experience/Experience';

const HomePage = () => {
    return (
        <>
            <Hero />
            <Grid />
            <About />
            <Experience />
            <Skills />
        </>
    );
};

export default HomePage;
