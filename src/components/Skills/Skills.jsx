import { useState, useRef } from 'react';
import { FaReact, FaAws, FaNodeJs, FaDatabase, FaLinux, FaGitAlt, FaMobileAlt, FaRobot, FaBrain } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs, SiOpenai } from 'react-icons/si';
import { BiSolidRightArrow } from "react-icons/bi";
import { TbPlugConnected } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText, ScrollTrigger } from 'gsap/all';

const Skills = () => {
    const [clicked, setClicked] = useState(false);
    const [hoveredSkill, setHoveredSkill] = useState(null);
    const containerRef = useRef();

    const funMessages = [
        "Still better than Java!",
        "I promise I know this!",
        "My favorite!",
        "Expert level unlocked!",
        "Coffee + This = Magic",
        "10/10 would code again",
        "Learning never stops!",
        "Production ready!",
        "Mom approved!",
        "LinkedIn endorsed!",
        "Stack Overflow approved",
        "ChatGPT's BFF",
        "Zero bugs* (*lies)",
        "I'm pretty good at this",
        "Can code blindfolded",
        "Neural networks go brr",
        "AGI when?",
        "Prompt engineer lvl 99",
        "Beep boop I'm an AI",
        "Context window maxed",
    ];
    const skills = [
        { icon: <FaReact size={'3em'} className='skill-icon fill-amber-800' />, text: 'React', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaAws size={'3em'} className='skill-icon fill-amber-800' />, text: 'AWS', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <SiTypescript size={'3em'} className='skill-icon fill-amber-800' />, text: 'TypeScript', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaNodeJs size={'3em'} className='skill-icon fill-amber-800' />, text: 'Node.js', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <SiMongodb size={'3em'} className='skill-icon fill-amber-800' />, text: 'MongoDB', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <SiExpress size={'3em'} className='skill-icon fill-amber-800' />, text: 'Express', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaDatabase size={'3em'} className='skill-icon fill-amber-800' />, text: 'SQL', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaLinux size={'3em'} className='skill-icon fill-amber-800' />, text: 'Linux', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaGitAlt size={'3em'} className='skill-icon fill-amber-800' />, text: 'Git', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <SiNextdotjs size={'3em'} className='skill-icon fill-amber-800' />, text: 'Next.js', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaRobot size={'3em'} className='skill-icon fill-amber-800' />, text: 'AI Agents', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <TbPlugConnected size={'3em'} className='skill-icon fill-amber-800' />, text: 'MCP', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaMobileAlt size={'3em'} className='skill-icon fill-amber-800' />, text: 'React Native', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <FaBrain size={'3em'} className='skill-icon fill-amber-800' />, text: 'RAG', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <SiOpenai size={'3em'} className='skill-icon fill-amber-800' />, text: 'LLM', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
        { icon: <HiSparkles size={'3em'} className='skill-icon fill-amber-800' />, text: 'Gen AI', message: funMessages[Math.floor(Math.random() * funMessages.length)] },
    ];

    const handleSkillClick = (index) => {
        const card = document.querySelectorAll('.skill-card')[index];

        gsap.to(card, {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.in",
            onComplete: () => {
                gsap.to(card, {
                    scale: 1,
                    duration: 0.3,
                    ease: "elastic.out(1, 0.5)"
                });
            }
        });
    };

    useGSAP(() => {
        // Set initial visibility
        gsap.set(['.skills-heading', '.skills-subheading', '.code-block', '.run-button'], {
            visibility: 'visible'
        });

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
                start: 'top 90%',
                end: 'top 60%',
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
                start: 'top 90%',
                end: 'top 65%',
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
                start: 'top 90%',
                end: 'top 55%',
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
                start: 'top 95%',
                end: 'top 65%',
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

        // Refresh ScrollTrigger after setup
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

    }, { scope: containerRef, dependencies: [clicked] });

    // Animation when skills grid appears
    useGSAP(() => {
        if (clicked) {
            gsap.set('.skill-card', { clearProps: 'all' });

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
                onComplete: () => {
                    gsap.set('.skill-card', { clearProps: 'all' });
                }
            });

            gsap.from('.skill-icon', {
                rotation: 360,
                scale: 0,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
                duration: 0.8,
                delay: 0.3,
                onComplete: () => {
                    gsap.set('.skill-icon', { clearProps: 'all' });
                }
            });
        }
    }, { scope: containerRef, dependencies: [clicked] });

    return (
        <section ref={containerRef} className='p-4 py-20 flex flex-col gap-2 mb-40 2xl:w-3/4 2xl:mx-auto overflow-visible'>
            <h2 className='skills-heading font-lexend text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tighter text-amber-950'>Ctrl + Alt + Skills</h2>
            <p className='skills-subheading tracking-tighter -mt-1 font-lexend lg:mt-4 xl:text-xl sm:text-base text-right font-medium text-sm text-amber-700/50'>Endorsed by Mom and Linkedin</p>
            {clicked ?
                (
                    <main className='mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 overflow-visible'>
                        {skills.map((skill, index) => {
                            return (
                                <div
                                    key={index}
                                    className='skill-card relative flex flex-col items-center p-2 px-4 gap-2 shadow-retro rounded-xl cursor-pointer group overflow-visible'
                                    onClick={() => handleSkillClick(index)}
                                    onMouseEnter={() => setHoveredSkill(index)}
                                    onMouseLeave={() => setHoveredSkill(null)}
                                    style={{
                                        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
                                        opacity: 1,
                                        visibility: 'visible'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-8px)';
                                        e.currentTarget.style.boxShadow = '6px 6px 0px #d97706, 12px 12px 0px #f59e0b, 18px 18px 0px #fbbf24';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '4px 4px 0px #d97706, 8px 8px 0px #f59e0b, 12px 12px 0px #fbbf24';
                                    }}
                                >
                                    {/* Random message popup */}
                                    {hoveredSkill === index && (
                                        <div className='absolute -top-14 left-1/2 -translate-x-1/2 bg-amber-950 text-amber-50 text-xs sm:text-sm px-3 py-2 rounded-lg whitespace-nowrap font-lexend font-medium shadow-xl z-10 pointer-events-none'>
                                            {skill.message}
                                            <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-950 rotate-45'></div>
                                        </div>
                                    )}

                                    {skill.icon}
                                    <span className='font-lexend text-amber-800 font-semibold text-sm sm:text-base'>
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