import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useIntro } from "../context/introContext";
import { EASE } from "../lib/eases";

const BAR_COUNT = typeof window !== "undefined" && window.innerWidth > 768 ? 12 : 6;

// A real loader doesn't climb at a constant rate — it surges, stalls, surges.
// Each stage counts up to `value`, then holds for `pause` before the next one.
// Total ≈ 2.8s. Tune these numbers to change the whole feel of the count.
const COUNT_STAGES = [
    { value: 37, duration: 0.65, pause: 0.22 },
    { value: 71, duration: 0.55, pause: 0.18 },
    { value: 94, duration: 0.50, pause: 0.28 },
    { value: 100, duration: 0.40, pause: 0 },
];

const HeroLoader = () => {
    const overlayRef = useRef(null);
    const counterRef = useRef(null);
    const { finishIntro } = useIntro();

    useGSAP(() => {
        const counter = { value: 0 };
        const render = () => {
            if (counterRef.current) counterRef.current.textContent = counter.value;
        };

        const tl = gsap.timeline();

        COUNT_STAGES.forEach(({ value, duration, pause }) => {
            tl.to(counter, {
                value,
                duration,
                ease: EASE.travel,
                snap: { value: 1 },
                onUpdate: render,
            });
            if (pause) tl.to({}, { duration: pause }); // deliberate stall
        });

        tl.to(".hero__counter", { opacity: 0, duration: 0.35, ease: EASE.text }, "+=0.25")
            .to(".hero__bar", {
                height: 0,
                duration: 1.15,
                stagger: { amount: 0.4 },
                ease: EASE.travel,
            }, "-=0.15")
            // Hand off just before the bars finish so the page is already moving
            // as it's revealed — but only just, so it reads as its own beat.
            .call(finishIntro, null, "-=0.25")
            .set(overlayRef.current, { display: "none" });
    }, { scope: overlayRef });

    return (
        <section ref={overlayRef} className="hero__overlay fixed inset-0 z-[101] flex">
            <p
                ref={counterRef}
                className="hero__counter fixed font-lexend z-20 text-8xl bottom-10 right-10 text-amber-200"
            >
                0
            </p>
            {Array.from({ length: BAR_COUNT }, (_, i) => (
                <div key={i} className="hero__bar flex-1 h-full bg-amber-800" />
            ))}
        </section>
    );
};

export default HeroLoader;
