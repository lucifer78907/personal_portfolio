import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { EASE } from '../lib/eases'; // registers quartInOut / expoOut / quintOut
import img1 from '../assets/gallery/image1.webp';
import img2 from '../assets/gallery/image2.webp';
import img3 from '../assets/gallery/image3.webp';
import img4 from '../assets/gallery/image4.webp';
import img5 from '../assets/gallery/image5.webp';
import img6 from '../assets/gallery/image6.webp';
import img7 from '../assets/gallery/image7.webp';
import img8 from '../assets/gallery/image8.webp';
import img9 from '../assets/gallery/image9.webp';
import img10 from '../assets/gallery/image10.webp';
import img11 from '../assets/gallery/image11.webp';
import img12 from '../assets/gallery/image12.webp';
import img13 from '../assets/gallery/image13.webp';
import img14 from '../assets/gallery/image14.webp';
import img15 from '../assets/gallery/image15.webp';
import img16 from '../assets/gallery/image16.webp';
import img17 from '../assets/gallery/image17.webp';
import img18 from '../assets/gallery/image18.webp';
import img19 from '../assets/gallery/image19.webp';
import img20 from '../assets/gallery/image20.webp';
import img21 from '../assets/gallery/image21.webp';
import img22 from '../assets/gallery/image22.webp';
import img23 from '../assets/gallery/image23.webp';

gsap.registerPlugin(Observer);

// `label` is the giant display word, deliberately kept to one short token — the
// heading is sized off its own character count (see headingSize) and anything
// longer than ~9 characters stops reading as a poster and starts reading as a
// sentence. The full title lives in the caption instead.
const PHOTOS = [
    { img: img1, label: 'GOLDEN', title: 'Golden Hour Vibes', desc: "Captured during sunset — nature's perfect lighting" },
    { img: img2, label: 'URBAN', title: 'Urban Explorer', desc: 'City streets tell stories through shadows' },
    { img: img3, label: 'MIDNIGHT', title: 'Midnight Blues', desc: 'When the city sleeps, lights come alive' },
    { img: img4, label: 'CANVAS', title: "Nature's Canvas", desc: 'Raw beauty in its purest form' },
    { img: img5, label: 'POETRY', title: 'Street Poetry', desc: 'Life unfolds in unexpected moments' },
    { img: img6, label: 'BURST', title: 'Color Burst', desc: 'Vibrant hues dancing in harmony' },
    { img: img7, label: 'WHISPER', title: 'Silent Whispers', desc: 'Quiet moments that speak volumes' },
    { img: img8, label: 'JUNGLE', title: 'Concrete Jungle', desc: 'Architecture meets emotion' },
    { img: img9, label: 'SHADOW', title: 'Light & Shadow', desc: 'Playing with contrasts and depth' },
    { img: img10, label: 'HIDDEN', title: 'Hidden Gems', desc: 'Beauty in the overlooked corners' },
    { img: img11, label: 'STILL', title: 'Time Stands Still', desc: 'Frozen moments of pure magic' },
    { img: img12, label: 'MIRROR', title: 'Reflections', desc: 'Mirror worlds and parallel realities' },
    { img: img13, label: 'MOTION', title: 'Motion Blur', desc: 'Life in constant movement' },
    { img: img14, label: 'TEXTURE', title: 'Textures', desc: 'Details that tell deeper stories' },
    { img: img15, label: 'LESS', title: 'Minimalism', desc: 'Less is more — simplicity speaks' },
    { img: img16, label: 'PATTERN', title: 'Pattern Play', desc: 'Repetition creates rhythm' },
    { img: img17, label: 'WANDER', title: 'Wanderlust', desc: 'Journey captured in pixels' },
    { img: img18, label: 'MOOD', title: 'Mood Setter', desc: 'Atmosphere over everything' },
    { img: img19, label: 'RAW', title: 'Raw Emotion', desc: 'Feelings translated visually' },
    { img: img20, label: 'SHIFT', title: 'Perspective Shift', desc: 'Seeing the world differently' },
    { img: img21, label: 'NIGHT', title: 'Night Tales', desc: 'Stories that unfold after dark' },
    { img: img22, label: 'CHANCE', title: 'Spontaneous', desc: 'Unplanned perfection' },
    { img: img23, label: 'FINAL', title: 'Final Frame', desc: 'Every ending is a new beginning' },
];

const N = PHOTOS.length;

