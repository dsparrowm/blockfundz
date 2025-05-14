import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin, Phone, Clock, Send } from 'lucide-react';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string || "http://localhost:3001";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/api/contact`, formData);
      if (response.status === 200) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      content: "support@nexgencrypto.live",
      description: "24/7 customer support"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      content: "Coming Soon",
      description: "Instant response time"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      content: "+1 (256) 291-2075",
      description: "Mon-Fri 9AM-6PM EST"
    }
  ];

  return (
    <div className="max-container mx-auto mt-40 mb-40">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">
          Get in Touch
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Our dedicated team is here to assist you 24/7. Choose your preferred method of communication.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {contactMethods.map((method, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                {method.icon}
              </div>
              <div >
                <h3 className="text-xl font-semibold bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">{method.title}</h3>
                <p className="text-blue-500">{method.content}</p>
              </div>
            </div>
            <p className="text-gray-400">{method.description}</p>
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
          <h3 className="text-2xl font-bold mb-6 text-white-400">Send Us a Message</h3>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-white-400">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white-400">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white-400">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-white-400">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-black"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>

        {/* Office Information */}
        <div className="space-y-8">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <h3 className="text-2xl font-bold mb-6 text-white-400">Our Office</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-white">Location</h4>
                  <p className="text-gray-400">1443 Clinton St, Buffalo</p>
                  <p className="text-gray-400">New York, NY 14206</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1 text-white-400">Business Hours</h4>
                  <p className="text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                  <p className="text-gray-400">Saturday - Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Hours */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <h3 className="text-2xl font-bold mb-4 text-white-400">24/7 Support</h3>
            <p className="text-gray-400">
              While our office maintains regular business hours, our technical support and customer service teams are available 24/7 to assist with any urgent matters related to your investments.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isSubmitted && (
        <div className="fixed bottom-4 right-4">
          <div className="bg-green-500 text-white border-none p-4 rounded-lg">
            Message sent successfully! We'll get back to you soon.
          </div>
        </div>
      )}
    </div>
  )
};

export default ContactUs;