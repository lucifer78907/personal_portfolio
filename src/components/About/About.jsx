import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText, ScrollTrigger } from 'gsap/all';

const About = () => {
    const containerRef = useRef();

    useGSAP(() => {
        // Set initial visibility
        gsap.set(['.about-heading', '.about-subheading', '.about-paragraph', '.about-highlight', '.dollar-sign'], {
            visibility: 'visible'
        });

        // Heading animation
        gsap.from('.about-heading', {
            opacity: 0,
            x: -50,
            scrollTrigger: {
                trigger: '.about-heading',
                start: 'top 90%',
                end: 'top 60%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        gsap.from('.dollar-sign', {
            scale: 0,
            rotation: 360,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: '.about-heading',
                start: 'top 85%',
                end: 'top 60%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
            }
        });

        // Subheading
        gsap.from('.about-subheading', {
            opacity: 0,
            x: 50,
            scrollTrigger: {
                trigger: '.about-subheading',
                start: 'top 90%',
                end: 'top 65%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Paragraphs
        const paragraphs = gsap.utils.toArray('.about-paragraph');
        paragraphs.forEach((para) => {
            const split = SplitText.create(para, {
                type: 'lines',
                linesClass: 'about-line'
            });

            gsap.from(split.lines, {
                yPercent: 100,
                opacity: 0,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: para,
                    start: 'top 90%',
                    end: 'top 55%',
                    scrub: 1.2,
                    toggleActions: 'play none none reverse',
                }
            });
        });

        // Highlights
        gsap.from('.about-highlight', {
            scale: 0.5,
            opacity: 0,
            stagger: 0.2,
            ease: "back.out(2)",
            scrollTrigger: {
                trigger: '.about-content',
                start: 'top 85%',
                end: 'top 50%',
                scrub: 1.3,
                toggleActions: 'play none none reverse',
            }
        });

        // Refresh ScrollTrigger after setup
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='p-4 py-20 flex flex-col gap-2 2xl:w-3/4 2xl:mx-auto'>
            <h2 className='about-heading font-lexend text-lg sm:text-xl xl:text-3xl md:text-2xl flex items-center gap-1 md:gap-2 font-semibold tracking-tighter text-amber-950'>
                <span className='dollar-sign text-xl md:text-3xl font-medium text-amber-600'>$</span>
                sudo find /root/moreAboutMe
            </h2>
            <p className='about-subheading tracking-tighter -mt-1 sm:text-base xl:text-lg font-lexend text-right font-medium text-sm text-amber-700/50'>There's always more to tell</p>
            <main className='about-content mt-2 text-lg xl:text-xl xl:leading-10 xl:w-[65ch]  md:leading-loose font-medium text-amber-900 flex flex-col gap-4 leading-relaxed'>
                <p className='about-paragraph'>Started coding in 2020 and haven&apos;t stopped since—basically living the <span className='about-highlight bg-amber-700 p-1 text-amber-50 inline-block'>'just one more deploy'</span> life. I&apos;ve built sleek web apps, APIs, boosted SEO so well it might as well be on steroids.
                </p>
                <p className='about-paragraph'>
                    These days, I&apos;m all about building cool stuff, helping others grow, and making the web a better place , think of me as the <span className='about-highlight bg-amber-700 p-1 text-amber-50'>
                        Tony Stark</span> of web devs: always tinkering, sometimes snarky, but always delivering."
                </p>
            </main>
        </section >
    );
};

export default About;