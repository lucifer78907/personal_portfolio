import { useRef, useState, useLayoutEffect } from 'react';
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

    // Cylinder Rotation Logic
    const cylinderRef = useRef(null);
    const rotationRef = useRef(0);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const lastX = useRef(0);
    const [radius, setRadius] = useState(1000);
    const dragStartTime = useRef(0);

    useLayoutEffect(() => {
        if (selectedImage !== null && cylinderRef.current) {
            const count = galleryData.length;
            // Calculate radius to prevent overlap: (Width + Gap) / (2 * tan(PI / Count))
            // Assuming width roughly 400px (md) or 300px (sm) + gap
            const cardWidth = window.innerWidth < 768 ? 300 : 400;
            const gap = 40;
            const calculatedRadius = Math.round(((cardWidth + gap) * count) / (2 * Math.PI));
            setRadius(calculatedRadius);

            const angle = 360 / count;
            const initialRotation = -selectedImage * angle;
            rotationRef.current = initialRotation;

            // Optimize: Set initial state immediately to avoid layout thrashing
            gsap.set(cylinderRef.current, {
                z: -calculatedRadius,
                rotationY: initialRotation,
                opacity: 0,
                scale: 0.8 // Start slightly smaller
            });

            // Smoother entrance animation
            gsap.to(cylinderRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power3.out",
                onStart: () => {
                    updateActiveItems(initialRotation, count, angle);
                }
            });

            // Keyboard Navigation
            const handleKeyDown = (e) => {
                if (e.key === 'ArrowLeft') {
                    rotateCylinder('left');
                } else if (e.key === 'ArrowRight') {
                    rotateCylinder('right');
                } else if (e.key === 'Escape') {
                    setSelectedImage(null);
                }
            };

            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedImage]);

    const rotateCylinder = (direction) => {
        const count = galleryData.length;
        const angle = 360 / count;
        const currentRot = rotationRef.current;

        // Calculate nearest snap point
        const snappedRot = Math.round(currentRot / angle) * angle;

        // Determine target rotation
        const targetRot = direction === 'left' ? snappedRot + angle : snappedRot - angle;

        animateRotation(targetRot);
    };

    const animateRotation = (targetRot) => {
        const count = galleryData.length;
        const angle = 360 / count;

        gsap.to(cylinderRef.current, {
            rotationY: targetRot,
            duration: 0.6,
            ease: "power2.out",
            onUpdate: function () {
                const currentRot = gsap.getProperty(this.targets()[0], "rotationY");
                this.targets()[0].style.transform = `translateZ(${-radius}px) rotateY(${currentRot}deg)`;
                updateActiveItems(currentRot, count, angle);
                rotationRef.current = currentRot;
            }
        });
    };

    const updateActiveItems = (rotation, count, angle) => {
        // Normalize rotation
        let normalizedRot = rotation % 360;
        if (normalizedRot > 0) normalizedRot -= 360;


        const exactIndex = -normalizedRot / angle;

        const items = document.querySelectorAll('.cylinder-item');
        items.forEach((item, i) => {
            let dist = Math.abs(i - exactIndex);
            if (dist > count / 2) dist = count - dist;

            // Simplify: Only adjust opacity and pointer-events
            // Removed scale and transform updates to prevent layout instability
            if (dist < 5) {
                const opacity = 1 - (dist / 5);
                item.style.opacity = Math.max(0.1, opacity); // Keep slightly visible for context
                item.style.filter = `blur(${dist * 3}px) brightness(${1 - dist * 0.1})`;
                item.style.pointerEvents = dist < 0.5 ? 'auto' : 'none';
            } else {
                item.style.opacity = 0;
                item.style.pointerEvents = 'none';
            }
        });
    };

    const handleDragStart = (e) => {
        isDragging.current = true;
        startX.current = e.clientX || e.touches[0].clientX;
        lastX.current = startX.current;
        dragStartTime.current = Date.now();
        if (cylinderRef.current) {
            gsap.killTweensOf(cylinderRef.current);
        }
    };

    const handleDragMove = (e) => {
        if (!isDragging.current) return;
        const clientX = e.clientX || e.touches[0].clientX;
        const diff = clientX - lastX.current;

        const degChange = (diff / radius) * (180 / Math.PI) * 1.5;
        rotationRef.current += degChange;

        if (cylinderRef.current) {
            cylinderRef.current.style.transform = `translateZ(${-radius}px) rotateY(${rotationRef.current}deg)`;
        }

        const count = galleryData.length;
        const angle = 360 / count;
        updateActiveItems(rotationRef.current, count, angle);

        lastX.current = clientX;
    };

    const handleDragEnd = (e) => {
        if (!isDragging.current) return;
        isDragging.current = false;

        const count = galleryData.length;
        const angle = 360 / count;
        const snappedRotation = Math.round(rotationRef.current / angle) * angle;

        animateRotation(snappedRotation);
    };

    // Capture click on items to prevent it if it was a drag
    const handleItemClick = (e, index) => {
        // If we are in 3D mode, clicking an item might mean "center this item"
        // But for now, let's just ensure drag doesn't trigger this if we add click handlers later
        e.stopPropagation();
        // Logic to center clicked item if it's not centered?
        // For now, just do nothing or maybe log
    };

    // Register GSAP plugins
    gsap.registerPlugin(Flip, ScrollTrigger);

    const handleImageClick = (index) => {
        setSelectedImage(index);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    useGSAP(() => {
        // Heading animation
        const splitHeading = new SplitText('.gallery-heading', { type: 'words' });
        gsap.from(splitHeading.words, {
            opacity: 0,
            y: 50,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.gallery-heading',
                start: 'top 90%',
                end: 'top 60%',
                scrub: 1,
            }
        });

        // Masonry/Scatter Layout Animation
        // We'll use column-count in CSS for masonry, but animate items individually
        const items = gsap.utils.toArray('.gallery-image-wrapper');

        items.forEach((item, i) => {
            gsap.from(item, {
                y: 100,
                opacity: 0,
                scale: 0.8,
                rotation: Math.random() * 10 - 5, // Random rotation for scatter effect
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 90%",
                    end: "top 70%",
                    scrub: 1,
                }
            });
        });

    }, { scope: containerRef });

    return (
        <section ref={containerRef} className='p-4 py-20 relative min-h-screen'>
            <header className="mb-20 px-4 md:px-10">
                <h2 className='gallery-heading font-display text-6xl md:text-8xl font-bold tracking-tighter text-text-main'>
                    Visual<br />Playground
                </h2>
                <p className='gallery-subheading mt-4 text-right text-text-muted text-xl font-light max-w-md ml-auto'>
                    A collection of moments captured in time.
                </p>
            </header>

            <main className='columns-1 sm:columns-2 lg:columns-3 gap-8 px-4 md:px-10 space-y-8'>
                {galleryData.map((item, index) => (
                    <div
                        key={index}
                        className='gallery-image-wrapper break-inside-avoid relative overflow-hidden rounded-2xl cursor-pointer group mb-8'
                        onClick={() => setSelectedImage(index)}
                    >
                        <img
                            data-index={index}
                            src={item.img}
                            loading='lazy'
                            alt={item.title}
                            className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6'>
                            <p className='text-white font-display font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300'>{item.title}</p>
                        </div>
                    </div>
                ))}
            </main>

            {/* 3D Cylinder Modal */}
            {selectedImage !== null && (
                <div className='fullscreen-overlay fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center overflow-hidden perspective-1000'>
                    <button
                        onClick={() => setSelectedImage(null)}
                        className='close-button absolute top-8 right-8 bg-white/10 text-white p-4 rounded-full hover:bg-white/20 transition-colors z-50 backdrop-blur-md'
                    >
                        <IoClose size={24} />
                    </button>

                    <div
                        className='cylinder-container relative w-full h-full flex items-center justify-center preserve-3d cursor-grab active:cursor-grabbing'
                        onMouseDown={handleDragStart}
                        onMouseMove={handleDragMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchStart={handleDragStart}
                        onTouchMove={handleDragMove}
                        onTouchEnd={handleDragEnd}
                    >
                        <div
                            ref={cylinderRef}
                            className='cylinder relative w-[300px] md:w-[400px] h-[200px] md:h-[300px] preserve-3d will-change-transform'
                        >
                            {galleryData.map((item, index) => {
                                const count = galleryData.length;
                                const angle = 360 / count;
                                const rotation = angle * index;

                                return (
                                    <div
                                        key={index}
                                        className='cylinder-item absolute top-0 left-0 w-full h-full backface-hidden transition-opacity'
                                        // We set initial transform here, but updateActiveItems will override it
                                        // It's important for the initial render before JS kicks in
                                        style={{
                                            transform: `rotateY(${rotation}deg) translateZ(${radius}px)`,
                                        }}
                                        onClick={(e) => handleItemClick(e, index)}
                                    >
                                        <img
                                            src={item.img}
                                            alt={item.title}
                                            className='w-full h-full object-cover rounded-lg shadow-2xl border border-white/10'
                                            draggable="false"
                                        />
                                        <div className="absolute -bottom-24 left-0 w-full text-center transition-opacity duration-300 item-info pointer-events-none">
                                            <h3 className="text-white font-display text-3xl font-bold tracking-tight">{item.title}</h3>
                                            <p className="text-white/60 text-sm mt-2 font-light">{item.desc}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="absolute bottom-10 text-center pointer-events-none">
                        <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Drag or use arrow keys</p>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Gallery;