// Deep, warm grounds pulled from the site's amber/stone scale. Cycled rather
// than one per photo — 23 hand-picked backgrounds would be noise, and the
// cycle length (5) is coprime enough with 23 that the wrap from the last slide
// back to the first still lands on a different tone.
const TONES = ['#451a03', '#1c1917', '#5b3218', '#2c2118', '#78350f'];

// Lexend is loaded as a variable font (wght 100..900), so the codepen's
// width-axis stretch becomes a weight surge here: headings rest at 200 and are
// driven to 800 as they leave. Same gesture, an axis we actually have.
const WGHT_REST = 200;
const WGHT_STRETCH = 800;

// Fill ~85vw with the word, but never past 15vw per the codepen's ceiling.
// 0.62em is roughly Lexend's uppercase advance width at rest.
const headingSize = (label) =>
    `clamp(2.5rem, ${Math.min(15, 85 / (label.length * 0.62)).toFixed(2)}vw, 11rem)`;

// 8.4MB of photos cannot all be attached at once, and `loading="lazy"` is no
// help: every slide is laid out inside the viewport (only `visibility` hides
// them), so the browser considers all 23 visible and fetches the lot. So the
// src is windowed by hand. The window is ±2 and only ever grows, which means
// the incoming slide was attached a step before it is needed, and stepping
// back never refetches.
const PRELOAD = 2;
const nearby = (i) => {
    const s = new Set();
    for (let d = -PRELOAD; d <= PRELOAD; d++) s.add(((i + d) % N + N) % N);
    return s;
};

const pad = (n) => String(n).padStart(2, '0');

