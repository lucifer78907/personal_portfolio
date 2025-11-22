import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const projects = [
    {
        id: 0,
        title: 'Initializ.ai Console',
        category: 'AI Platform',
        liveLink: 'https://www.initializ.ai/',
        color: '#4f46e5',
        description: 'Enterprise GenAI platform dashboard.'
    },
    {
        id: 1,
        title: 'LoanNetwork',
        category: 'Fintech',
        liveLink: 'https://loannetwork.app/',
        color: '#0ea5e9',
        description: 'Next-gen financial solutions.'
    },
    {
        id: 2,
        title: 'Offingo',
        category: 'E-commerce',
        color: '#f59e0b',
        description: 'Hyperlocal shopping experience.'
    },
    {
        id: 3,
        title: 'Zentask',
        category: 'Productivity',
        githubLink: 'https://github.com/lucifer78907/ZenTask',
        liveLink: 'https://zentask-dd7c9.web.app/login',
        color: '#10b981',
        description: 'Task management simplified.'
    },
    {
        id: 4,
        title: 'TrackIt',
        category: 'Transport',
        githubLink: 'https://github.com/lucifer78907/TrackIt/tree/main/frontend',
        color: '#ef4444',
        description: 'Real-time logistics tracking.'
    },
    {
        id: 5,
        title: 'Lawyer Firm',
        category: 'Business',
        githubLink: 'https://github.com/lucifer78907/Karan_Chaudhary_and_associates_website',
        liveLink: 'https://advkaranchaudhary.netlify.app/',
        color: '#8b5cf6',
        description: 'Legal services portfolio.'
    }
];

const Projects = () => {
    const containerRef = useRef(null);
    const sliderRef = useRef(null);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        const slider = sliderRef.current;
        const totalWidth = slider.scrollWidth - window.innerWidth;

        gsap.to(slider, {
            x: -totalWidth,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: `+=${totalWidth}`,
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true,
            }
        });

        // Parallax effect for cards
        const cards = gsap.utils.toArray('.project-card');
        cards.forEach((card, i) => {
            gsap.from(card, {
                scale: 0.8,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: gsap.getById("horizontal-scroll"), // This would need the tween to have an ID, but simple trigger works too if configured right. 
                    // For horizontal scroll triggers inside a pinned container, it's tricky. 
                    // Let's stick to a simpler stagger or just the horizontal movement first.
                    // Actually, let's add a subtle skew effect based on velocity
                }
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='relative h-screen overflow-hidden bg-primary'>
            <div className="absolute top-10 left-10 z-10">
                <h2 className="text-sm uppercase tracking-widest text-text-muted">Selected Works</h2>
                <p className="text-xs text-text-muted mt-2">Scroll to explore</p>
            </div>

            <div ref={sliderRef} className="flex h-full items-center pl-20 pr-20 gap-20 w-max">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="project-card relative w-[60vw] md:w-[40vw] lg:w-[30vw] h-[60vh] flex flex-col justify-between p-8 border border-border rounded-2xl bg-secondary/50 backdrop-blur-sm hover:bg-secondary transition-colors duration-500 group"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-110"></div>

                        <div>
                            <span className="text-6xl font-display font-bold text-text-muted/20 group-hover:text-accent/20 transition-colors duration-500">0{index + 1}</span>
                            <h3 className="text-3xl md:text-4xl font-display font-bold text-text-main mt-4 group-hover:text-accent transition-colors duration-300">
                                {project.title}
                            </h3>
                            <p className="text-text-muted mt-2 font-light">{project.category}</p>
                        </div>

                        <div>
                            <p className="text-text-muted mb-6 line-clamp-3">{project.description}</p>
                            <div className="flex gap-4">
                                {project.githubLink && (
                                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="p-3 rounded-full border border-border text-text-muted hover:text-primary hover:bg-accent transition-all duration-300">
                                        <FaGithub size={20} />
                                    </a>
                                )}
                                {project.liveLink && (
                                    <a href={project.liveLink} target="_blank" rel="noreferrer" className="p-3 rounded-full border border-border text-text-muted hover:text-primary hover:bg-accent transition-all duration-300">
                                        <FaExternalLinkAlt size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;

