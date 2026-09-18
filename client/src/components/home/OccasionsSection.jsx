import Image from 'next/image';



const OccasionsSection = ({ data }) => {\n  const occasions = data || [];
  return (
    <section className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 uppercase tracking-wider">Services & Occasions</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Tailored transportation solutions for every important moment.</p>
        </div>
        <div className="space-y-16">
          {occasions.map((occasion, index) => (
            <div key={occasion.id} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
              <div className="relative w-full lg:w-1/2 h-80 lg:h-96 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(255,173,0,0.15)]">
                <Image
                  src={occasion.image}
                  alt={occasion.title}
                  fill
                  className="object-cover"
                  sizes="(max-w-1024px) 100vw, 50vw"
                />
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <h3 className="text-3xl font-bold text-[#FFAD00]">{occasion.title}</h3>
                <p className="text-lg text-gray-300 leading-relaxed">{occasion.description}</p>
                <button className="inline-block border-b-2 border-[#FFAD00] text-white hover:text-[#FFAD00] pb-1 transition-colors uppercase tracking-wide font-semibold">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OccasionsSection;