const Gallery = () => {
    const rootRef = useRef(null);
    const countRef = useRef(null);
    const titleRef = useRef(null);
    const descRef = useRef(null);
    const captionRef = useRef(null);
    const progressRef = useRef(null);

    const [attached, setAttached] = useState(() => nearby(0));

    // This page owns the whole viewport and never scrolls, so ScrollSmoother's
    // scroll normaliser has nothing to do here — but it still swallows wheel
    // and touch at the document level, which is exactly what Observer wants.
    // Parked for the life of the page and woken up on the way out. disable() /
    // enable() on the normalizer instance is the same lever ScrollSmoother
    // pulls in its own paused() path, so nothing gets rebuilt or reconfigured.
    //
    // The rAF matters: effects run child-first, so on a cold load of this route
    // RootLayout has not created the smoother yet when this fires.
    useEffect(() => {
        const id = requestAnimationFrame(() => ScrollSmoother.get()?.normalizer?.disable());
        return () => {
            cancelAnimationFrame(id);
            ScrollSmoother.get()?.normalizer?.enable();
        };
    }, []);

    useGSAP(() => {
        const slides = gsap.utils.toArray('.g-slide');
        const outers = gsap.utils.toArray('.g-outer');
        const inners = gsap.utils.toArray('.g-inner');
        const headings = gsap.utils.toArray('.g-heading');
        const slideImgs = gsap.utils.toArray('.g-slide-img');
        const overlayImgs = gsap.utils.toArray('.g-overlay-img');

        const wrap = gsap.utils.wrap(0, N);
        let currentIndex = 0;
        let animating = false;

        // ── Resting state ────────────────────────────────────────────────
        // Outer parked right, inner pulled left by the same amount: the content
        // sits exactly where it belongs while its clipping window is off-screen.
        // Sliding both to 0 unmasks the slide in place rather than moving it.
        gsap.set(outers, { xPercent: 100 });
        gsap.set(inners, { xPercent: -100 });
        gsap.set([outers[0], inners[0]], { xPercent: 0 });
        gsap.set([slides[0], overlayImgs[0]], { autoAlpha: 1, zIndex: 1 });
        gsap.set(progressRef.current, { scaleX: 1 / N, transformOrigin: 'left center' });

        // ── Entrance ─────────────────────────────────────────────────────
        gsap.from(rootRef.current, { autoAlpha: 0, duration: 0.6, ease: EASE.text });
        gsap.from(headings[0], {
            '--wght': WGHT_STRETCH,
            xPercent: -14,
            duration: 1.3,
            ease: EASE.arrive,
            delay: 0.1,
        });
        gsap.from(slideImgs[0], { scale: 1.5, duration: 1.5, ease: EASE.travel });
        gsap.from(captionRef.current, { autoAlpha: 0, y: 20, duration: 0.8, delay: 0.35, ease: EASE.text });

        const gotoSection = (rawIndex, direction) => {
            animating = true;
            const index = wrap(rawIndex);

            // Attach the new neighbourhood before the transition needs it.
            setAttached((prev) => {
                const next = new Set(prev);
                let grew = false;
                nearby(index).forEach((i) => {
                    if (!next.has(i)) { next.add(i); grew = true; }
                });
                return grew ? next : prev;
            });

            const heading = headings[currentIndex];
            const nextHeading = headings[index];

            // Outgoing slide sits under the incoming one; the overlay images
            // are paired the other way round so the two layers cross.
            gsap.set([slides, overlayImgs], { zIndex: 0, autoAlpha: 0 });
            gsap.set([slides[currentIndex], overlayImgs[index]], { zIndex: 1, autoAlpha: 1 });
            gsap.set([slides[index], overlayImgs[currentIndex]], { zIndex: 2, autoAlpha: 1 });

            const tl = gsap.timeline({
                defaults: { duration: 1, ease: EASE.travel },
                onComplete: () => { animating = false; },
            });

            tl
                // Text swap is scheduled a third of the way in — late enough to
                // be hidden by the wipe, early enough to be settled on arrival.
                .call(() => {
                    if (countRef.current) countRef.current.textContent = pad(index + 1);
                    if (titleRef.current) titleRef.current.textContent = PHOTOS[index].title;
                    if (descRef.current) descRef.current.textContent = PHOTOS[index].desc;
                }, null, 0.32)
                .to(captionRef.current, { autoAlpha: 0, y: -14, duration: 0.3, ease: EASE.text }, 0)
                .fromTo(captionRef.current,
                    { autoAlpha: 0, y: 14 },
                    { autoAlpha: 1, y: 0, duration: 0.5, ease: EASE.text }, 0.32)
                .to(progressRef.current, { scaleX: (index + 1) / N, duration: 0.8, ease: EASE.text }, 0.32)

                // The wipe.
                .fromTo(outers[index], { xPercent: 100 * direction }, { xPercent: 0 }, 0)
                .fromTo(inners[index], { xPercent: -100 * direction }, { xPercent: 0 }, 0)

                // Headings fatten as they leave and thin out as they land.
                .to(heading, { '--wght': WGHT_STRETCH, xPercent: 30 * direction }, 0)
                .fromTo(nextHeading,
                    { '--wght': WGHT_STRETCH, xPercent: -30 * direction },
                    { '--wght': WGHT_REST, xPercent: 0 }, 0)

                // Overlay panel travels further and squashes — it is the layer
                // that sells the speed, since the slide beneath never moves.
                .fromTo(overlayImgs[index],
                    { xPercent: 125 * direction, scaleX: 1.5, scaleY: 1.3 },
                    { xPercent: 0, scaleX: 1, scaleY: 1 }, 0)
                .fromTo(overlayImgs[currentIndex],
                    { xPercent: 0, scaleX: 1, scaleY: 1 },
                    { xPercent: -125 * direction, scaleX: 1.5, scaleY: 1.3 }, 0)

                .fromTo(slideImgs[index], { scale: 2 }, { scale: 1 }, 0)
                .timeScale(0.8);

            currentIndex = index;
        };

        const next = () => { if (!animating) gotoSection(currentIndex + 1, 1); };
        const prev = () => { if (!animating) gotoSection(currentIndex - 1, -1); };

        const observer = Observer.create({
            target: rootRef.current,
            type: 'wheel,touch,pointer',
            preventDefault: true,
            // Inverted so a downward wheel/flick advances, matching the way the
            // rest of the site reads: forward is down.
            wheelSpeed: -1,
            lockAxis: true, // a diagonal drag resolves to one axis, not both
            tolerance: 10,
            onUp: next,
            onDown: prev,
            onLeft: next,
            onRight: prev,
        });

        const onKey = (e) => {
            if (e.code === 'ArrowUp' || e.code === 'ArrowLeft') prev();
            if (e.code === 'ArrowDown' || e.code === 'ArrowRight' || e.code === 'Space' || e.code === 'Enter') next();
        };
        window.addEventListener('keydown', onKey);

        return () => {
            observer.kill();
            window.removeEventListener('keydown', onKey);
        };
    }, { scope: rootRef });

    return (
        // -mt-8 cancels RootLayout's pt-8: the page has to measure exactly one
        // viewport, or ScrollSmoother finds a sliver of scroll and the takeover
        // stops being a takeover. svh, not dvh, for the same reason on mobile.
        <section
            ref={rootRef}
            className="relative -mt-8 h-[100svh] w-full overflow-hidden select-none touch-none bg-[#1c1917] text-amber-50 cursor-grab active:cursor-grabbing"
        >
            {PHOTOS.map((photo, i) => (
                <div key={photo.title} className="g-slide absolute inset-0 invisible">
                    <div className="g-outer h-full w-full overflow-hidden will-change-transform">
                        <div className="g-inner h-full w-full overflow-hidden will-change-transform">
                            {/* isolate keeps the heading's difference blend inside
                                this slide, so it inverts against the ground and
                                the photo and nothing else. */}
                            <div
                                className="absolute inset-0 isolate flex items-center justify-center pb-[10vh]"
                                style={{ backgroundColor: TONES[i % TONES.length] }}
                            >
                                <div className="grid h-[80vh] w-full max-w-[1400px] grid-cols-10 grid-rows-[repeat(10,minmax(0,1fr))] px-4 md:px-12">
                                    <h2
                                        className="g-heading pointer-events-none z-10 self-end whitespace-nowrap font-lexend leading-[0.78] tracking-tighter [grid-area:2/2/3/10] md:[grid-area:1/1/4/10]"
                                        style={{
                                            '--wght': String(WGHT_REST),
                                            fontVariationSettings: '"wght" var(--wght)',
                                            fontSize: headingSize(photo.label),
                                            color: '#f2ede3',
                                            mixBlendMode: 'difference',
                                        }}
                                    >
                                        {photo.label}
                                    </h2>

                                    <figure className="m-0 overflow-hidden [grid-area:2/1/7/8] mt-16 md:mt-0 md:[grid-area:3/2/8/7]">
                                        <img
                                            className="g-slide-img h-full w-full object-cover"
                                            src={attached.has(i) ? photo.img : undefined}
                                            alt={photo.title}
                                            draggable="false"
                                            decoding="async"
                                            style={{ objectPosition: '50% 35%' }}
                                        />
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Second image layer. Same photograph as the slide beneath it, but
                a taller frame means object-fit crops it somewhere else — a wide
                view and a tight one, cross-sliding past each other. */}
            <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center pb-[10vh]">
                <div className="grid h-[80vh] w-full max-w-[1400px] grid-cols-10 grid-rows-[repeat(10,minmax(0,1fr))] px-4 md:px-12">
                    <div className="flex flex-col justify-end [grid-area:3/10/4/10] md:[grid-area:3/10/4/11]">
                        <p className="text-right font-lexend leading-none tabular-nums text-[clamp(2rem,4vw,4.5rem)]">
                            <span ref={countRef}>01</span>
                            <span className="ml-1 align-top text-[0.36em] opacity-50">/{N}</span>
                        </p>
                        <div className="mt-3 h-[5px] w-full bg-amber-50/25">
                            <div ref={progressRef} className="h-full w-full origin-left bg-amber-50" />
                        </div>
                    </div>

                    <figure className="relative m-0 overflow-hidden [grid-area:4/3/9/11] md:[grid-area:5/4/10/11]">
                        {PHOTOS.map((photo, i) => (
                            <img
                                key={photo.title}
                                className="g-overlay-img invisible absolute inset-0 h-full w-full object-cover will-change-transform"
                                src={attached.has(i) ? photo.img : undefined}
                                alt=""
                                aria-hidden="true"
                                draggable="false"
                                decoding="async"
                                style={{ objectPosition: '50% 68%' }}
                            />
                        ))}
                    </figure>
                </div>
            </div>

            {/* Page chrome, above both image layers. */}
            <div className="pointer-events-none absolute inset-0 z-[4] px-6 py-8 md:px-12 md:py-10">
                <p className="font-lexend text-[11px] uppercase tracking-[0.35em] text-amber-50/50">
                    <span className="text-amber-400">/</span>random-photos
                </p>
                <p className="mt-2 font-lexend text-[10px] uppercase tracking-[0.3em] text-amber-50/30">
                    scroll · drag · ← →
                </p>

                <div ref={captionRef} className="absolute bottom-8 left-6 max-w-[18rem] md:bottom-10 md:left-12 md:max-w-sm">
                    <h1 ref={titleRef} className="font-lexend text-xl font-semibold tracking-tighter md:text-2xl">
                        {PHOTOS[0].title}
                    </h1>
                    <p ref={descRef} className="mt-1 font-lexend text-xs leading-relaxed text-amber-50/60 md:text-sm">
                        {PHOTOS[0].desc}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
