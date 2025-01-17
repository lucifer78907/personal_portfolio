import imagePoloroid from '../../assets/poloroid_1.png'
import imagePoloroid2 from '../../assets/poloroid_2.png'
import imagePoloroid3 from '../../assets/poloroid_3.png'
import imagePoloroid4 from '../../assets/poloroid_4.png'
import imagePoloroid5 from '../../assets/poloroid_5.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

const Poloroids = () => {
    return (
        <aside className='-mt-4'>
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
                <SwiperSlide>
                    <img src={imagePoloroid5} alt='Rudra Pratap Singh' />
                </SwiperSlide>
            </Swiper>
        </aside>
    );
};

export default Poloroids;