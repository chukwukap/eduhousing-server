import express from "express";
import { universityController } from "../controllers/";
import { authenticate, roleMiddleware } from "../middlewares";

const universityRoutes = express.Router();

// List all universities
universityRoutes.get("/", universityController.listUniversities);

// Get a specific university
universityRoutes.get("/:universityId", universityController.getUniversityById);

// Create a new university (requires authentication and appropriate role)
universityRoutes.post(
  "/",
  authenticate,
  roleMiddleware(["admin"]),
  universityController.addUniversity
);

// Update a university (requires authentication and appropriate role)
universityRoutes.put(
  "/:universityId",
  authenticate,
  roleMiddleware(["admin"]),
  universityController.updateUniversity
);

// Delete a university (requires authentication and appropriate role)
universityRoutes.delete(
  "/:universityId",
  authenticate,
  roleMiddleware(["admin"]),
  universityController.deleteUniversity
);

export { universityRoutes };
