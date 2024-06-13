import express from "express";
import { bookingController } from "../controllers/booking.controller";
import { authenticate } from "../middlewares/";

const bookingRoutes = express.Router();

// Create a new booking
bookingRoutes.post("/", authenticate, bookingController.createBooking);

// Get all bookings for the authenticated user
bookingRoutes.get("/user", authenticate, bookingController.getBookingsByTenant);

// Get a specific booking for the authenticated user
bookingRoutes.get(
  "/user/:bookingId",
  authenticate,
  bookingController.getBookingByTenant
);

// Update a booking for the authenticated user
bookingRoutes.put(
  "/user/:bookingId",
  authenticate,
  bookingController.updateBookingByUser
);

// Cancel a booking for the authenticated user
bookingRoutes.delete(
  "/user/:bookingId",
  authenticate,
  bookingController.cancelBookingByUser
);

// Get all bookings for a property
bookingRoutes.get(
  "/property/:propertyId",
  bookingController.getBookingsByProperty
);

export { bookingRoutes };
