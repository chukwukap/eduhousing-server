import express from "express";
import { authController } from "../controllers/auth.controller";

const router = express.Router();

// User registration
router.post("/register", authController.registerUser);

// User login
router.post("/login", authController.loginUser);

// User logout
router.post("/logout", authController.logoutUser);

// Request password reset
router.post("/password/reset", authController.requestPasswordReset);

// Reset password
router.post("/password/reset/:token", authController.resetPassword);

// Verify email
router.get("/verify/:token", authController.verifyEmail);

export default router;
