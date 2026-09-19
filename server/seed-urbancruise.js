import { v2 as cloudinary } from 'cloudinary';
import { config } from './src/config/environment.js';
import { sequelize } from './src/config/database.js';
import HeroSection from './src/models/HeroSection.js';
import AboutSection from './src/models/AboutSection.js';
import Vehicle from './src/models/Vehicle.js';
import Occasion from './src/models/Occasion.js';
import Testimonial from './src/models/Testimonial.js';
import GalleryImage from './src/models/GalleryImage.js';
import ContactInfo from './src/models/ContactInfo.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

async function uploadToCloudinaryOrFallback(url, folder) {
  try {
    console.log(`Uploading ${url} to Cloudinary...`);
    const res = await cloudinary.uploader.upload(url, {
      folder: `seo-dashboard/${folder}`,
      resource_type: 'image',
    });
    console.log(`Success: ${res.secure_url}`);
    return res.secure_url;
  } catch (err) {
    console.warn(`Cloudinary upload failed for ${url}, using direct URL:`, err.message);
    return url;
  }
}

async function runSeed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // 1. Hero
    console.log('Seeding Hero...');
    const heroImg = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/UC-FIRST-PAGE-BANNER-India-11.webp',
      'hero'
    );
    await HeroSection.upsert({
      id: 1,
      heading: 'Premier Fleet & Chauffeur Services',
      subHeading:
        'Experience luxury transportation and executive chauffeur services across 15+ Indian cities.',
      bannerImage: heroImg,
      ctaText: 'Book Your Ride',
      ctaUrl: '#contact',
    });

    // 2. About
    console.log('Seeding About...');
    const aboutImg = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Luxury-Car-On-Rent-For-Wedding.webp',
      'general'
    );
    await AboutSection.upsert({
      id: 1,
      sectionTitle: 'About Urban Cruise',
      description:
        'Urban Cruise is India’s premier vehicle rental and luxury chauffeur service. We specialize in providing impeccably maintained Tempo Travellers, Force Urbania vans, luxury sedans, and Volvo coaches with verified, courteous chauffeurs for corporate events, destination weddings, and memorable outstation journeys.',
      featuredImage: aboutImg,
    });

    // 3. Vehicles (exact 6 from FEATURES.md)
    console.log('Seeding Vehicles...');
    await Vehicle.destroy({ where: {} });

    const v1 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp',
      'vehicles'
    );
    const v2 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Tempo-Travel-On-Rent-For-Vacation-Travel.webp',
      'vehicles'
    );
    const v3 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/tempo-travelller-26-seater-2x2-1.webp',
      'vehicles'
    );
    const v4 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/25-Seater-Mini-Bus-1.webp',
      'vehicles'
    );
    const v5 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/FORCE-URBANIA.webp',
      'vehicles'
    );
    const v6 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/45_Seater__Volvo_Bus1.webp',
      'vehicles'
    );

    await Vehicle.bulkCreate([
      {
        vehicleName: '9 Seater Tempo Traveller',
        seatingCapacity: 9,
        description:
          'Ultra-luxurious 1x1 Maharaja seating with pushback recliners, individual AC vents, and ambient LED mood lighting. Ideal for VIP tours.',
        image: v1,
        features: [
          '1x1 Maharaja Seats',
          'Individual AC Vents',
          'LED TV & Audio',
          'USB Mobile Charging',
          'Ample Luggage Space',
        ],
        sortOrder: 1,
        isActive: true,
      },
      {
        vehicleName: '12 Seater Tempo Traveller',
        seatingCapacity: 12,
        description:
          'Spacious 2x1 seating with plush headrests, ample legroom, and high ceiling. Perfect for corporate delegations and family getaways.',
        image: v2,
        features: [
          'Reclining Pushback Seats',
          'Chilled AC',
          'Stereo Music System',
          'First Aid Box',
          'Luggage Carrier',
        ],
        sortOrder: 2,
        isActive: true,
      },
      {
        vehicleName: '16 Seater Tempo Traveller',
        seatingCapacity: 16,
        description:
          'Ideal group transport with comfortable 2x2 configuration, smooth suspension, and extensive luggage space for long road trips.',
        image: v3,
        features: [
          '2x2 Pushback Seats',
          'Powerful Dual AC',
          'Smooth Air Suspension',
          'GPS Enabled',
          'Professional Driver',
        ],
        sortOrder: 3,
        isActive: true,
      },
      {
        vehicleName: '20 Seater Mini Bus',
        seatingCapacity: 20,
        description:
          'Executive mini-coach designed for wedding guest transfers, corporate airport runs, and regional sightseeing in supreme comfort.',
        image: v4,
        features: [
          'Luxury Coach Seats',
          'Panoramic Tinted Windows',
          'PA & Mic System',
          'Emergency Exits',
          'Generous Boot Storage',
        ],
        sortOrder: 4,
        isActive: true,
      },
      {
        vehicleName: 'Force Urbania Luxury Van',
        seatingCapacity: 12,
        description:
          'State-of-the-art European design with walk-in standing height, whisper-quiet cabin, and world-class safety features. The modern standard of luxury travel.',
        image: v5,
        features: [
          'European Design & Safety',
          'Individual Armrests',
          'High Ceiling Walk-in',
          'Touchscreen Infotainment',
          'Triple Zone Climate Control',
        ],
        sortOrder: 5,
        isActive: true,
      },
      {
        vehicleName: 'Luxury Volvo Coach',
        seatingCapacity: 45,
        description:
          'Flagship interstate coach featuring ergonomic semi-sleeper seats, advanced air suspension, and optional onboard washroom for long-haul journeys.',
        image: v6,
        features: [
          'Semi-Sleeper Recliners',
          'Air Suspension Ride',
          'Onboard Washroom',
          'Reading Lights',
          'Large Luggage Compartments',
        ],
        sortOrder: 6,
        isActive: true,
      },
    ]);

    // 4. Occasions (exact 5 from FEATURES.md)
    console.log('Seeding Occasions...');
    await Occasion.destroy({ where: {} });

    const o1 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Luxury-Bus-rental-For-Wedding.webp',
      'occasions'
    );
    const o2 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Urbania-On-Rent-For-Corporate-Travel.webp',
      'occasions'
    );
    const o3 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Tempo-Travel-On-Rent-For-Vacation-Travel.webp',
      'occasions'
    );
    const o4 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Maruti-Swift-Dzire-on-Rent-for-Corporate-Travel.webp',
      'occasions'
    );
    const o5 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Sleeper-Bus-On-Rent-For-Pilgrimage-Trips.webp',
      'occasions'
    );

    await Occasion.bulkCreate([
      {
        title: 'Wedding Transportation',
        description:
          'Arrive in grandeur. We provide decorated luxury car convoys, premium tempo travellers, and buses for barat and guests ensuring punctual and royal transport.',
        image: o1,
        sortOrder: 1,
        isActive: true,
      },
      {
        title: 'Corporate Events & Conferences',
        description:
          'Professional mobility for executives, VIP delegates, and team offsites. Uniformed chauffeurs, punctual dispatches, and spotless luxury vehicles.',
        image: o2,
        sortOrder: 2,
        isActive: true,
      },
      {
        title: 'Family Tours & Vacations',
        description:
          'Customized itineraries and long-distance road trips across North and South India. Safe, comfortable, and memorable travel for the entire family.',
        image: o3,
        sortOrder: 3,
        isActive: true,
      },
      {
        title: 'Airport Transfers',
        description:
          'Round-the-clock airport pick-up and drop-off with flight tracking. Never miss a flight with our zero-delay guaranteed executive service.',
        image: o4,
        sortOrder: 4,
        isActive: true,
      },
      {
        title: 'Outstation & Pilgrimage Trips',
        description:
          'Dedicated long-distance journeys to sacred shrines and popular hill stations including Char Dham, Vaishno Devi, Shimla, Manali, and Agra.',
        image: o5,
        sortOrder: 5,
        isActive: true,
      },
    ]);

    // 5. Gallery (6 real images)
    console.log('Seeding Gallery...');
    await GalleryImage.destroy({ where: {} });

    const g1 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Luxury-Bus-rental-For-Wedding.webp',
      'gallery'
    );
    const g2 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/Urbania-On-Rent-For-Corporate-Travel.webp',
      'gallery'
    );
    const g3 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/45_Seater__Volvo_Bus1.webp',
      'gallery'
    );
    const g4 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp',
      'gallery'
    );
    const g5 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/23-Seater-Tata-Bus-With-Washroom.webp',
      'gallery'
    );
    const g6 = await uploadToCloudinaryOrFallback(
      'https://urbancruise.in/wp-content/uploads/FORCE-URBANIA.webp',
      'gallery'
    );

    await GalleryImage.bulkCreate([
      { imagePath: g1, altTag: 'Luxury Wedding Bus Rental', sortOrder: 1 },
      { imagePath: g2, altTag: 'Force Urbania Corporate Travel', sortOrder: 2 },
      { imagePath: g3, altTag: 'Volvo Luxury Intercity Coach', sortOrder: 3 },
      { imagePath: g4, altTag: 'Maharaja Tempo Traveller 9 Seater Luxury', sortOrder: 4 },
      { imagePath: g5, altTag: 'Executive Bus With Washroom', sortOrder: 5 },
      { imagePath: g6, altTag: 'Force Urbania Luxury Van Interior', sortOrder: 6 },
    ]);

    // 6. Testimonials
    console.log('Seeding Testimonials...');
    await Testimonial.destroy({ where: {} });
    await Testimonial.bulkCreate([
      {
        customerName: 'Rajesh Sharma',
        review:
          'Booked the 16-seater Tempo Traveller for a 4-day family trip to Jaipur and Udaipur. The vehicle was immaculately clean, and the driver Mr. Vikram was courteous, safe, and punctual. Superb experience!',
        rating: 5,
        isActive: true,
      },
      {
        customerName: 'Priya Malhotra',
        review:
          'We hired Urban Cruise for our destination wedding logistics in Gurugram. From luxury cars for the bride and groom to Volvo buses for our guests, everything was seamless and stress-free.',
        rating: 5,
        isActive: true,
      },
      {
        customerName: 'Amitabh Sen',
        review:
          'Urban Cruise has been our go-to corporate fleet partner for 2 years. Their Force Urbania vans are world-class and perfect for our international clients and board meetings.',
        rating: 5,
        isActive: true,
      },
    ]);

    // 7. Contact
    console.log('Seeding Contact Info...');
    await ContactInfo.upsert({
      id: 1,
      phone: '+91 98765 43210',
      email: 'bookings@urbancruise.in',
      address: 'Plot No. 42, Sector 18, Commercial Hub, Gurugram, Haryana 122008, India',
      mapEmbed:
        '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.404285856428!2d77.06742665!3d28.4614132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19d582e38859%3A0x2cf5fe8e5e648834!2sSector%2018%2C%20Gurugram%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
    });

    console.log('ALL URBAN CRUISE DATA SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

runSeed();
