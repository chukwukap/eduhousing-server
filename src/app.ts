import { Application, Request, Response } from "express-serve-static-core";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import rateLimit from "express-rate-limit";
// import { config as dotEnvConfig } from "dotenv";
// dotEnvConfig();

import {
  authRoutes,
  bookingRoutes,
  lodgeRoutes,
  reviewRoutes,
  userRoutes,
} from "./routes/";

import { config } from "./config/";
import { universityRoutes } from "./routes/university.routes";
import { corsOptions } from "./config/cors";

const app: Application = express();

// Middlewares
app.use(
  cors({
    // origin: ["https://d.com", "http://localhost:3000"],
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150, // Limit each IP to 100 requests per windowMs
});
app.use(rateLimiter);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/lodges", lodgeRoutes);
app.use("/api/v1/universities", universityRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/bookings", bookingRoutes);

app.use("/api/v1/", (_, res: Response) => {
  res.json({ message: "hello world" });
});

// Health check route
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "OK" });
});

const port = config.app.port;
// const port = 3001;

console.log(port);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
