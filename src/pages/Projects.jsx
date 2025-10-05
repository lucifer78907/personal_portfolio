import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
import { DiMongodb } from 'react-icons/di';
import { FaAws, FaCss3, FaDocker, FaExternalLinkAlt, FaGithub, FaHtml5, FaMobileAlt, FaNode, FaReact, FaSass, FaBrain, FaRobot } from 'react-icons/fa';
import { IoLogoFirebase } from 'react-icons/io5';
import { RiGitRepositoryPrivateFill, RiNextjsFill, RiTailwindCssFill } from 'react-icons/ri';
import { SiExpress, SiGreensock, SiJavascript, SiNetlify, SiReactrouter, SiSwiper, SiTypescript, SiOpenai, SiKubernetes, SiPostgresql } from 'react-icons/si';
import { HiSparkles } from 'react-icons/hi2';
import { TbPlugConnected } from 'react-icons/tb';

const projects = [
    {
        id: 0,
        title: 'Initializ.ai Console',
        description: 'Building enterprise GenAI platform dashboards with agentic workflows, knowledge bases, and RAG systems. Full-stack unified platform for AI application deployment with GPU optimization and serverless inferencing',
        liveLink: 'https://www.initializ.ai/',
        techStackIcons: [FaBrain, SiOpenai, HiSparkles, FaDocker, SiPostgresql, RiNextjsFill],
        isAI: true
    },
    {
        id: 1,
        title: 'LoanNetwork',
        description: 'AI-powered fintech loan marketplace connecting borrowers with top banks. Building responsive web app (Next.js) and mobile app (React Native) for instant loan comparison and digital processing',
        liveLink: 'https://loannetwork.app/',
        techStackIcons: [RiNextjsFill, FaMobileAlt, SiTypescript, RiTailwindCssFill, FaReact, SiOpenai, FaAws],
    },
    {
        id: 2,
        title: 'Offingo',
        description: 'Offingo is revolutionary tech product for offline retail fashion market to increase store footfall and multiply sales by 2x',
        techStackIcons: [RiNextjsFill, RiTailwindCssFill, SiTypescript, FaAws, FaDocker, SiSwiper]
    },
    {
        id: 3,
        title: 'Zentask',
        description: 'Zentask is a goal tracking app which looks aestheically pleasing on the frontend while being feasiable and fast from the backend',
        githubLink: 'https://github.com/lucifer78907/ZenTask',
        liveLink: 'https://zentask-dd7c9.web.app/login',
        techStackIcons: [FaReact, FaSass, SiExpress, DiMongodb, SiGreensock, IoLogoFirebase]
    },
    {
        id: 4,
        title: 'TrackIt',
        description: 'An application for University for tracking its buses and mointering them in real time. It is a frontend project ',
        githubLink: 'https://github.com/lucifer78907/TrackIt/tree/main/frontend',
        techStackIcons: [FaReact, FaSass, SiGreensock, SiReactrouter]
    },
    {
        id: 5,
        title: 'Lawyer firm website',
        description: 'This is a website for a law firm Karan Chauhary and associates',
        githubLink: 'https://github.com/lucifer78907/Karan_Chaudhary_and_associates_website',
        liveLink: 'https://advkaranchaudhary.netlify.app/',
        techStackIcons: [FaHtml5, FaSass, SiJavascript, SiNetlify]
    },
    {
        id: 6,
        title: 'Iron Temple Gym',
        description: 'A simple landing page for a gym , made using HTML and vanilla CSS and JS ',
        githubLink: 'https://github.com/lucifer78907/Gym_landing_page',
        liveLink: 'https://irontemplegym.netlify.app/',
        techStackIcons: [FaHtml5, FaCss3, SiJavascript, SiNetlify]
    },
    {
        id: 7,
        title: 'Omnifood restaurant',
        description: 'A landing page made for a fictional restaurant using HTML,CSS and JS ',
        liveLink: 'https://omnifood-rudra-website.netlify.app/',
        techStackIcons: [FaHtml5, FaCss3, SiJavascript, SiNetlify]
    },
];

