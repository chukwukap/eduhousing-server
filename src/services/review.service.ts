import { Review } from "@prisma/client";
import prisma from "../config/database";
import { NotFoundError, UnauthorizedError } from "../utils/";

const createReviewService = () => {
  const createReview = async (
    lodgeId: string,
    authorId: string,
    rating: number,
    comment: string
  ): Promise<Review> => {
    const Lodge = await prisma.lodge.findUnique({
      where: { id: lodgeId },
    });
    if (!Lodge) {
      throw new NotFoundError("Property not found");
    }
    const author = await prisma.user.findUnique({
      where: { id: authorId },
    });
    if (!author) {
      throw new Error("Author not found");
    }
    const newReview = await prisma.review.create({
      data: {
        Lodge: { connect: { id: lodgeId } },
        author: { connect: { id: authorId } },
        rating,
        comment,
      },
    });
    return newReview;
  };

  const getReviews = async (): Promise<Review[]> => {
    const reviews = await prisma.review.findMany({
      include: {
        Lodge: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return reviews;
  };

  const getReviewById = async (reviewId: string): Promise<Review> => {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        Lodge: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    return review;
  };

  const getReviewsByProperty = async (lodgeId: string): Promise<Review[]> => {
    const reviews = await prisma.review.findMany({
      where: { LodgeId: lodgeId },
      include: {
        Lodge: true,
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    return reviews;
  };

  const updateReview = async (
    rating: number,
    comment: string,
    reviewId: string,
    authorId: string
  ): Promise<Review> => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    if (review.authorId !== authorId) {
      throw new UnauthorizedError(
        "You are not authorized to update this review"
      );
    }
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { rating, comment },
    });
    return updatedReview;
  };

  const deleteReview = async (
    reviewId: string,
    authorId: string
  ): Promise<Review> => {
    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundError("Review not found");
    }
    if (review.authorId !== authorId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this review"
      );
    }
    const deletedReview = await prisma.review.delete({
      where: { id: reviewId },
    });
    return deletedReview;
  };

  // Return the object with all the methods
  return {
    createReview,
    getReviews,
    getReviewById,
    getReviewsByProperty,
    updateReview,
    deleteReview,
  };
};

export const reviewService = createReviewService();
