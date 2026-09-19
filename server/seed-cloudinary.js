import { v2 as cloudinary } from 'cloudinary';
import { config } from './src/config/environment.js';
import { sequelize } from './src/config/database.js';
import HeroSection from './src/models/HeroSection.js';
import AboutSection from './src/models/AboutSection.js';
import Vehicle from './src/models/Vehicle.js';
import Occasion from './src/models/Occasion.js';
import Testimonial from './src/models/Testimonial.js';
import GalleryImage from './src/models/GalleryImage.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

async function uploadImage(url, folder) {
  try {
    const result = await cloudinary.uploader.upload(url, { folder: `seo-dashboard/${folder}` });
    return result.secure_url;
  } catch (err) {
    console.error(`Failed to upload ${url}:`, err.message);
    return url; // fallback to original URL
  }
}

async function seed() {
  await sequelize.authenticate();
  console.log('Connected to DB for seeding...');

  // 1. Hero
  const heroImg = await uploadImage(
    'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1920&q=80',
    'hero'
  );
  await HeroSection.upsert({
    id: 1,
    heading: 'Experience Ultimate Luxury Travel',
    subHeading: 'Premium fleet and chauffeur services for your every need across the city.',
    bannerImage: heroImg,
    ctaText: 'Book Now',
    ctaUrl: '#contact',
  });

  // 2. About
  const aboutImg = await uploadImage(
    'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    'general'
  );
  await AboutSection.upsert({
    id: 1,
    sectionTitle: 'About Urban Cruise',
    description:
      'We are the premier luxury transportation provider. With our meticulously maintained fleet of high-end vehicles and professional chauffeurs, we guarantee an unforgettable and stress-free journey.',
    featuredImage: aboutImg,
  });

  // 3. Vehicles
  await Vehicle.destroy({ where: {} });
  const v1 = await uploadImage(
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    'vehicles'
  );
  const v2 = await uploadImage(
    'https://images.unsplash.com/photo-1626668893632-6f3a4466d22f?auto=format&fit=crop&w=800&q=80',
    'vehicles'
  );
  const v3 = await uploadImage(
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    'vehicles'
  );

  await Vehicle.bulkCreate([
    {
      vehicleName: 'Luxury Sedan',
      seatingCapacity: 4,
      description: 'Perfect for executive travel and airport transfers.',
      image: v1,
      features: ['Leather Seats', 'Wifi', 'AC'],
    },
    {
      vehicleName: 'Force Urbania',
      seatingCapacity: 12,
      description: 'Spacious and luxurious for group travel.',
      image: v2,
      features: ['Reclining Seats', 'LED TV', 'Premium Audio'],
    },
    {
      vehicleName: 'Premium SUV',
      seatingCapacity: 6,
      description: 'Arrive in style with maximum comfort.',
      image: v3,
      features: ['Panoramic Sunroof', 'Extra Legroom'],
    },
  ]);

  // 4. Occasions
  await Occasion.destroy({ where: {} });
  const o1 = await uploadImage(
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    'occasions'
  );
  const o2 = await uploadImage(
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    'occasions'
  );
  await Occasion.bulkCreate([
    {
      title: 'Wedding Transportation',
      description: 'Make your special day perfect with our elegant fleet.',
      image: o1,
    },
    {
      title: 'Corporate Events',
      description: 'Professional transport for your team and VIP clients.',
      image: o2,
    },
  ]);

  // 5. Testimonials
  await Testimonial.destroy({ where: {} });
  await Testimonial.bulkCreate([
    {
      customerName: 'Sarah Johnson',
      review: 'Absolutely impeccable service! The driver was early and the car was pristine.',
      rating: 5,
    },
    {
      customerName: 'Michael Chen',
      review: 'Used them for our corporate event. Highly professional.',
      rating: 5,
    },
    {
      customerName: 'Emily Davis',
      review: 'Made our wedding day perfectly stress-free.',
      rating: 5,
    },
  ]);

  // 6. Gallery
  await GalleryImage.destroy({ where: {} });
  const g1 = await uploadImage(
    'https://images.unsplash.com/photo-1502877338535-34cb0a055c62?auto=format&fit=crop&w=800&q=80',
    'gallery'
  );
  const g2 = await uploadImage(
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80',
    'gallery'
  );
  const g3 = await uploadImage(
    'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80',
    'gallery'
  );
  await GalleryImage.bulkCreate([
    { imagePath: g1, altTag: 'Luxury interior' },
    { imagePath: g2, altTag: 'Chauffeur driving' },
    { imagePath: g3, altTag: 'Fleet parked' },
  ]);

  console.log('Successfully seeded database and uploaded to Cloudinary!');
  process.exit(0);
}

seed();
