import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Occasion = sequelize.define(
  "Occasion",
  {
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING(500),
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      field: "sort_order",
      defaultValue: 0,
    },
  },
  {
    tableName: "occasions",
    freezeTableName: true,
    underscored: true,
    timestamps: true,
  }
);

export default Occasion;
