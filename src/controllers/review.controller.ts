import { Request, Response } from "express-serve-static-core";
import { reviewService } from "../services/";
import { NotFoundError, UnauthorizedError } from "../utils/";
import { User } from "@prisma/client";

const createReviewController = () => {
  return {
    createReview: async (req: Request, res: Response) => {
      try {
        const { propertyId, rating, comment } = req.body;
        const userId = (req.user as User)!.id; // Assuming authenticated user is available
        const review = await reviewService.createReview(
          propertyId,
          userId,
          rating,
          comment
        );
        res.status(201).json(review);
      } catch (err) {
        if (err instanceof NotFoundError) {
          res.status(404).json({ error: err.message });
        } else {
          res.status(400).json({ error: "Error creating review." });
        }
      }
    },

    getReviews: async (req: Request, res: Response) => {
      try {
        const reviews = await reviewService.getReviews();
        res.status(200).json({ reviews });
      } catch (error) {
        res.status(400).json({ error: "Error retrieving reviews" });
      }
    },

    getReviewsByProperty: async (req: Request, res: Response) => {
      try {
        const propertyId = req.params.propertyId;
        const reviews = await reviewService.getReviewsByProperty(propertyId);
        res.status(200).json(reviews);
      } catch (err) {
        res.status(400).json({ error: "" });
      }
    },

    getReviewById: async (req: Request, res: Response) => {
      try {
        const reviewId = req.params.id;
        const review = await reviewService.getReviewById(reviewId);
        res.status(200).json({ review });
      } catch (error) {
        if (error instanceof NotFoundError) {
          res.status(404).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error getting review" });
        }
      }
    },

    updateReview: async (req: Request, res: Response) => {
      try {
        const reviewId = req.params.id;
        const authorId = (req.user as User)!.id;
        const { rating, comment } = req.body;
        const updatedReview = reviewService.updateReview(
          rating,
          comment,
          reviewId,
          authorId
        );
        res.status(200).json({ review: updatedReview });
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error updating review" });
        }
      }
    },

    deleteReview: async (req: Request, res: Response) => {
      try {
        res.status(200).json({ message: "Review deleted successfully" });
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error deleting review" });
        }
      }
    },
  };
};

export const reviewController = createReviewController();
