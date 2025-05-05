import imagePoloroid from '../../assets/poloroid_1.png'
import imagePoloroid2 from '../../assets/poloroid_2.png'
import imagePoloroid3 from '../../assets/poloroid_3.png'
import imagePoloroid4 from '../../assets/poloroid_4.png'
import imagePoloroid5 from '../../assets/poloroid_5.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';
import { MdOutlineSwipe } from 'react-icons/md'

const Poloroids = () => {
    return (
        <aside className='-mt-4 sm:max-w-sm md:max-w-md xl:w-full sm:mx-auto relative'>
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
            <p className='hidden xl:flex xl:-mt-20 xl:ml-20 xl:mb-10 items-center gap-2 text-4xl font-lexend -rotate-6 text-amber-800 '>
                <MdOutlineSwipe />
                Swipe swipe</p>
        </aside>
    );
};

export default Poloroids;