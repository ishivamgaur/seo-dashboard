import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const GalleryImage = sequelize.define('GalleryImage', {
  imagePath: {
    type: DataTypes.STRING(500),
    field: 'image_path',
    allowNull: false
  },
  altTag: {
    type: DataTypes.STRING(300),
    field: 'alt_tag'
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    field: 'sort_order',
    defaultValue: 0
  }
}, {
  tableName: 'gallery_images',
  freezeTableName: true,
  underscored: true,
  timestamps: true,
  updatedAt: false
});

export default GalleryImage;
