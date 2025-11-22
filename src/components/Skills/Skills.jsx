import React, { useRef } from 'react';
import { FaReact, FaAws, FaNodeJs, FaDatabase, FaLinux, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs, SiOpenai } from 'react-icons/si';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

const Skills = () => {
    const containerRef = useRef(null);

    const skills = [
        { icon: <FaReact />, text: 'React' },
        { icon: <SiNextdotjs />, text: 'Next.js' },
        { icon: <SiTypescript />, text: 'TypeScript' },
        { icon: <FaNodeJs />, text: 'Node.js' },
        { icon: <FaAws />, text: 'AWS' },
        { icon: <SiMongodb />, text: 'MongoDB' },
        { icon: <SiOpenai />, text: 'GenAI' },
        { icon: <FaGitAlt />, text: 'Git' },
    ];

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('.skill-item', {
            opacity: 0,
            y: 20,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top 80%',
                end: 'bottom 80%',
                toggleActions: 'play none none reverse'
            }
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='py-32 px-6 md:px-20 max-w-7xl mx-auto'>
            <h2 className="text-sm uppercase tracking-widest text-text-muted mb-12">Tech Stack</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {skills.map((skill, index) => (
                    <div key={index} className="skill-item flex items-center gap-4 p-6 border border-border rounded-lg hover:bg-text-main/5 transition-colors duration-300">
                        <span className="text-3xl text-text-muted">{skill.icon}</span>
                        <span className="text-lg font-medium text-text-main">{skill.text}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Skills;