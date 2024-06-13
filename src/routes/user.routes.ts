import express from "express";
import { userController } from "../controllers/user.controller";
import { authenticate, roleMiddleware } from "../middlewares";

const userRoutes = express.Router();

// Get the authenticated user's profile
userRoutes.get("/profile", authenticate, userController.getUserProfile);

// Update the authenticated user's profile
userRoutes.put("/profile", authenticate, userController.updateUserProfile);

// List all users (requires authentication and appropriate role)
userRoutes.get(
  "/",
  authenticate,
  roleMiddleware(["admin"]),
  userController.listUsers
);

// Get a specific user (requires authentication and appropriate role)
userRoutes.get(
  "/:userId",
  authenticate,
  roleMiddleware(["admin"]),
  userController.getUser
);

// Update a user (requires authentication and appropriate role)
userRoutes.put(
  "/:userId",
  authenticate,
  roleMiddleware(["admin"]),
  userController.updateUser
);

// Delete a user (requires authentication and appropriate role)
userRoutes.delete(
  "/:userId",
  authenticate,
  roleMiddleware(["admin"]),
  userController.deleteUser
);

export { userRoutes };
