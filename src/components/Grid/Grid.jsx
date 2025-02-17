import React from 'react'
import { FaCat, FaCode, FaFigma, FaNodeJs, FaReact } from "react-icons/fa6";
import { FaCoffee } from 'react-icons/fa';





function Grid() {
    return (
        <section className='p-4 pt-0 flex flex-col gap-2 mb-12'>
            <h2 className='font-lexend text-lg flex items-center gap-1 font-semibold tracking-tighter text-amber-950'><span className='text-xl font-medium text-amber-600'>$</span>sudo find /root/moreAboutMe</h2>
            <p className='tracking-tighter -mt-1 font-lexend text-right font-medium text-sm text-amber-700/50'>There's always more to tell</p>
            <main className='grid grid-cols-1 gap-8 my-6'>

                <article className='bg-gradient-to-br from-amber-800 to-amber-400 via-amber-700   shadow-lg p-4  rounded-xl relative '>
                    <h2 className='mb-4  text-4xl tracking-tighter -top-8 -z-10 right-2 font-semibold text-amber-200'>I <span className='uppercase'>Work</span> on</h2>
                    <ul className='flex items-start justify-between  gap-2'>
                        <div className='flex flex-col items-center gap-2'>
                            <FaFigma size={'4em'} className='fill-amber-100' />
                            <h3 className='text-center text-amber-100 font-medium'>UI</h3>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <FaReact size={'4em'} className='fill-amber-100' />
                            <h3 className='text-center text-amber-100 font-medium'>Frontend</h3>
                        </div>
                        <div className='flex flex-col items-center gap-2'>
                            <FaNodeJs size={'4em'} className='fill-amber-100' />
                            <h3 className='text-center text-amber-100 font-medium'>Backend</h3>
                        </div>

                    </ul>
                </article>

                <article className='bg-gradient-to-br from-amber-50 to-amber-500 via-amber-100   shadow-lg p-4  rounded-xl relative'>
                    <h2 className='text-4xl mb-4 tracking-tighter font-semibold text-amber-600'>My <span className='uppercase'>Life</span> cycle</h2>
                    <main className='flex items-center justify-between gap-2'>
                        <div>
                            <FaCat size={'4em'} className='fill-amber-800' />
                            <h3 className='text-center text-amber-800 font-medium '>Cat</h3>
                        </div>
                        <div>
                            <FaCode size={'4em'} className='fill-amber-800' />
                            <h3 className='text-center text-amber-800 font-medium '>Code</h3>
                        </div>
                        <div>
                            <FaCoffee size={'4em'} className='fill-amber-800' />
                            <h3 className='text-center text-amber-800 font-medium '>Coffee</h3>

                        </div>
                    </main>
                </article>

            </main>
        </section >
    )
}

export default Grid

{/* <article className='bg-amber-100/30 backdrop-blur-md shadow-lg p-2 pt-0 rounded-xl border-2 border-amber-600'>
                    <h2 className='w-max p-2  rounded-b-xl justify-center mb-4 bg-amber-800 text-neutral-50 font-medium tracking-wide'>What i <span className='font-semibold tracking-tighter mx-1'>LOVE</span> to do</h2>
                    <main className='flex items-start justify-between'>

                        <div class="relative w-80 h-80 border border-gray-300">
                            <div class="absolute top-0 left-0 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">F</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">R</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">O</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">N</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">T</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">N</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">D</span>
                                </div>
                            </div>

                            <div class="absolute top-10 left-0 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">G</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">Y</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">M</span>
                                </div>
                            </div>

                            <div class="absolute top-10 left-[280px] group">
                                <div class="flex flex-col group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">C</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">O</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">D</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                </div>
                            </div>

                            <div class="absolute top-[80px] left-10 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">C</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">O</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">F</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">F</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                </div>
                            </div>

                            <div class="absolute top-40 left-0 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">B</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">A</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">C</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">K</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">N</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">D</span>
                                </div>
                            </div>

                            <div class="absolute top-[200px] left-20 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">P</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">H</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">O</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">T</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">O</span>
                                </div>
                            </div>

                            <div class="absolute top-[240px] left-20 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">D</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">S</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">I</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">G</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">N</span>
                                </div>
                            </div>

                            <div class="absolute top-[280px] left-10 group">
                                <div class="flex group-hover:-translate-y-2 transition-transform duration-300">
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">T</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">R</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">A</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">V</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">E</span>
                                    <span class="w-10 h-10 border border-amber-800 flex items-center justify-center bg-amber-200 text-amber-800">L</span>
                                </div>
                            </div>
                        </div>

                    </main>
                </article> */}