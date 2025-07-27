import { useState } from 'react';
import { Button } from '../components/ui/button';
import NexGenLogo from '../components/ui/NexGenLogo';
import { Link } from 'react-router-dom';

const TalkToSales = () => {
    const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Integrate with backend or email service
        setSubmitted(true);
    };

    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 px-4 py-12">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="flex justify-center mb-4">
                    <Link to="/">
                        <NexGenLogo size="md" variant="full" className="cursor-pointer" />
                    </Link>
                </div>
                <h1 className="text-3xl font-bold text-purple-700 mb-2 text-center">Talk to Sales</h1>
                <p className="text-gray-600 mb-6 text-center">Fill out the form and our team will reach out to you soon.</p>
                {submitted ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-green-600 mb-2">Thank you!</h2>
                        <p className="text-gray-700">Your message has been received. Our sales team will contact you shortly.</p>
                    </div>
                ) : (
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                placeholder="you@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Company</label>
                            <input
                                type="text"
                                name="company"
                                value={form.company}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                placeholder="Your company (optional)"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>
                        <Button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all">Send Message</Button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default TalkToSales;
