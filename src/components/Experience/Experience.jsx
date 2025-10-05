import { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText, MotionPathPlugin } from 'gsap/all';

const Experience = () => {
    const containerRef = useRef();
    const pathRef = useRef();

    gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin);

    const experiences = [
        {
            company: 'Initializ.ai',
            role: 'SDE - 2',
            period: 'May 2024 - Present',
            description: 'Building enterprise GenAI platform dashboards with agentic workflows and RAG systems. Developing scalable AI application deployment solutions with GPU optimization and serverless inferencing.',
            color: '#9333ea', // purple-600
            icon: '🤖'
        },
        {
            company: 'Coalmantra',
            role: 'Software Developer',
            period: 'March 2024 - May 2024',
            description: 'Developed full-stack web applications using React and Node.js. Implemented responsive UI components and RESTful APIs for client projects.',
            color: '#d97706', // amber-600
            icon: '💻'
        }
    ];

    useGSAP(() => {
        // Heading animation
        const splitHeading = SplitText.create('.experience-heading', {
            type: 'chars',
        });

        gsap.from(splitHeading.chars, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.02,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.experience-heading',
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Subheading
        gsap.from('.experience-subheading', {
            opacity: 0,
            x: 50,
            scrollTrigger: {
                trigger: '.experience-subheading',
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Animate SVG path drawing
        const path = pathRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, {
            strokeDasharray: pathLength,
            strokeDashoffset: pathLength,
        });

        gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: '.experience-timeline',
                start: 'top 70%',
                end: 'bottom 30%',
                scrub: 1.5,
                toggleActions: 'play none none reverse',
            }
        });

        // Animate experience cards
        gsap.utils.toArray('.experience-card').forEach((card, index) => {
            gsap.from(card, {
                opacity: 0,
                x: index % 2 === 0 ? -80 : 80,
                scale: 0.9,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 75%',
                    end: 'top 45%',
                    scrub: 1.2,
                    toggleActions: 'play none none reverse',
                }
            });

            // Animate the dot/icon
            const dot = card.querySelector('.timeline-dot');
            gsap.from(dot, {
                scale: 0,
                ease: "back.out(2)",
                scrollTrigger: {
                    trigger: card,
                    start: 'top 70%',
                    end: 'top 50%',
                    scrub: 1,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        ScrollTrigger.refresh();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='p-6 py-20 2xl:w-3/4 2xl:mx-auto overflow-visible'>
            <header className='mb-16'>
                <h2 className='experience-heading font-lexend text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tighter text-amber-950 overflow-hidden'>
                    Experience
                </h2>
                <p className='experience-subheading tracking-tighter mt-2 font-lexend sm:text-base lg:text-xl text-right font-medium text-sm text-amber-700/60'>
                    Journey so far...
                </p>
            </header>

            <div className='experience-timeline relative'>
                {/* SVG Path */}
                <svg
                    className='absolute left-1/2 top-0 -translate-x-1/2 h-full w-full pointer-events-none hidden md:block'
                    style={{ zIndex: 0 }}
                >
                    <path
                        ref={pathRef}
                        d={`M ${window.innerWidth / 2} 0 Q ${window.innerWidth / 2 + 100} 200, ${window.innerWidth / 2} 400 T ${window.innerWidth / 2} 800`}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#9333ea" />
                            <stop offset="50%" stopColor="#d97706" />
                            <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Mobile vertical line */}
                <div className='md:hidden absolute left-8 top-0 w-1 h-full bg-gradient-to-b from-purple-600 via-amber-600 to-amber-400 rounded-full'></div>

                <div className='relative z-10 space-y-16 md:space-y-24'>
                    {experiences.map((exp, index) => (
                        <div
                            key={index}
                            className={`experience-card flex items-center gap-6 md:gap-12 ${
                                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                            }`}
                        >
                            {/* Timeline dot/icon */}
                            <div className='timeline-dot relative flex-shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2'>
                                <div
                                    className='w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-3xl md:text-4xl shadow-xl border-4 border-white'
                                    style={{ backgroundColor: exp.color }}
                                >
                                    {exp.icon}
                                </div>
                            </div>

                            {/* Content card */}
                            <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                                <div className='group p-6 bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-amber-200/40 hover:scale-[1.02]'>
                                    <div className='flex flex-col gap-2'>
                                        <h3 className='font-lexend text-2xl md:text-3xl font-bold text-amber-950'>
                                            {exp.role}
                                        </h3>
                                        <h4 className='font-lexend text-lg md:text-xl font-semibold' style={{ color: exp.color }}>
                                            {exp.company}
                                        </h4>
                                        <p className='font-lexend text-sm md:text-base text-amber-700/70 font-medium'>
                                            {exp.period}
                                        </p>
                                        <p className='font-lexend text-sm md:text-base text-amber-950/80 leading-relaxed mt-3'>
                                            {exp.description}
                                        </p>
                                    </div>

                                    {/* Decorative gradient line */}
                                    <div
                                        className='mt-4 h-1 w-0 group-hover:w-full rounded-full transition-all duration-700 ease-out'
                                        style={{
                                            background: `linear-gradient(to right, ${exp.color}, ${exp.color}80)`
                                        }}
                                    ></div>
                                </div>
                            </div>

                            {/* Spacer for alternating layout on desktop */}
                            <div className='hidden md:block flex-1'></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
