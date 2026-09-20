import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const HeroSection = sequelize.define(
  "HeroSection",
  {
    heading: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subHeading: {
      type: DataTypes.STRING(500),
      field: "sub_heading",
    },
    bannerImage: {
      type: DataTypes.STRING(500),
      field: "banner_image",
    },
    ctaText: {
      type: DataTypes.STRING(100),
      field: "cta_text",
    },
    ctaUrl: {
      type: DataTypes.STRING(500),
      field: "cta_url",
    },
  },
  {
    tableName: "hero_sections",
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: false,
  }
);

export default HeroSection;
