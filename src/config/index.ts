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
    port: process.env.NODE_ENV === "production" ? process.env.PORT : 3001,
    baseUrl: process.env.APP_BASE_URL || "http://localhost:3000",
  },
  database: {
    // url: process.env.DATABASE_UR || "mongodb://localhost:27017/uniHousing",
  },
  email: {
    from: process.env.EMAIL_FROM || "noreply@uniHousing.com",

    smtp: {
      host: process.env.SMTP_HOST || "uniHousing@gmail.com",
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER,
      password: process.env.SMTP_PASSWORD,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
};
