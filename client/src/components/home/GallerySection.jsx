import Image from 'next/image';

const galleryImages = [
  { id: 1, src: '/images/gallery1.jpg', altTag: 'Luxury interior view', className: 'md:col-span-2 md:row-span-2 h-96' },
  { id: 2, src: '/images/gallery2.jpg', altTag: 'Chauffeur opening door', className: 'h-48' },
  { id: 3, src: '/images/gallery3.jpg', altTag: 'Fleet parked outside venue', className: 'h-48' },
  { id: 4, src: '/images/gallery4.jpg', altTag: 'Night city drive', className: 'h-48 md:col-span-2' },
];

const GallerySection = ({ data }) => {\n  const gallery = data || [];
  return (
    <section className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 uppercase tracking-wider">Gallery</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Take a glimpse into the luxurious experience we provide.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-min">
          {galleryImages.map((img) => (
            <div key={img.id} className={`relative overflow-hidden rounded-xl group ${img.className}`}>
              <Image
                src={img.src}
                alt={img.altTag}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                sizes="(max-w-768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
