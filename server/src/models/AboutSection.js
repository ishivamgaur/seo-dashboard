import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AboutSection = sequelize.define('AboutSection', {
  sectionTitle: {
    type: DataTypes.STRING(255),
    field: 'section_title',
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  featuredImage: {
    type: DataTypes.STRING(500),
    field: 'featured_image'
  }
}, {
  tableName: 'about_sections',
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  createdAt: false
});

export default AboutSection;
