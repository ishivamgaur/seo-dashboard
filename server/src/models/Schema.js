import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Schema = sequelize.define('Schema', {
  schemaType: {
    type: DataTypes.ENUM('organization', 'faq', 'breadcrumb', 'website', 'local_business'),
    field: 'schema_type',
    allowNull: false
  },
  schemaData: {
    type: DataTypes.JSON,
    field: 'schema_data',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    field: 'is_active',
    defaultValue: true
  }
}, {
  tableName: 'schemas',
  freezeTableName: true,
  underscored: true,
  timestamps: true
});

export default Schema;
