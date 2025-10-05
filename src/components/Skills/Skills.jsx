import { useState, useRef } from 'react';
import { FaReact, FaAws, FaNodeJs, FaDatabase, FaLinux, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs } from 'react-icons/si';
import { BiSolidRightArrow } from "react-icons/bi";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText, ScrollTrigger } from 'gsap/all';

const Skills = () => {
    const [clicked, setClicked] = useState(false);
    const containerRef = useRef();
    const skills = [
        { icon: <FaReact size={'3em'} className='skill-icon fill-amber-800' />, text: 'React' },
        { icon: <FaAws size={'3em'} className='skill-icon fill-amber-800' />, text: 'AWS' },
        { icon: <SiTypescript size={'3em'} className='skill-icon fill-amber-800' />, text: 'TypeScript' },
        { icon: <FaNodeJs size={'3em'} className='skill-icon fill-amber-800' />, text: 'Node.js' },
        { icon: <SiMongodb size={'3em'} className='skill-icon fill-amber-800' />, text: 'MongoDB' },
        { icon: <SiExpress size={'3em'} className='skill-icon fill-amber-800' />, text: 'Express' },
        { icon: <FaDatabase size={'3em'} className='skill-icon fill-amber-800' />, text: 'SQL' },
        { icon: <FaLinux size={'3em'} className='skill-icon fill-amber-800' />, text: 'Linux' },
        { icon: <FaGitAlt size={'3em'} className='skill-icon fill-amber-800' />, text: 'Git' },
        { icon: <SiNextdotjs size={'3em'} className='skill-icon fill-amber-800' />, text: 'Next.js' },
    ];

    useGSAP(() => {
        // Heading
        const splitHeading = SplitText.create('.skills-heading', {
            type: 'chars',
            charsClass: 'skills-heading-char'
        });

        gsap.from(splitHeading.chars, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.skills-heading',
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Subheading
        gsap.from('.skills-subheading', {
            opacity: 0,
            x: 50,
            scrollTrigger: {
                trigger: '.skills-subheading',
                start: 'top 80%',
                end: 'top 55%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Code lines
        const codeLines = gsap.utils.toArray('.code-line');
        gsap.from(codeLines, {
            opacity: 0,
            x: -30,
            stagger: 0.15,
            scrollTrigger: {
                trigger: '.code-block',
                start: 'top 80%',
                end: 'top 45%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
            }
        });

        // Button
        gsap.from('.run-button', {
            scale: 0.6,
            opacity: 0,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: '.run-button',
                start: 'top 85%',
                end: 'top 55%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
            }
        });

        // Arrow pulse
        gsap.to('.arrow-icon', {
            x: 5,
            repeat: -1,
            yoyo: true,
            duration: 0.8,
            ease: "sine.inOut",
        });

        // Refresh ScrollTrigger for mobile
        ScrollTrigger.refresh();

    }, { scope: containerRef, dependencies: [clicked] });

    // Animation when skills grid appears
    useGSAP(() => {
        if (clicked) {
            gsap.from('.skill-card', {
                scale: 0,
                opacity: 0,
                y: 50,
                rotation: -10,
                stagger: {
                    each: 0.08,
                    from: "start",
                    grid: "auto"
                },
                ease: "back.out(1.7)",
                duration: 0.6,
            });

            gsap.from('.skill-icon', {
                rotation: 360,
                scale: 0,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
                duration: 0.8,
                delay: 0.3,
            });
        }
    }, { scope: containerRef, dependencies: [clicked] });

    return (
        <section ref={containerRef} className='p-4 py-20 flex flex-col gap-2 mb-40 2xl:w-3/4 2xl:mx-auto'>
            <h2 className='skills-heading font-lexend text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tighter text-amber-950'>Ctrl + Alt + Skills</h2>
            <p className='skills-subheading tracking-tighter -mt-1 font-lexend lg:mt-4 xl:text-xl sm:text-base text-right font-medium text-sm text-amber-700/50'>Endorsed by Mom and Linkedin</p>
            {clicked ?
                (
                    <main className='mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'>

                        {skills.map((skill, index) => {
                            return (

                                <div key={index} className='skill-card flex flex-col items-center p-2 px-4 gap-2 shadow-retro rounded-xl'>
                                    {skill.icon}
                                    <span className='font-lexend text-amber-800 font-semibold'>
                                        {skill.text}
                                    </span>
                                </div>
                            );
                        })}
                    </main>
                ) :
                (
                    <main className='mt-4'>
                        <h3 className='code-block font-lexend text-xl md:text-2xl xl:text-3xl p-2 text-amber-950'>
                            <span className='font-medium text-amber-700'>db</span>.skills.<span className='font-semibold text-amber-600'>find</span>{'({'}
                            <p className='code-line ml-4'>{"{ id: '476967642049534f' }"}</p>
                            <p className='code-line ml-4'>{"{ name: 'Rudra' }"}</p>
                            <p className='code-line'>{'});'}</p>
                        </h3>
                        <button onClick={() => setClicked(true)} className='run-button flex items-center gap-2 mt-4 text-lg bg-amber-800 mx-auto font-medium text-neutral-50 px-4 py-2 rounded-md '>
                            Run query <BiSolidRightArrow size={'1.2em'} className='arrow-icon' />
                        </button>
                    </main>
                )

            }

        </section>
    );
};

export default Skills;