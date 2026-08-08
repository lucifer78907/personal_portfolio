import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Grid from '../components/Grid/Grid';
import Experience from '../components/Experience/Experience';
import PageColumn from '../components/PageColumn';

const HomePage = () => {
    return (
        <PageColumn>
            <Hero />
            <Grid />
            <About />
            <Experience />
            <Skills />
        </PageColumn>
    );
};

export default HomePage;