function Projects() {
    const containerRef = useRef();

    gsap.registerPlugin(ScrollTrigger, SplitText);

    useGSAP(() => {
        // Heading animation
        const splitHeading = SplitText.create('.projects-heading', {
            type: 'chars',
        });

        gsap.from(splitHeading.chars, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.02,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.projects-heading',
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Subheading
        gsap.from('.projects-subheading', {
            opacity: 0,
            x: 50,
            scrollTrigger: {
                trigger: '.projects-subheading',
                start: 'top 80%',
                end: 'top 60%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Project cards stagger
        gsap.from('.project-card', {
            opacity: 0,
            y: 60,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.projects-container',
                start: 'top 70%',
                end: 'top 30%',
                scrub: 1.5,
                toggleActions: 'play none none reverse',
            }
        });

        ScrollTrigger.refresh();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='p-6 py-20 2xl:w-3/4 2xl:mx-auto'>
            <header className='mb-12'>
                <h2 className='projects-heading font-lexend text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tighter text-amber-950 overflow-hidden'>
                    Projects
                </h2>
                <p className='projects-subheading tracking-tighter mt-2 font-lexend sm:text-base lg:text-xl text-right font-medium text-sm text-amber-700/60'>
                    Talk's cheap! Show me the code
                </p>
            </header>
            <main className='projects-container flex gap-6 flex-col sm:gap-8'>
                {projects.map((project) => {
                    return <ProjectCard key={project.id} {...project} />
                })}
            </main>
        </section>
    );
}

export default Projects;

export const ProjectCard = ({ title, githubLink, liveLink, description, techStackIcons, isAI }) => {
    return (
        <article className={`project-card group p-6 sm:p-8 bg-gradient-to-br backdrop-blur-sm shadow-lg hover:shadow-2xl rounded-2xl border transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 ${isAI
            ? 'from-purple-50/40 via-blue-50/30 to-amber-50/30 border-purple-300/30 hover:border-purple-400/50'
            : 'from-amber-50/30 to-amber-100/20 border-amber-200/30'
            }`}>
            <header>
                <h2 className={`text-lg sm:text-2xl md:text-3xl xl:text-4xl font-lexend flex justify-between items-start gap-4 font-bold mb-3 ${isAI ? 'text-purple-900 group-hover:text-purple-700' : 'text-amber-900 group-hover:text-amber-800'
                    } transition-colors duration-300`}>
                    <span className='flex-1 flex items-center gap-2'>
                        {title}
                        {isAI && <HiSparkles className='text-purple-500 animate-pulse' size={'0.5em'} />}
                    </span>
                    <span className='text-base sm:text-xl xl:text-2xl flex gap-3 text-amber-700'>
                        {githubLink && (
                            <a
                                href={githubLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='hover:text-amber-900 transition-all duration-300 hover:scale-110 active:scale-95'
                                aria-label='GitHub Repository'
                            >
                                <FaGithub size={'1em'} />
                            </a>
                        )}
                        {liveLink && (
                            <a
                                href={liveLink}
                                target='_blank'
                                rel='noopener noreferrer'
                                className={`transition-all duration-300 hover:scale-110 active:scale-95  ${isAI ? 'hover:text-purple-700 text-purple-700' : 'hover:text-amber-900'
                                    }`}
                                aria-label='Live Demo'
                            >
                                <FaExternalLinkAlt size={'0.9em'} />
                            </a>
                        )}
                        {!githubLink && !liveLink && (
                            <p className='flex items-center gap-2 text-sm sm:text-base text-amber-600'>
                                <RiGitRepositoryPrivateFill />
                                <span className='hidden sm:inline'>Private</span>
                            </p>
                        )}
                    </span>
                </h2>
                <p className='text-sm sm:text-base xl:text-lg leading-relaxed text-amber-950/80 font-lexend'>
                    {description}
                </p>
            </header>
            <main className='mt-6'>
                <div className='flex items-center gap-3 flex-wrap'>
                    <p className={`text-xs sm:text-sm xl:text-base font-semibold font-lexend ${isAI ? 'text-purple-800' : 'text-amber-800'
                        }`}>
                        Tech Stack
                    </p>
                    <div className='flex flex-1 items-center justify-end gap-3 sm:gap-4 flex-wrap'>
                        {techStackIcons.map((IconComponent, index) => (
                            <span
                                key={index}
                                className={`transition-all duration-300 hover:scale-125 cursor-default ${isAI ? 'text-purple-600 hover:text-purple-800' : 'text-amber-700 hover:text-amber-900'
                                    }`}
                                style={{
                                    animation: `float 3s ease-in-out infinite`,
                                    animationDelay: `${index * 0.2}s`
                                }}
                            >
                                <IconComponent size="1.5em" className='sm:text-2xl' />
                            </span>
                        ))}
                    </div>
                </div>
            </main>

            {/* Decorative gradient line */}
            <div className={`mt-6 h-1 w-0 group-hover:w-full rounded-full transition-all duration-700 ease-out ${isAI
                ? 'bg-gradient-to-r from-purple-600 via-blue-500 to-purple-400'
                : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400'
                }`}></div>
        </article>
    );
};
