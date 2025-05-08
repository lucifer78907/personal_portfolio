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
        tl.to(".hero__counter", { duration: 0.25, delay: 3.5, opacity: 0 });
        tl.to(
            ".hero__bar",
            {
                duration: 1.5,
                height: 0,
                stagger: {
                    amount: 0.5,
                },
                ease: "power4.inOut",
            },
            "<"
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
    const total = 12;
    const bars = [];

    for (let i = 0; i < total; i++) {
        bars.push(<div key={i} className="hero__bar w-[15vw] h-[105vh] bg-amber-800"></div>);
    }

    return <>{bars}</>;
};

