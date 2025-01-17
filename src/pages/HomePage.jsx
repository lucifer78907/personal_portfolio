import React from 'react';
import imagePoloroid from '../assets/poloroid_1.png'
import imagePoloroid2 from '../assets/poloroid_2.png'
import imagePoloroid3 from '../assets/poloroid_3.png'
import imagePoloroid4 from '../assets/poloroid_4.png'
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

// import required modules
import { EffectCards } from 'swiper/modules';

const HomePage = () => {
    return (
        <section className='p-4 flex flex-col gap-4'>
            <h1 className='font-lexend text-5xl tracking-tighter font-semibold text-yellow-950'>Hi there! <br /> I'm Rudra.</h1>
            <aside>
                <Swiper
                    effect={'cards'}
                    grabCursor={true}
                    modules={[EffectCards]}
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
                </Swiper>
            </aside>
        </section>
    );
};

export default HomePage;