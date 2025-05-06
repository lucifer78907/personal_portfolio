import imagePoloroid from '../../assets/poloroid_1.png'
import imagePoloroid2 from '../../assets/poloroid_2.png'
import imagePoloroid3 from '../../assets/poloroid_3.png'
import imagePoloroid4 from '../../assets/poloroid_4.png'
import imagePoloroid5 from '../../assets/poloroid_5.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { Autoplay } from 'swiper/modules'
import { MdOutlineSwipe } from 'react-icons/md'
import { ScrollTrigger } from 'gsap/all'

const Poloroids = () => {
    return (
        <aside className='-mt-4 max-w-sm h-full md:max-w-md xl:w-full sm:mx-auto relative'>
            <Swiper
                effect={'cards'}
                onInit={() => {
                    ScrollTrigger.refresh(); console.log("RENDERED")
                }}
                onSlideChange={(swiper) => {
                    if (swiper.realIndex === 0 && swiper.autoplay.running) {
                        swiper.autoplay.stop(); // ✅ stop autoplay once we looped back to the start
                        console.log('Autoplay stopped after one full loop');
                    }
                }}
                grabCursor={true}
                modules={[EffectCards, Autoplay]}
                autoplay={{
                    delay: 2500, // Change slide every 2 seconds
                    disableOnInteraction: true, // Continue autoplay even after user interaction
                }}
                cardsEffect={
                    {
                        slideShadows: false,
                    }
                }
                className="mySwiper"
            >
                <SwiperSlide>
                    <img src={imagePoloroid} alt='Rudra Pratap Singh' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imagePoloroid2} alt='Rudra Pratap Singh' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imagePoloroid3} alt='Rudra Pratap Singh' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imagePoloroid4} alt='Rudra Pratap Singh' />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imagePoloroid5} alt='Rudra Pratap Singh' />
                </SwiperSlide>
            </Swiper>
            <p className='hidden xl:flex xl:-mt-20 xl:ml-20 xl:mb-10 items-center gap-2 text-4xl font-lexend -rotate-6 text-amber-800 '>
                <MdOutlineSwipe />
                Swipe swipe</p>
        </aside>
    );
};

export default Poloroids;