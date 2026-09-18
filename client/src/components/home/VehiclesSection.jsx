import Image from 'next/image';



const VehiclesSection = ({ data }) => {\n  const vehicles = data || [];
  return (
    <section className="py-24 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 uppercase tracking-wider">Our Fleet</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Choose from our premium selection of vehicles for your next journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="group flex flex-col border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={vehicle.image}
                  alt={vehicle.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-bold">{vehicle.name}</h3>
                  <span className="text-sm font-semibold text-[#FFAD00] bg-black px-3 py-1 rounded-full">{vehicle.capacity}</span>
                </div>
                <p className="text-gray-600 mb-6 flex-grow">{vehicle.description}</p>
                <button className="w-full py-3 px-6 border-2 border-black text-black font-semibold rounded-lg hover:bg-black hover:text-white transition-colors duration-300">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehiclesSection;
