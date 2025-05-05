import React, { useState } from 'react';
import { FaReact, FaAws, FaNodeJs, FaDatabase, FaLinux, FaGitAlt } from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiNextdotjs } from 'react-icons/si';
import { BiSolidRightArrow } from "react-icons/bi";



const Skills = () => {
    const [clicked, setClicked] = useState(false);
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
        <section className='p-4 flex flex-col gap-2 mb-12 2xl:w-3/4 2xl:mx-auto'>
            <h2 className='font-lexend text-6xl md:text-7xl xl:text-8xl font-semibold tracking-tighter text-amber-950'>Ctrl + Alt + Skills</h2>
            <p className='tracking-tighter -mt-1 font-lexend lg:mt-4 xl:text-xl sm:text-base text-right font-medium text-sm text-amber-700/50'>Endorsed by Mom and Linkedin</p>
            {clicked ?
                (
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
                ) :
                (
                    <main className='mt-4 '>
                        <h3 className='font-lexend text-xl md:text-2xl xl:text-3xl p-2 text-amber-950'><span className='font-medium text-amber-700'>db</span>.skills.<span className='font-semibold text-amber-600'>find</span>{'({'}
                            <p className='ml-4'>{"{ id: '476967642049534f' }"}</p>
                            <p className='ml-4'>{"{ name: 'Rudra' }"}</p>
                            <p>{'});'}</p>
                        </h3>
                        <button onClick={() => setClicked(true)} className='flex items-center gap-2 mt-4 text-lg bg-amber-800 mx-auto font-medium text-neutral-50 px-4 py-2 rounded-md '>Run query <BiSolidRightArrow size={'1.2em'} /></button>
                    </main>
                )

            }

        </section>
    );
};

export default Skills;