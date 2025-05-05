import React from 'react'
import { DiMongodb } from 'react-icons/di'
import { FaAws, FaCss3, FaDocker, FaExternalLinkAlt, FaGithub, FaHtml5, FaNode, FaReact, FaSass } from 'react-icons/fa'
import { IoLogoFirebase } from 'react-icons/io5'
import { RiGitRepositoryPrivateFill, RiNextjsFill, RiTailwindCssFill } from 'react-icons/ri'
import { SiExpress, SiGreensock, SiJavascript, SiNetlify, SiReactrouter, SiSwiper, SiTypescript } from 'react-icons/si'

const projects = [
    {
        id: 0,
        title: 'Offingo',
        description: 'Offingo | Offingo is revolutionary tech product for offline retail fashion market to increase store footfall and multiply sales by 2x',
        techStackIcons: [RiNextjsFill, RiTailwindCssFill, SiTypescript, FaAws, FaDocker, SiSwiper]
    },
    {
        id: 1,
        title: 'Zentask',
        description: 'Zentask is a goal tracking app which looks aestheically pleasing on the frontend while being feasiable and fast from the backend',
        githubLink: 'https://github.com/lucifer78907/ZenTask',
        liveLink: 'https://zentask-dd7c9.web.app/login',
        techStackIcons: [FaReact, FaSass, SiExpress, DiMongodb, SiGreensock, IoLogoFirebase]
    },
    {
        id: 2,
        title: 'TrackIt',
        description: 'An application for University for tracking its buses and mointering them in real time. It is a frontend project ',
        githubLink: 'https://github.com/lucifer78907/TrackIt/tree/main/frontend',
        techStackIcons: [FaReact, FaSass, SiGreensock, SiReactrouter]
    },
    {
        id: 3,
        title: 'Lawyer firm website',
        description: 'This is a website for a law firm Karan Chauhary and associates',
        githubLink: 'https://github.com/lucifer78907/Karan_Chaudhary_and_associates_website',
        liveLink: 'https://advkaranchaudhary.netlify.app/',
        techStackIcons: [FaHtml5, FaSass, SiJavascript, SiNetlify]
    },
    {
        id: 4,
        title: 'Iron Temple Gym',
        description: 'A simple landing page for a gym , made using HTML and vanilla CSS and JS ',
        githubLink: 'https://github.com/lucifer78907/Gym_landing_page',
        liveLink: 'https://irontemplegym.netlify.app/',
        techStackIcons: [FaHtml5, FaCss3, SiJavascript, SiNetlify]
    },
    {
        id: 5,
        title: 'Omnifood restaurant',
        description: 'A landing page made for a fictional restaurant using HTML,CSS and JS ',
        liveLink: 'https://omnifood-rudra-website.netlify.app/',
        techStackIcons: [FaHtml5, FaCss3, SiJavascript, SiNetlify]
    },

]

function Projects() {
    return (
        <section className='p-6 2xl:w-3/4 2xl:mx-auto'>
            <header>
                <h2 className='font-lexend text-6xl md:text-7xl font-semibold tracking-tighter text-amber-950'>Projects</h2>
                <p className='tracking-tighter mt-1 font-lexend sm:text-base lg:text-lg text-right font-medium text-sm text-amber-700/50'>Talk's cheap! Show me the code</p>
            </header>
            <main className='mt-4 flex  gap-4 flex-col sm:gap-8'>
                {projects.map((project) => {
                    return <ProjectCard key={project.id} {...project} />
                })}

            </main>
        </section>
    )
}

export default Projects

export const ProjectCard = ({ title, githubLink, liveLink, description, techStackIcons }) => {
    return <article className='p-6 shadow-md rounded-xl'>
        <header>
            <h2 className='text-base sm:text-xl md:text-2xl xl:text-3xl font-lexend flex justify-between items-center text-amber-800 font-semibold'>{title}
                <span className='text-xs sm:text-base xl:text-lg flex  gap-2'>
                    {githubLink &&
                        <a href={githubLink} target='_blank'><FaGithub size={'1.2em'} /></a>
                    }
                    {liveLink &&
                        <a href={liveLink} target='_blank'><FaExternalLinkAlt size={'1.2em'} /></a>
                    }
                    {!githubLink && !liveLink && <p className='flex items-stretch  gap-1'><RiGitRepositoryPrivateFill className='mt-1' /> Private repo</p>}
                </span>
            </h2>
            <p className='mt-1 text-xs sm:text-base xl:hidden xl:text-lg sm:mt-2 text-neutral-800'>{description.length > 100 ? `${description.slice(0, 100)} ...` : description}</p>
            <p className='hidden xl:block mt-1 text-lg sm:mt-2 text-neutral-800'>{description}</p>
        </header>
        <main className='mt-3'>
            <p className='text-xs sm:text-base xl:text-lg font-medium text-amber-700 flex items-center gap-2'>Tech stack -
                <span className='flex flex-1 items-center justify-around'>
                    {techStackIcons.map((IconComponent, index) => (
                        <IconComponent key={index} size="1.4em" />
                    ))}
                </span>
            </p>
        </main>
    </article>
}