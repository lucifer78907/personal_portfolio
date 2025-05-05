import { useState } from "react";
import Toast from "../components/Toast";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [showToast, setShowToast] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = formData;
        console.log(formData);

        if (!name || !email || !message) {
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
            return;
        }

        // Construct the mailto URL
        const mailtoLink = `mailto:thesinghrudra@gmail.com?subject=Contact from ${encodeURIComponent(
            name
        )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

        // Redirect to the mail client
        window.location.href = mailtoLink;
    };

    return (
        <section className="p-6 xl:w-1/2 xl:mx-auto">
            <Toast show={showToast} message={'Please fill in all the details'} />
            <header>
                <h2 className='font-lexend text-6xl md:text-7xl font-semibold tracking-tighter text-amber-950'>Let's talk</h2>
                <p className='tracking-tighter mt-1 md:text-base font-lexend text-right font-medium text-sm text-amber-700/50'>P.s - i love talking!</p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-4 mt-8 md:gap-8">
                <fieldset>
                    <label className="font-lexend md:text-xl" htmlFor="name">Enter your name</label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        placeholder="Ex - Sung Jin Woo ...."
                        onChange={handleChange}
                        className="md:mt-2 xl:text-xl px-2 py-2 w-full mt-1 rounded-xl text-amber-900 placeholder:text-amber-800/30 shadow-md"
                    />
                </fieldset>

                <fieldset>
                    <label className="font-lexend md:text-xl" htmlFor="phone_number">Enter your email</label>
                    <input
                        id="email"
                        type="text"
                        name="email"
                        placeholder="Ex - abcde@gmail.com"
                        onChange={handleChange}
                        className="md:mt-2 xl:text-xl px-2 py-2 w-full mt-1 rounded-xl text-amber-900 placeholder:text-amber-800/30 shadow-md"
                    />
                </fieldset>

                <fieldset>
                    <label className="font-lexend md:text-xl" htmlFor="message">Enter your message</label>
                    <textarea
                        id="message"
                        type="text"
                        name="message"
                        placeholder="Ex - I wanted to discuss about this awesome idea i have , can you make an app for it? (we will earn billions i promise)"
                        rows={6}
                        onChange={handleChange}
                        className="md:mt-2 xl:text-xl px-2 py-2 w-full mt-1 rounded-xl text-amber-900 placeholder:text-amber-800/30 shadow-md"
                    />
                </fieldset>

                <button
                    type="submit"
                    className="border-2 py-2 xl:text-2xl rounded-full border-amber-900 text-amber-700">
                    Send my message
                </button>
            </form>
        </section>
    );
};

export default Contact;
