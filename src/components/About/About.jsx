import React from 'react';

const About = () => {
    return (
        <section className='p-4 flex flex-col gap-2 mb-6'>
            <h2 className='font-lexend text-6xl font-semibold tracking-tighter text-amber-950'>Ctrl + Me</h2>
            <p className='tracking-tighter -mt-1 font-lexend text-right font-medium text-sm text-amber-700/50'>The guy behind the keyboard</p>
            <main className='mt-2 text-lg font-medium text-amber-900 flex flex-col gap-4 leading-relaxed'>
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