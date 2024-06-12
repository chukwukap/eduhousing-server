import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../../.env") });

/**
 * Application configuration object.
 */
export const config = {
  env: process.env.NODE_ENV || "development",
  app: {
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    baseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  },
  database: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://postgres:postgres@localhost:5432/UNNHousing",
  },
  email: {
    from: process.env.EMAIL_FROM || "noreply@unihousing.com",

    smtp: {
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};