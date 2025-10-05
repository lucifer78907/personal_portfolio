import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
// Components

const HeroLoader = ({ addAnimation, index }) => {
    const counterRef = useRef(null);

    useLayoutEffect(() => {
        let timeout;
        const startLoader = () => {
            let currValue = 0;

            const updateCounter = () => {
                if (currValue == 100) {
                    return;
                }

                currValue += Math.floor(Math.random() * 10) + 1;

                if (currValue > 100) {
                    currValue = 100;
                }

                if (counterRef.current !== null) {
                    counterRef.current.textContent = currValue.toString();
                }

                let delay = Math.floor(Math.random() * 200) + 50;
                timeout = setTimeout(updateCounter, delay);
            };
            updateCounter();
        };

        startLoader();

        return () => clearTimeout(timeout);
    }, []);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.to(".hero__counter", { duration: 0.2, delay: 2.2, opacity: 0 });
        tl.to(
            ".hero__bar",
            {
                duration: 1,
                height: 0,
                stagger: {
                    amount: 0.3,
                },
                ease: "power3.inOut",
            },
            "-=0.1"
        );
        tl.set(".hero__overlay", { display: "none" });
        addAnimation(tl, index);
    });

    return (
        <section className="hero__overlay fixed h-screen w-screen z-[101] flex">
            <p className="hero__counter fixed font-lexend z-20 text-8xl bottom-10 right-10 text-amber-200" ref={counterRef}>
                0
            </p>
            <LoadingBars />
        </section>
    );
};

export default HeroLoader;

export const LoadingBars = () => {
    const total = window.innerWidth > 768 ? 12 : 6;
    const width = total === 12 ? 'w-[15vw]' : 'w-[20vw]'
    const bars = [];

    for (let i = 0; i < total; i++) {
        bars.push(<div key={i} className={`hero__bar ${width} h-[105vh] bg-amber-800`}></div>);
    }

    return <>{bars}</>;
};

