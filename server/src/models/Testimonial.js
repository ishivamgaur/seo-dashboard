import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Testimonial = sequelize.define('Testimonial', {
  customerName: {
    type: DataTypes.STRING(150),
    field: 'customer_name',
    allowNull: false
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  },
  customerImage: {
    type: DataTypes.STRING(500),
    field: 'customer_image'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  }
}, {
  tableName: 'testimonials',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

export default Testimonial;
