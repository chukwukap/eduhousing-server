import express from "express";
import { authController } from "../controllers/auth.controller";

const authRoutes = express.Router();

// User registration
authRoutes.post("/register", authController.registerUser);

// User login
authRoutes.post("/login", authController.loginUser);

// User logout
authRoutes.post("/logout", authController.logoutUser);

// Request password reset
authRoutes.post("/password/reset", authController.requestPasswordReset);

// Reset password
authRoutes.post("/password/reset/:token", authController.resetPassword);

// Verify email
authRoutes.get("/verify/:token", authController.verifyEmail);

export { authRoutes };
