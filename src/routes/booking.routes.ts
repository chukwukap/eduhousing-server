import express from "express";
import { bookingController } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/";

const router = express.Router();

// Create a new booking
router.post("/", authenticate, bookingController.createBooking);

// Get all bookings for the authenticated user
router.get("/user", authenticate, bookingController.getBookingsByTenant);

// Get a specific booking for the authenticated user
router.get(
  "/user/:bookingId",
  authenticate,
  bookingController.getBookingByTenant
);

// Update a booking for the authenticated user
router.put(
  "/user/:bookingId",
  authenticate,
  bookingController.updateBookingByUser
);

// Cancel a booking for the authenticated user
router.delete(
  "/user/:bookingId",
  authenticate,
  bookingController.cancelBookingByUser
);

// Get all bookings for a property
router.get("/property/:propertyId", bookingController.getBookingsByProperty);

export default router;
