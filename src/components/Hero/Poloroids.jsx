import imagePoloroid from '../../assets/poloroid_1.png'
import imagePoloroid2 from '../../assets/poloroid_2.png'
import imagePoloroid3 from '../../assets/poloroid_3.png'
import imagePoloroid4 from '../../assets/poloroid_4.png'
import imagePoloroid5 from '../../assets/poloroid_5.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from 'swiper/modules';
import { MdOutlineSwipe } from 'react-icons/md'
import { ScrollTrigger } from 'gsap/all'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { useIntro } from '../../context/introContext'

const slides = [imagePoloroid, imagePoloroid2, imagePoloroid3, imagePoloroid4, imagePoloroid5];

const Poloroids = () => {
    const containerRef = useRef(null);
    const introTl = useRef(null);
    const { introComplete } = useIntro();

    useGSAP(() => {
        // Targets the ref, not '.container' — that selector was unscoped and
        // `container` is also a Tailwind utility class name.
        introTl.current = gsap.timeline({ paused: true })
            .from(containerRef.current, {
                xPercent: 100,
                opacity: 0,
                duration: 1.5,
                ease: 'expo.out',
            }, 0.8); // holds until the heading has finished, then slides in
    }, { scope: containerRef });

    useEffect(() => {
        if (introComplete) introTl.current?.play();
    }, [introComplete]);

    return (
        <aside ref={containerRef} className='container -mt-4 max-w-sm h-full md:max-w-md xl:w-full sm:mx-auto relative'>
            <Swiper
                effect={'cards'}
                onInit={(swiper) => {
                    ScrollTrigger.refresh();
                    swiper.autoplay.stop();
                    setTimeout(() => swiper.autoplay.start(), 7000)
                }}
                onSlideChange={(swiper) => {
                    // stop autoplay once we've looped back to the start
                    if (swiper.realIndex === 0 && swiper.autoplay.running) {
                        swiper.autoplay.stop();
                    }
                }}
                grabCursor={true}
                modules={[EffectCards, Autoplay]}
                autoplay={{
                    delay: 2000,
                    disableOnInteraction: true,
                }}
                cardsEffect={{ slideShadows: false }}
                className="mySwiper"
            >
                {slides.map((src, i) => (
                    <SwiperSlide key={i}>
                        <img src={src} alt='Rudra Pratap Singh' />
                    </SwiperSlide>
                ))}
            </Swiper>
            <p className='hidden xl:flex xl:-mt-20 xl:ml-20 xl:mb-10 items-center gap-2 text-4xl font-lexend -rotate-6 text-amber-800 '>
                <MdOutlineSwipe />
                Swipe swipe</p>
        </aside>
    );
};

export default Poloroids;
