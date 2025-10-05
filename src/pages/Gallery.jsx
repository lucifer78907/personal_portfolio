import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText, Flip, ScrollTrigger } from 'gsap/all';
import { IoClose } from 'react-icons/io5';
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

function Gallery() {
    const containerRef = useRef();
    const [selectedImage, setSelectedImage] = useState(null);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const galleryData = [
        { img: img1, title: "Golden Hour Vibes", desc: "Captured during sunset - nature's perfect lighting" },
        { img: img2, title: "Urban Explorer", desc: "City streets tell stories through shadows" },
        { img: img3, title: "Midnight Blues", desc: "When the city sleeps, lights come alive" },
        { img: img4, title: "Nature's Canvas", desc: "Raw beauty in its purest form" },
        { img: img5, title: "Street Poetry", desc: "Life unfolds in unexpected moments" },
        { img: img6, title: "Color Burst", desc: "Vibrant hues dancing in harmony" },
        { img: img7, title: "Silent Whispers", desc: "Quiet moments that speak volumes" },
        { img: img8, title: "Concrete Jungle", desc: "Architecture meets emotion" },
        { img: img9, title: "Light & Shadow", desc: "Playing with contrasts and depth" },
        { img: img10, title: "Hidden Gems", desc: "Beauty in the overlooked corners" },
        { img: img11, title: "Time Stands Still", desc: "Frozen moments of pure magic" },
        { img: img12, title: "Reflections", desc: "Mirror worlds and parallel realities" },
        { img: img13, title: "Motion Blur", desc: "Life in constant movement" },
        { img: img14, title: "Textures", desc: "Details that tell deeper stories" },
        { img: img15, title: "Minimalism", desc: "Less is more - simplicity speaks" },
        { img: img16, title: "Pattern Play", desc: "Repetition creates rhythm" },
        { img: img17, title: "Wanderlust", desc: "Journey captured in pixels" },
        { img: img18, title: "Mood Setter", desc: "Atmosphere over everything" },
        { img: img19, title: "Raw Emotion", desc: "Feelings translated visually" },
        { img: img20, title: "Perspective Shift", desc: "Seeing the world differently" },
        { img: img21, title: "Night Tales", desc: "Stories that unfold after dark" },
        { img: img22, title: "Spontaneous", desc: "Unplanned perfection" },
        { img: img23, title: "Final Frame", desc: "Every ending is a new beginning" },
    ];

    // Register GSAP plugins
    gsap.registerPlugin(Flip, ScrollTrigger);

    const handleImageClick = (index) => {
        const clickedImg = document.querySelector(`[data-index="${index}"]`);

        // Get the state before changes
        const state = Flip.getState(clickedImg);

        // Update state
        setSelectedImage(index);

        // Wait for DOM update then animate with Flip
        requestAnimationFrame(() => {
            const fullscreenImg = document.querySelector('.fullscreen-image');
            if (fullscreenImg) {
                Flip.from(state, {
                    duration: 0.8,
                    ease: "power3.inOut",
                    absolute: true,
                    onStart: () => {
                        gsap.set('.fullscreen-overlay', { display: 'flex' });
                    }
                });

                // Animate overlay and content
                gsap.from('.fullscreen-overlay', {
                    opacity: 0,
                    duration: 0.5,
                });

                gsap.from('.image-info', {
                    opacity: 0,
                    y: 30,
                    duration: 0.6,
                    delay: 0.4,
                    ease: "power2.out"
                });
            }
        });
    };

    const handleClose = () => {
        const fullscreenImg = document.querySelector('.fullscreen-image');
        const originalImg = document.querySelector(`[data-index="${selectedImage}"]`);

        if (fullscreenImg && originalImg) {
            const state = Flip.getState(fullscreenImg);

            // Fade out overlay content
            gsap.to(['.image-info', '.close-button'], {
                opacity: 0,
                duration: 0.2,
            });

            gsap.to('.fullscreen-overlay', {
                opacity: 0,
                duration: 0.3,
                delay: 0.2,
            });

            // Flip back to original position
            setTimeout(() => {
                setSelectedImage(null);
                requestAnimationFrame(() => {
                    if (originalImg) {
                        Flip.from(state, {
                            duration: 0.7,
                            ease: "power3.inOut",
                            absolute: true,
                            onComplete: () => {
                                gsap.set('.fullscreen-overlay', { display: 'none' });
                            }
                        });
                    }
                });
            }, 300);
        }
    };

    const navigate = (direction) => {
        const newIndex = direction === 'next'
            ? (selectedImage + 1) % galleryData.length
            : (selectedImage - 1 + galleryData.length) % galleryData.length;

        const slideDirection = direction === 'next' ? -100 : 100;

        gsap.to('.fullscreen-image', {
            x: -slideDirection,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                setSelectedImage(newIndex);
                gsap.fromTo('.fullscreen-image',
                    { x: slideDirection, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
                );
                gsap.fromTo('.image-info',
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.4, delay: 0.1 }
                );
            }
        });

        gsap.to('.image-info', {
            opacity: 0,
            y: -20,
            duration: 0.2
        });
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const swipeThreshold = 50;
        const diff = touchStartX.current - touchEndX.current;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swiped left - next image
                navigate('next');
            } else {
                // Swiped right - previous image
                navigate('prev');
            }
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    useGSAP(() => {
        // Heading animation
        const splitHeading = SplitText.create('.gallery-heading', {
            type: 'words',
        });

        gsap.from(splitHeading.words, {
            opacity: 0,
            y: 50,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.gallery-heading',
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Subheading
        gsap.from('.gallery-subheading', {
            opacity: 0,
            x: 50,
            scrollTrigger: {
                trigger: '.gallery-subheading',
                start: 'top 80%',
                end: 'top 55%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Stagger grid images with modern entrance
        const galleryImages = gsap.utils.toArray('.gallery-image');

        gsap.from(galleryImages, {
            opacity: 0,
            scale: 0.8,
            y: 60,
            stagger: {
                each: 0.05,
                from: "start",
                grid: "auto"
            },
            ease: "back.out(1.4)",
            scrollTrigger: {
                trigger: '.gallery-grid',
                start: 'top 75%',
                end: 'top 25%',
                scrub: 1.5,
                toggleActions: 'play none none reverse',
            }
        });

        ScrollTrigger.refresh();
    }, { scope: containerRef, dependencies: [selectedImage] });

    return (
        <section ref={containerRef} className='p-4 py-20 relative'>
            <header>
                <h2 className='gallery-heading font-lexend text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tighter text-amber-950'>
                    Life through lens...
                </h2>
                <p className='gallery-subheading tracking-tighter mt-1 font-lexend text-right xl:text-xl xl:mt-4 font-medium text-sm text-amber-700/50'>
                    its just a normal smartphone camera
                </p>
            </header>

            <main className='gallery-grid mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {galleryData.map((item, index) => (
                    <div
                        key={index}
                        className='gallery-image-wrapper relative overflow-hidden rounded-lg cursor-pointer group'
                        onClick={() => handleImageClick(index)}
                    >
                        <img
                            data-index={index}
                            src={item.img}
                            loading='lazy'
                            decoding='async'
                            alt={item.title}
                            className='gallery-image w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4'>
                            <p className='text-amber-50 font-lexend font-semibold text-lg'>{item.title}</p>
                        </div>
                    </div>
                ))}
            </main>

            {/* Fullscreen Modal */}
            {selectedImage !== null && (
                <div
                    className='fullscreen-overlay fixed inset-0 bg-black/95 z-[200] hidden flex-col items-center justify-center p-4'
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className='close-button absolute top-4 right-4 md:top-8 md:right-8 bg-amber-800 hover:bg-amber-700 text-amber-50 p-3 rounded-full transition-colors z-10'
                        aria-label='Close'
                    >
                        <IoClose size={28} />
                    </button>

                    {/* Image Container */}
                    <div className='flex flex-col items-center justify-center max-w-6xl w-full'>
                        <img
                            src={galleryData[selectedImage].img}
                            alt={galleryData[selectedImage].title}
                            className='fullscreen-image max-h-[70vh] max-w-full object-contain rounded-lg'
                        />

                        {/* Image Info */}
                        <div className='image-info mt-6 text-center max-w-2xl'>
                            <h3 className='font-lexend text-3xl md:text-4xl font-bold text-amber-200 mb-3'>
                                {galleryData[selectedImage].title}
                            </h3>
                            <p className='font-lexend text-lg md:text-xl text-amber-100/80'>
                                {galleryData[selectedImage].desc}
                            </p>
                            <p className='font-lexend text-sm text-amber-400 mt-4'>
                                {selectedImage + 1} / {galleryData.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Gallery;