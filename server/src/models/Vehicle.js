import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Vehicle = sequelize.define('Vehicle', {
  vehicleName: {
    type: DataTypes.STRING(200),
    field: 'vehicle_name',
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(500)
  },
  seatingCapacity: {
    type: DataTypes.INTEGER,
    field: 'seating_capacity',
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  features: {
    type: DataTypes.JSON
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    field: 'sort_order',
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  }
}, {
  tableName: 'vehicles',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

export default Vehicle;
