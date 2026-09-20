import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve .env relative to server directory so execution works from any cwd
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config();

const REQUIRED_ENV_VARS = ["DB_NAME", "DB_USER", "JWT_SECRET"];

const missingVars = REQUIRED_ENV_VARS.filter((varName) => !process.env[varName]);
if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missingVars.join(", ")}. ` +
      "Please check your .env file."
  );
}

export const config = Object.freeze({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000", 10),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  db: Object.freeze({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    name: process.env.DB_NAME || "seo_dashboard",
    ssl: process.env.DB_SSL === "true",
  }),
  jwt: Object.freeze({
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  }),
  upload: Object.freeze({
    dir: process.env.UPLOAD_DIR || "uploads",
  }),
  cloudinary: Object.freeze({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  }),
});

export const env = config;
export default config;
