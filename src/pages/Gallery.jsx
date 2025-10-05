import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { SplitText } from 'gsap/all';
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
    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18, img19, img20, img21, img22, img23];

    useGSAP(() => {
        // Heading text reveal with fade and slide
        const splitHeading = SplitText.create('.gallery-heading', {
            type: 'words',
            wordsClass: 'gallery-word'
        });

        gsap.from(splitHeading.words, {
            opacity: 0,
            y: 40,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.gallery-heading',
                start: 'top 70%',
                end: 'top 35%',
                scrub: 1.2,
            }
        });

        // Subheading slide from right
        gsap.from('.gallery-subheading', {
            opacity: 0,
            x: 50,
            scrollTrigger: {
                trigger: '.gallery-subheading',
                start: 'top 70%',
                end: 'top 45%',
                scrub: 1,
            }
        });

        // Gallery images - masonry style reveal with different effects
        const galleryImages = gsap.utils.toArray('.gallery-image');

        galleryImages.forEach((img, index) => {
            // Alternate animation styles for visual variety
            const animations = [
                // Fade and scale up
                {
                    opacity: 0,
                    scale: 0.88,
                    y: 50,
                },
                // Slide from left
                {
                    opacity: 0,
                    x: -50,
                },
                // Slide from right
                {
                    opacity: 0,
                    x: 50,
                },
                // Fade and scale
                {
                    opacity: 0,
                    scale: 0.92,
                },
                // Slide up with scale
                {
                    opacity: 0,
                    y: 60,
                    scale: 0.9,
                },
            ];

            // Pick animation style based on index
            const animationStyle = animations[index % animations.length];

            gsap.from(img, {
                ...animationStyle,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: img,
                    start: 'top 85%',
                    end: 'top 45%',
                    scrub: 1.5,
                }
            });

            // Add hover effect
            img.addEventListener('mouseenter', () => {
                gsap.to(img, {
                    scale: 1.05,
                    zIndex: 10,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            img.addEventListener('mouseleave', () => {
                gsap.to(img, {
                    scale: 1,
                    zIndex: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='p-4'>
            <header>
                <h2 className='gallery-heading font-lexend text-4xl sm:text-5xl md:text-7xl font-semibold tracking-tighter text-amber-950'>Life through lens...</h2>
                <p className='gallery-subheading tracking-tighter mt-1 font-lexend text-right xl:text-xl xl:mt-4 font-medium text-sm text-amber-700/50'>its just a normal smartphone camera</p>
            </header>
            <main className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        loading='lazy'
                        decoding='async'
                        alt={`Gallery picture`}
                        className='gallery-image w-full h-full object-cover rounded-md cursor-pointer transition-shadow hover:shadow-lg'
                    />
                ))}
            </main>
        </section>
    );
}

export default Gallery