import express from "express";
import { userController } from "../controllers/user.controller";
import { authenticate, roleMiddleware } from "../middlewares";

const router = express.Router();

// Get the authenticated user's profile
router.get("/profile", authenticate, userController.getUserProfile);

// Update the authenticated user's profile
router.put("/profile", authenticate, userController.updateUserProfile);

// List all users (requires authentication and appropriate role)
router.get(
  "/",
  authenticate,
  roleMiddleware(["admin"]),
  userController.listUsers
);

// Get a specific user (requires authentication and appropriate role)
router.get(
  "/:userId",
  authenticate,
  roleMiddleware(["admin"]),
  userController.getUser
);

// Update a user (requires authentication and appropriate role)
router.put(
  "/:userId",
  authenticate,
  roleMiddleware(["admin"]),
  userController.updateUser
);

// Delete a user (requires authentication and appropriate role)
router.delete(
  "/:userId",
  authenticate,
  roleMiddleware(["admin"]),
  userController.deleteUser
);

export default router;
