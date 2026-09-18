import { Star } from 'lucide-react';



const TestimonialsSection = ({ data }) => {\n  const testimonials = data || [];
  return (
    <section className="py-24 bg-gray-50 text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 uppercase tracking-wider">Client Reviews</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">What our distinguished clients have to say about our service.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 relative">
              <div className="flex space-x-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FFAD00] fill-[#FFAD00]" />
                ))}
              </div>
              <p className="text-gray-700 mb-8 italic text-lg leading-relaxed">"{review.text}"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-[#FFAD00] font-bold text-xl mr-4">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-black">{review.name}</h4>
                  <span className="text-sm text-gray-500">Verified Client</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
