import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

const Contact = () => {
    const containerRef = useRef(null);
    const btnRef = useRef(null);

    useGSAP(() => {
        const btn = btnRef.current;

        const moveBtn = (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.3,
                ease: 'power2.out'
            });
        };

        const resetBtn = () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.3, ease: 'elastic.out(1, 0.3)' });
        };

        btn.addEventListener('mousemove', moveBtn);
        btn.addEventListener('mouseleave', resetBtn);

        return () => {
            btn.removeEventListener('mousemove', moveBtn);
            btn.removeEventListener('mouseleave', resetBtn);
        };
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='py-32 px-6 md:px-20 min-h-screen flex flex-col justify-between'>
            <div>
                <h2 className='text-[12vw] leading-[0.9] font-display font-bold uppercase tracking-tighter text-text-main mb-12'>
                    Let's<br />Talk
                </h2>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
                <div className="flex gap-6">
                    <a href="https://github.com/lucifer78907" target="_blank" rel="noreferrer" className="text-xl text-text-muted hover:text-text-main transition-colors">
                        <FaGithub />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" className="text-xl text-text-muted hover:text-text-main transition-colors">
                        <FaLinkedin />
                    </a>
                    <a href="#" target="_blank" rel="noreferrer" className="text-xl text-text-muted hover:text-text-main transition-colors">
                        <FaTwitter />
                    </a>
                </div>

                <a
                    ref={btnRef}
                    href="mailto:thesinghrudra@gmail.com"
                    className="inline-block px-12 py-6 bg-text-main text-primary rounded-full font-bold text-xl uppercase tracking-wider hover:bg-text-muted transition-colors"
                >
                    Get in touch
                </a>
            </div>

            <div className="mt-20 pt-10 border-t border-border flex justify-between text-sm text-text-muted uppercase tracking-widest">
                <span>Rudra Portfolio</span>
                <span>2025</span>
            </div>
        </section>
    );
};

export default Contact;

