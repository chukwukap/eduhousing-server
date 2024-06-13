import express from "express";
import { reviewController } from "../controllers/";
import { authenticate } from "../middlewares/";

const reviewRoutes = express.Router();

// Create a new review for a property (requires authentication)
reviewRoutes.post(
  "/property/:propertyId",
  authenticate,
  reviewController.createReview
);

// Get all reviews for a property
reviewRoutes.get(
  "/property/:propertyId",
  reviewController.getReviewsByProperty
);

// Get a specific review
reviewRoutes.get("/:reviewId", reviewController.getReviewById);

// Update a review (requires authentication and ownership)
reviewRoutes.put("/:reviewId", authenticate, reviewController.updateReview);

// Delete a review (requires authentication and ownership)
reviewRoutes.delete("/:reviewId", authenticate, reviewController.deleteReview);

export { reviewRoutes };
