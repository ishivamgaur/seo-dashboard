import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const SeoSetting = sequelize.define(
  "SeoSetting",
  {
    pageIdentifier: {
      type: DataTypes.STRING(50),
      field: "page_identifier",
      defaultValue: "homepage",
      unique: true,
    },
    metaTitle: {
      type: DataTypes.STRING(255),
      field: "meta_title",
    },
    metaDescription: {
      type: DataTypes.TEXT,
      field: "meta_description",
    },
    focusKeywords: {
      type: DataTypes.STRING(500),
      field: "focus_keywords",
    },
    canonicalUrl: {
      type: DataTypes.STRING(500),
      field: "canonical_url",
    },
    robotsIndex: {
      type: DataTypes.BOOLEAN,
      field: "robots_index",
      defaultValue: true,
    },
    robotsFollow: {
      type: DataTypes.BOOLEAN,
      field: "robots_follow",
      defaultValue: true,
    },
    ogTitle: {
      type: DataTypes.STRING(255),
      field: "og_title",
    },
    ogDescription: {
      type: DataTypes.TEXT,
      field: "og_description",
    },
    ogImage: {
      type: DataTypes.STRING(500),
      field: "og_image",
    },
    twitterTitle: {
      type: DataTypes.STRING(255),
      field: "twitter_title",
    },
    twitterDescription: {
      type: DataTypes.TEXT,
      field: "twitter_description",
    },
    twitterImage: {
      type: DataTypes.STRING(500),
      field: "twitter_image",
    },
  },
  {
    tableName: "seo_settings",
    freezeTableName: true,
    underscored: true,
    timestamps: true,
    createdAt: false,
  }
);

export default SeoSetting;
