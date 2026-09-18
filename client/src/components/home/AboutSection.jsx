import React from 'react';
import Image from 'next/image';

const AboutSection = ({ data }) => {
  if (!data) return null;

  const { heading, content, featuredImage } = data;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-1/2">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 border-b-4 border-[#FFAD00] inline-block pb-2">
                {heading}
              </h2>
            )}
            
            {content && (
              <div className="text-gray-700 text-lg leading-relaxed space-y-4 whitespace-pre-line">
                {content}
              </div>
            )}
          </div>
          
          {featuredImage && (
            <div className="w-full lg:w-1/2 relative aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={featuredImage}
                alt="About Us"
                fill
                className="object-cover"
              />
            </div>
          )}
          
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
