import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

const Experience = () => {
    const containerRef = useRef(null);

    const experiences = [
        {
            company: 'Initializ.ai',
            role: 'SDE - 2',
            period: 'June 2024 - Present',
            description: 'Building enterprise GenAI platform dashboards with agentic workflows and RAG systems.',
        },
        {
            company: 'Coalmantra',
            role: 'Software Developer',
            period: 'March 2024 - May 2025',
            description: 'Developed full-stack web applications using React and Node.js.',
        }
    ];

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        const items = gsap.utils.toArray('.experience-item');

        items.forEach((item) => {
            gsap.from(item, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    end: 'top 50%',
                    scrub: 1,
                    toggleActions: 'play none none reverse'
                }
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='py-32 px-6 md:px-20 max-w-7xl mx-auto'>
            <h2 className="text-sm uppercase tracking-widest text-text-muted mb-12">Experience</h2>

            <div className="space-y-20">
                {experiences.map((exp, index) => (
                    <div key={index} className="experience-item flex flex-col md:flex-row gap-8 md:gap-20 border-l border-border pl-8 md:pl-0 md:border-l-0">
                        <div className="md:w-1/3 md:text-right md:pr-8 md:border-r md:border-border relative">
                            <span className="text-text-muted font-mono text-sm">{exp.period}</span>
                            <h3 className="text-2xl font-display font-bold text-text-main mt-2">{exp.company}</h3>
                            {/* Dot for desktop */}
                            <div className="hidden md:block absolute top-2 -right-[5px] w-2.5 h-2.5 bg-accent rounded-full"></div>
                        </div>
                        <div className="md:w-2/3">
                            <h4 className="text-xl text-text-main mb-4">{exp.role}</h4>
                            <p className="text-text-muted font-light leading-relaxed max-w-2xl">
                                {exp.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Experience;

