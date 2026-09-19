import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContactInfo = sequelize.define(
  'ContactInfo',
  {
    phone: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(150),
    },
    address: {
      type: DataTypes.TEXT,
    },
    mapEmbed: {
      type: DataTypes.TEXT,
      field: 'map_embed',
    },
  },
  {
    tableName: 'contact_infos',
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: false,
  }
);

export default ContactInfo;
