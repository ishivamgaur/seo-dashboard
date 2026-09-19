import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AboutSection = sequelize.define(
  'AboutSection',
  {
    sectionTitle: {
      type: DataTypes.STRING(255),
      field: 'section_title',
      allowNull: false,
    },
    eyebrow: {
      type: DataTypes.STRING(100),
      field: 'eyebrow',
    },
    subtitle: {
      type: DataTypes.STRING(500),
      field: 'subtitle',
    },
    description: {
      type: DataTypes.TEXT,
    },
    highlights: {
      type: DataTypes.JSON,
      field: 'highlights',
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      field: 'years_experience',
    },
    citiesCovered: {
      type: DataTypes.INTEGER,
      field: 'cities_covered',
    },
    fleetSize: {
      type: DataTypes.INTEGER,
      field: 'fleet_size',
    },
    tripsCompleted: {
      type: DataTypes.INTEGER,
      field: 'trips_completed',
    },
    badgeText: {
      type: DataTypes.STRING(100),
      field: 'badge_text',
    },
    ctaText: {
      type: DataTypes.STRING(100),
      field: 'cta_text',
    },
    ctaUrl: {
      type: DataTypes.STRING(500),
      field: 'cta_url',
    },
    featuredImage: {
      type: DataTypes.STRING(500),
      field: 'featured_image',
    },
  },
  {
    tableName: 'about_sections',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: false,
  }
);

export default AboutSection;
