import { Request, Response } from "express-serve-static-core";
import { bookingService } from "../services/";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/";
import { NextFunction } from "express";
import { User } from "@prisma/client";

const createBookingController = () => {
  return {
    /**
     * Create a new booking.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    createBooking: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const tenantId = (req.user as User)?.id;
        const { propertyId, checkInDate, checkOutDate } = req.body;

        if (!tenantId || !propertyId || !checkInDate || !checkOutDate) {
          throw new BadRequestError("Missing required fields");
        }

        const booking = await bookingService.createBooking(
          tenantId,
          propertyId,
          new Date(checkInDate),
          new Date(checkOutDate)
        );

        res.status(201).json(booking);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Retrieves all bookings for a given property.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    getBookingsByProperty: async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const propertyId = req.params.propertyId;
        const bookings = await bookingService.getBookingsByProperty(propertyId);
        res.status(200).json(bookings);
      } catch (error) {
        next(error);
      }
    },

    /**
     * Retrieves all bookings for the authenticated user.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    getBookingsByTenant: async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const tenantId = (req.user as User)!.id;
        if (!tenantId) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        const bookings = await bookingService.getBookingsByTenant(tenantId);
        return res.status(200).json({ bookings });
      } catch (error) {
        next(error);

        return res.status(400).json({ error: "Error fetching bookings" });
      }
    },

    /**
     * Get a specific booking for the authenticated user.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    getBookingByTenant: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const tenantId = (req.user as User)?.id;
        const bookingId = req.params.bookingId;

        if (!tenantId) {
          throw new UnauthorizedError("Unauthorized");
        }

        const booking = await bookingService.getBookingByTenant(
          tenantId,
          bookingId
        );

        if (!booking) {
          throw new NotFoundError("Booking not found");
        }

        res.json(booking);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Update a booking for the authenticated user.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    updateBookingByUser: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const tenantId = (req.user as User)?.id;
        const bookingId = req.params.bookingId;
        const updates = req.body;

        if (!tenantId) {
          throw new UnauthorizedError("Unauthorized");
        }

        const updatedBooking = await bookingService.updateBookingByTenant(
          tenantId,
          bookingId,
          updates
        );
        res.json(updatedBooking);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Cancel a booking for the authenticated user.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    cancelBookingByUser: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const tenantId = (req.user as User)?.id;
        const bookingId = req.params.bookingId;

        if (!tenantId) {
          throw new UnauthorizedError("Unauthorized");
        }

        const canceledBooking = await bookingService.cancelBookingByTenant(
          tenantId,
          bookingId
        );
        res.json(canceledBooking);
      } catch (err) {
        next(err);
      }
    },
  };
};

export const bookingController = createBookingController();
