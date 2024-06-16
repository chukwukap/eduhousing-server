import express from "express";
import { lodgeController } from "../controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { roleMiddleware, uploadImages } from "../middlewares";

const lodgeRoutes = express.Router();

// List all lodges
lodgeRoutes.get("/", lodgeController.listProperties);

// Get a specific lodge
lodgeRoutes.get("/:lodgeId", lodgeController.getLodgeById);

// Create a new lodge (requires authentication and appropriate role)
lodgeRoutes.post(
  "/",
  authenticate,
  roleMiddleware(["ADMIN", "LANDLORD"]),
  uploadImages,
  lodgeController.createLodge
);

// Update a lodge (requires authentication and appropriate role)
lodgeRoutes.put(
  "/:lodgeId",
  authenticate,
  roleMiddleware(["ADMIN", "LANDLORD"]),
  lodgeController.updateLodge
);

// Delete a lodge (requires authentication and appropriate role)
lodgeRoutes.delete(
  "/:lodgeId",
  authenticate,
  roleMiddleware(["ADMIN", "LANDLORD"]),
  lodgeController.deleteLodge
);

export { lodgeRoutes };
