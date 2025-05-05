import React from 'react';

const About = () => {
    return (
        <section className='p-4 flex flex-col gap-2 mb-6 2xl:w-3/4 2xl:mx-auto'>
            <h2 className='font-lexend text-lg sm:text-xl xl:text-3xl md:text-2xl flex items-center gap-1 md:gap-2 font-semibold tracking-tighter text-amber-950'><span className='text-xl md:text-3xl font-medium text-amber-600'>$</span>sudo find /root/moreAboutMe</h2>
            <p className='tracking-tighter -mt-1 sm:text-base xl:text-lg font-lexend text-right font-medium text-sm text-amber-700/50'>There's always more to tell</p>
            <main className='mt-2 text-lg xl:text-xl xl:leading-10 xl:w-[65ch]  md:leading-loose font-medium text-amber-900 flex flex-col gap-4 leading-relaxed'>
                <p>Started coding in 2020 and haven&apos;t stopped since—basically living the <span className='bg-amber-700 p-1 text-amber-50 inline-block'>'just one more deploy'</span> life. I&apos;ve built sleek web apps, APIs, boosted SEO so well it might as well be on steroids.
                </p>
                <p>
                    These days, I&apos;m all about building cool stuff, helping others grow, and making the web a better place , think of me as the <span className='bg-amber-700 p-1 text-amber-50'>
                        Tony Stark</span> of web devs: always tinkering, sometimes snarky, but always delivering."
                </p>
            </main>
        </section >
    );
};

export default About;