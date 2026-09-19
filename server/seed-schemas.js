import { sequelize } from './src/config/database.js';
import Schema from './src/models/Schema.js';

async function seedSchemas() {
  await sequelize.authenticate();
  console.log('Connected to DB...');
  await Schema.destroy({ where: {} });

  await Schema.bulkCreate([
    {
      schemaType: 'organization',
      schemaData: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Urban Cruise',
        url: 'https://urbancruise.in/',
        logo: 'https://urbancruise.in/wp-content/uploads/gurugramlogo.webp',
        sameAs: [
          'https://www.facebook.com/UrbanCruiseIndia',
          'https://www.instagram.com/urbancruiseindia/',
        ],
      },
      isActive: true,
    },
    {
      schemaType: 'website',
      schemaData: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Urban Cruise',
        url: 'https://urbancruise.in/',
        description:
          'Urban Cruise provides vehicle rental services across India including tempo travellers, luxury buses, and executive chauffeur vehicles.',
      },
      isActive: true,
    },
    {
      schemaType: 'local_business',
      schemaData: {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'Urban Cruise Vehicle Rentals',
        image: 'https://urbancruise.in/wp-content/uploads/UC-FIRST-PAGE-BANNER-India-11.webp',
        telephone: '+919876543210',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Plot No. 42, Sector 18',
          addressLocality: 'Gurugram',
          addressRegion: 'Haryana',
          postalCode: '122008',
          addressCountry: 'IN',
        },
      },
      isActive: true,
    },
    {
      schemaType: 'faq',
      schemaData: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What types of tempo travellers and buses are available?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Urban Cruise offers 9-seater Maharaja tempo travellers, 12, 16, and 20-seater mini buses, Force Urbania luxury vans, and 45-55 seater Volvo coaches.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I hire vehicles for outstation trips and weddings?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes, we specialize in destination weddings, corporate summits, and outstation trips across 15+ Indian cities with verified chauffeurs.',
            },
          },
        ],
      },
      isActive: true,
    },
    {
      schemaType: 'breadcrumb',
      schemaData: {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://urbancruise.in/',
          },
        ],
      },
      isActive: true,
    },
  ]);

  console.log('5 SCHEMAS SEEDED SUCCESSFULLY!');
  process.exit(0);
}

seedSchemas();
