import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { SplitText, ScrollTrigger } from 'gsap/all';
import gsap from 'gsap';

const About = () => {
    const containerRef = useRef();

    useGSAP(() => {
        const splitText = new SplitText('.about-text', { type: 'lines' });

        gsap.from(splitText.lines, {
            opacity: 0,
            y: 50,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 70%',
                end: 'bottom 80%',
                toggleActions: 'play none none reverse'
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='py-32 px-6 md:px-20 max-w-7xl mx-auto'>
            <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                <div className="md:w-1/3">
                    <h2 className="text-sm uppercase tracking-widest text-text-muted mb-4">About Me</h2>
                    <div className="w-full h-[1px] bg-border"></div>
                </div>

                <div className="md:w-2/3">
                    <p className="about-text text-2xl md:text-4xl font-light leading-relaxed text-text-main">
                        I'm a creative developer who bridges the gap between design and technology.
                        I don't just write code; I craft digital experiences that leave a lasting impression.
                        <br /><br />
                        With a background in full-stack development and a passion for motion design,
                        I build scalable applications that feel alive.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default About;