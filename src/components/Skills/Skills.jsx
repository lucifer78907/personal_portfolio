import React from 'react';
import { FaReact, FaAws, FaNodeJs, FaDatabase, FaLinux, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs } from 'react-icons/si';


const Skills = () => {
    const skills = [
        { icon: <FaReact size={'3em'} className='fill-amber-800' />, text: 'React' },
        { icon: <FaAws size={'3em'} className='fill-amber-800' />, text: 'AWS' },
        { icon: <SiTypescript size={'3em'} className='fill-amber-800' />, text: 'TypeScript' },
        { icon: <FaNodeJs size={'3em'} className='fill-amber-800' />, text: 'Node.js' },
        { icon: <SiMongodb size={'3em'} className='fill-amber-800' />, text: 'MongoDB' },
        { icon: <SiExpress size={'3em'} className='fill-amber-800' />, text: 'Express' },
        { icon: <FaDatabase size={'3em'} className='fill-amber-800' />, text: 'SQL' },
        { icon: <FaLinux size={'3em'} className='fill-amber-800' />, text: 'Linux' },
        { icon: <FaGitAlt size={'3em'} className='fill-amber-800' />, text: 'Git' },
        { icon: <SiNextdotjs size={'3em'} className='fill-amber-800' />, text: 'Next.js' },
    ];


    return (
        <section className='p-4 flex flex-col gap-2'>
            <h2 className='text-6xl text-amber-600 font-lexend font-bold tracking-tighter'>SKILLS</h2>
            <p className='text-right text-amber-800/50 font-medium '>Things I Pretend to Be a Wizard At</p>
            <main className='mt-4 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4'>

                {skills.map((skill, index) => {
                    return (

                        <div key={index} className='flex flex-col items-center p-2 px-4 gap-2 shadow-retro rounded-xl'>
                            {skill.icon}
                            <span className='font-lexend text-amber-800 font-semibold'>
                                {skill.text}
                            </span>
                        </div>
                    );
                })}
            </main>
        </section>
    );
};

export default Skills;