import { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    // Handle input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        const { name, email, message } = formData;

        if (!name || !email || !message) {
            alert("Please fill in all fields before sending.");
            return;
        }

        // Construct the mailto URL
        const mailtoLink = `mailto:youremail@example.com?subject=Contact from ${encodeURIComponent(
            name
        )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

        // Redirect to the mail client
        window.location.href = mailtoLink;
    };

    return (
        <section className="p-6">
            <header>
                <h2 className='font-lexend text-6xl font-semibold tracking-tighter text-amber-950'>Let's talk</h2>
                <p className='tracking-tighter mt-1 font-lexend text-right font-medium text-sm text-amber-700/50'>P.s - i love talking!</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 mt-8">
                {/* Name Field */}
                <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:ring focus:ring-amber-800 outline-none bg-[#fffbeb] border-1 border-amber-600"
                />

                {/* Email Field */}
                <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:ring focus:ring-blue-400 outline-none"
                />

                {/* Message Field */}
                <textarea
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md focus:ring focus:ring-blue-400 outline-none h-24"
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition"
                >
                    Send Message
                </button>
            </form>
        </section>
    );
};

export default Contact;
