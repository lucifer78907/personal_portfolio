import { useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import Toast from "../components/Toast";

const Contact = () => {
    const containerRef = useRef();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [showToast, setShowToast] = useState(false);
    const [focusedField, setFocusedField] = useState(null);

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = formData;

        if (!name || !email || !message) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);

            // Shake animation on error
            gsap.to('.submit-button', {
                x: [-10, 10, -10, 10, 0],
                duration: 0.4,
                ease: "power2.inOut"
            });
            return;
        }

        const mailtoLink = `mailto:thesinghrudra@gmail.com?subject=Contact from ${encodeURIComponent(
            name
        )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

        window.location.href = mailtoLink;
    };

    useGSAP(() => {
        // Heading animation - word by word reveal
        const splitHeading = SplitText.create('.contact-heading', {
            type: 'words,chars',
        });

        gsap.from(splitHeading.chars, {
            yPercent: 100,
            opacity: 0,
            stagger: 0.03,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.contact-heading',
                start: 'top 75%',
                end: 'top 45%',
                scrub: 1,
                toggleActions: 'play none none reverse',
            }
        });

        // Subheading slide
        gsap.from('.contact-subheading', {
            opacity: 0,
            x: 30,
            scrollTrigger: {
                trigger: '.contact-subheading',
                start: 'top 75%',
                end: 'top 55%',
                scrub: 1.2,
                toggleActions: 'play none none reverse',
            }
        });

        // Form container
        gsap.from('.contact-form', {
            opacity: 0,
            y: 40,
            scrollTrigger: {
                trigger: '.contact-form',
                start: 'top 70%',
                end: 'top 45%',
                scrub: 1.5,
                toggleActions: 'play none none reverse',
            }
        });

        ScrollTrigger.refresh();
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="p-6 py-24 min-h-screen flex flex-col justify-center relative overflow-hidden">
            <Toast show={showToast} message={'Please fill in all the details'} />

            {/* Decorative background elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 right-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-3xl mx-auto w-full">
                <header className="mb-16">
                    <h2 className='contact-heading font-lexend text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-amber-950 overflow-hidden'>
                        Let's talk
                    </h2>
                    <p className='contact-subheading tracking-tight mt-3 md:text-xl font-lexend text-right font-medium text-amber-700/70'>
                        I'd love to hear from you
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="contact-form space-y-8">
                    {/* Name Field */}
                    <div className="form-field relative">
                        <label
                            className={`font-lexend text-sm md:text-base font-semibold block mb-3 transition-colors duration-300 ${
                                focusedField === 'name' ? 'text-amber-800' : 'text-amber-900/70'
                            }`}
                            htmlFor="name"
                        >
                            What's your name?
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Sung Jin Woo"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-0 py-4 text-xl md:text-2xl font-lexend text-amber-950 placeholder:text-amber-900/20 bg-transparent border-b-2 border-amber-900/20 focus:border-amber-800 outline-none transition-all duration-500 ease-out"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="form-field relative">
                        <label
                            className={`font-lexend text-sm md:text-base font-semibold block mb-3 transition-colors duration-300 ${
                                focusedField === 'email' ? 'text-amber-800' : 'text-amber-900/70'
                            }`}
                            htmlFor="email"
                        >
                            Your email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="hello@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-0 py-4 text-xl md:text-2xl font-lexend text-amber-950 placeholder:text-amber-900/20 bg-transparent border-b-2 border-amber-900/20 focus:border-amber-800 outline-none transition-all duration-500 ease-out"
                        />
                    </div>

                    {/* Message Field */}
                    <div className="form-field relative">
                        <label
                            className={`font-lexend text-sm md:text-base font-semibold block mb-3 transition-colors duration-300 ${
                                focusedField === 'message' ? 'text-amber-800' : 'text-amber-900/70'
                            }`}
                            htmlFor="message"
                        >
                            Tell me about your project
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="I have an idea..."
                            rows={4}
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('message')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-0 py-4 text-xl md:text-2xl font-lexend text-amber-950 placeholder:text-amber-900/20 bg-transparent border-b-2 border-amber-900/20 focus:border-amber-800 outline-none transition-all duration-500 ease-out resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-8">
                        <button
                            type="submit"
                            className="submit-button group relative w-full sm:w-auto px-12 py-5 bg-amber-950 text-amber-50 font-lexend font-bold text-lg md:text-xl rounded-full overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-900/30 active:scale-[0.98]"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                Send message
                                <svg
                                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-900 to-amber-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                        </button>
                    </div>

                    {/* Optional: Social links or contact info */}
                    <div className="pt-12 border-t border-amber-900/10">
                        <p className="text-center text-sm md:text-base text-amber-900/50 font-lexend">
                            Or reach out directly at{' '}
                            <a href="mailto:thesinghrudra@gmail.com" className="text-amber-800 font-semibold hover:underline">
                                thesinghrudra@gmail.com
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Contact;
