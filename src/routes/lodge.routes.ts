import express from "express";
import { propertyController } from "../controllers";
import { authenticate } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares";
import { uploadImages } from "src/middlewares/upload.middleware";

const propertyRoutes = express.Router();

// List all properties
propertyRoutes.get("/", propertyController.listProperties);

// Get a specific property
propertyRoutes.get("/:propertyId", propertyController.getPropertyById);

// Create a new property (requires authentication and appropriate role)
propertyRoutes.post(
  "/",
  authenticate,
  roleMiddleware(["ADMIN", "LANDLORD"]),
  uploadImages,
  propertyController.createProperty
);

// Update a property (requires authentication and appropriate role)
propertyRoutes.put(
  "/:propertyId",
  authenticate,
  roleMiddleware(["ADMIN", "LANDLORD"]),
  propertyController.updateProperty
);

// Delete a property (requires authentication and appropriate role)
propertyRoutes.delete(
  "/:propertyId",
  authenticate,
  roleMiddleware(["ADMIN", "LANDLORD"]),
  propertyController.deleteProperty
);

export { propertyRoutes };
