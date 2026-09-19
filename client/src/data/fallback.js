// Static backup content — rendered when the backend is unreachable,
// so the public site never shows an empty page. Shapes mirror the API.

const unsplash = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

export const FALLBACK_HOME = {
  hero: {
    heading: 'Commercial fleet and chauffeur rentals in India',
    subHeading:
      'Tempo travellers, Force Urbania vans, and luxury coaches for corporate events, weddings, and outstation trips.',
    bannerImage:
      'https://res.cloudinary.com/dfurqcxo8/image/upload/v1742469972/urban-cruise/hero/luxury_hero_studio.jpg',
    ctaText: 'Reserve a vehicle',
    ctaUrl: '#contact',
  },
  about: {
    sectionTitle: 'About Urban Cruise',
    eyebrow: 'Who we are',
    badgeText: 'Since 2015',
    subtitle:
      'Pan-India chauffeur-driven fleet for weddings, corporate travel and outstation trips.',
    description:
      "Urban Cruise is India's premier luxury vehicle rental and ground mobility provider, offering impeccably maintained Tempo Travellers, Force Urbania vans, luxury sedans and Volvo coaches with verified, courteous chauffeurs for corporate events, destination weddings and memorable outstation journeys.",
    highlights: [
      'Verified chauffeurs with commercial licences',
      'All-India tourist permits on every vehicle',
      '24/7 live dispatch and trip support',
    ],
    yearsExperience: 10,
    citiesCovered: 15,
    fleetSize: 40,
    tripsCompleted: 25000,
    ctaText: 'Explore our fleet',
    ctaUrl: '#vehicles',
    featuredImage: unsplash('photo-1570125909232-eb263c188f7e'),
  },
  vehicles: [
    {
      id: 'fallback-tt9',
      vehicleName: '9 Seater Tempo Traveller',
      image: 'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp',
      seatingCapacity: 9,
      description: 'Compact luxury traveller for family tours and airport transfers.',
      features: ['Pushback seats', 'Air conditioning', 'Music system'],
    },
    {
      id: 'fallback-tt12',
      vehicleName: '12 Seater Tempo Traveller',
      image: 'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp',
      seatingCapacity: 12,
      description: 'Ideal corporate shuttle for team outings and events.',
      features: ['Reclining seats', 'Charging points', 'GPS tracked'],
    },
    {
      id: 'fallback-tt16',
      vehicleName: '16 Seater Tempo Traveller',
      image: 'https://urbancruise.in/wp-content/uploads/tempo-traveller-9-seater-1x1-1.webp',
      seatingCapacity: 16,
      description: 'Spacious group travel for weddings and outstation trips.',
      features: ['Ample legroom', 'Luggage space', 'Experienced driver'],
    },
    {
      id: 'fallback-urbania',
      vehicleName: 'Force Urbania',
      image: unsplash('photo-1570125909232-eb263c188f7e'),
      seatingCapacity: 12,
      description: 'Premium luxury van with first-class cabin comfort.',
      features: ['Captain seats', 'Ambient lighting', 'Silent cabin'],
    },
    {
      id: 'fallback-bus20',
      vehicleName: '20 Seater Mini Bus',
      image: unsplash('photo-1544620347-c4fd4a3d5957'),
      seatingCapacity: 20,
      description: 'Mini coach for large wedding parties and staff movement.',
      features: ['High roof', 'PA system', 'All-India permit'],
    },
    {
      id: 'fallback-volvo',
      vehicleName: 'Luxury Volvo Coach',
      image: unsplash('photo-1544620347-c4fd4a3d5957'),
      seatingCapacity: 45,
      description: 'Flagship long-distance coach for grand occasions.',
      features: ['Sleeper options', 'Onboard restroom', 'Tour guide'],
    },
  ],
  occasions: [
    {
      id: 'fallback-wedding',
      title: 'Wedding Transportation',
      description: 'Decor-ready convoys for baraat, guest shuttles and send-offs.',
      image: 'https://urbancruise.in/wp-content/uploads/Luxury-Bus-rental-For-Wedding.webp',
    },
    {
      id: 'fallback-corporate',
      title: 'Corporate Events',
      description: 'Punctual staff shuttles and executive roadshows.',
      image: unsplash('photo-1449965408869-eaa3f722e40d'),
    },
    {
      id: 'fallback-family',
      title: 'Family Tours',
      description: 'Comfortable holiday travel with trusted chauffeurs.',
      image: unsplash('photo-1533473359331-0135ef1b58bf'),
    },
    {
      id: 'fallback-airport',
      title: 'Airport Transfers',
      description: 'On-time pickups with flight tracking and meet-and-greet.',
      image: unsplash('photo-1502877338535-766e1452684a'),
    },
    {
      id: 'fallback-outstation',
      title: 'Outstation Trips',
      description: 'All-India permits for Jaipur, Agra, Shimla and beyond.',
      image: unsplash('photo-1533473359331-0135ef1b58bf'),
    },
  ],
  testimonials: [
    {
      id: 'fallback-t1',
      customerName: 'Rohit Sharma',
      review:
        'Spotless Urbania van and a courteous driver for our entire wedding week. Flawless coordination.',
      rating: 5,
      customerImage: '',
    },
    {
      id: 'fallback-t2',
      customerName: 'Priya Nair',
      review:
        'Booked a 16-seater for a corporate offsite. On time, clean, and very professional service.',
      rating: 5,
      customerImage: '',
    },
    {
      id: 'fallback-t3',
      customerName: 'Amit Verma',
      review:
        'Airport transfers for a 40-guest event handled without a single delay. Highly recommended.',
      rating: 4,
      customerImage: '',
    },
  ],
  gallery: [
    {
      id: 'fallback-g1',
      imagePath: unsplash('photo-1570125909232-eb263c188f7e'),
      altTag: 'Luxury van exterior',
    },
    {
      id: 'fallback-g2',
      imagePath: unsplash('photo-1544620347-c4fd4a3d5957'),
      altTag: 'Luxury coach on tour',
    },
    {
      id: 'fallback-g3',
      imagePath: unsplash('photo-1502877338535-766e1452684a'),
      altTag: 'Premium car at sunset',
    },
    {
      id: 'fallback-g4',
      imagePath: unsplash('photo-1449965408869-eaa3f722e40d'),
      altTag: 'Chauffeur on highway',
    },
    {
      id: 'fallback-g5',
      imagePath: unsplash('photo-1533473359331-0135ef1b58bf'),
      altTag: 'Outstation road trip',
    },
  ],
  contact: {
    phone: '+91 98765 43210',
    email: 'bookings@urbancruise.in',
    address: 'Plot No. 42, Sector 18, Gurugram, Haryana 122008, India',
    mapEmbed: '',
  },
};
