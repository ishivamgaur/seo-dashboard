import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = ({ data }) => {
  if (!data) return null;

  const { heading, subHeading, ctaButtonText, ctaUrl, bannerImage } = data;

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {bannerImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bannerImage}
            alt="Hero Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}
      
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {heading && (
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {heading}
          </h1>
        )}
        
        {subHeading && (
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {subHeading}
          </p>
        )}
        
        {ctaButtonText && ctaUrl && (
          <Link 
            href={ctaUrl}
            className="inline-block bg-[#FFAD00] hover:bg-[#e69c00] text-black font-semibold py-4 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            {ctaButtonText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
