import { Play } from 'lucide-react';
import { david, Emily, happywoman } from '../assets/images';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Investor",
    image: happywoman,
    text: "I’ve been using this site for over a year, and I’m impressed with the consistent returns and seamless withdrawal process. Their advanced security measures give me peace of mind, knowing my funds are safe. I highly recommend it to anyone looking to invest in crypto."
  },
  {
    id: 2,
    name: "David Patel",
    role: "Software Engineer",
    image: david,
    text: "This platform changed the way I view crypto investments. The educational resources they offer helped me understand the market, and the real-time insights gave me the confidence to make informed decisions. It's reliable, secure, and has a great community."
  },
  {
    id: 3,
    name: "Emily Carter",
    role: "Entrepreneur",
    image: Emily,
    text: "I was initially skeptical about investing in cryptocurrency, but this platform made it so easy and transparent. The tools provided are incredibly user-friendly, and their customer support team is always available to assist. Thanks to them, my portfolio has grown by over 40% in just six months!"
  }
];

const TestimonialSection = () => {
  return (
      <div className="max-container mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-[50px] font-medium text-white mb-4 bg-gradient-to-r from-orange-500 to-blue-500 text-gradient">
            What people say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover what our satisfied customers have to say 
            about their experiences with our services.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="relative group"
            >
              {/* Glass Card */}
              <div className="bg-white/5 backdrop-blur-lg rounded-3xl p-8 h-full
                            border border-white/10 hover:border-white/20 
                            transition-all duration-300 ease-in-out">
                {/* Profile Image */}
                <div className="mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-medium text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-400">
                    {testimonial.role}
                  </p>
                  <p className="text-gray-300 leading-relaxed italic">
                    {testimonial.text}
                  </p>
                </div>

                {/* Play Button (only for middle card) */}
                {/* {index === 1 && (
                  <div className="absolute bottom-8 right-8">
                    <button className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center
                                     hover:bg-white/20 transition-colors duration-300 group">
                      <Play className="w-5 h-5 text-white fill-white" />
                    </button>
                  </div>
                )} */}
              </div>
            </div>
          ))}
        </div>
      </div>
  );
};

export default TestimonialSection;