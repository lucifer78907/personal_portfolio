import Hero from '../components/Hero/Hero';
import About from '../components/About/About';
import Skills from '../components/Skills/Skills';
import Experience from '../components/Experience/Experience';
import PageColumn from '../components/PageColumn';

const HomePage = () => {
    return (
        <>
            <PageColumn>
                <Hero />
            </PageColumn>

            {/*
              Outside the column on purpose. About pins a full-viewport aperture,
              and inside PageColumn's sm:w-3/4 lg:w-3/5 that "full bleed" would be
              a 60%-wide strip. Breaking out with a transform or a negative margin
              is not an option either — both fight ScrollTrigger's pin-spacer.
              See the note in PageColumn.jsx; /about resolves it the same way.
            */}
            <About />

            <PageColumn>
                <Experience />
            </PageColumn>

            {/* Also outside the column: the skills scatter across the whole
                viewport, and inside PageColumn they were bound to 60% of it. */}
            <Skills />
        </>
    );
};

export default HomePage;
