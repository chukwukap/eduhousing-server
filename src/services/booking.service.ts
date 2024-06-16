import { Booking, BookingStatus, Prisma } from "@prisma/client";
import prisma from "../config/database";
import { BadRequestError, NotFoundError } from "../utils/";

const createBookingService = () => {
  /**
   * Create a new booking.
   * @param tenantId - The ID of the tenant making the booking.
   * @param LodgeId - The ID of the Lodge to book.
   * @param checkInDate - The check-in date for the booking.
   * @param checkOutDate - The check-out date for the booking.
   * @returns The new booking.
   * @throws BadRequestError if the check-in date is after the check-out date, or if the Lodge is not available for the requested dates.
   * @throws NotFoundError if the tenant or Lodge is not found.
   */
  const createBooking = async (
    tenantId: string,
    LodgeId: string,
    checkInDate: Date,
    checkOutDate: Date
  ): Promise<Booking> => {
    const tenant = await prisma.user.findUnique({ where: { id: tenantId } });
    const Lodge = await prisma.lodge.findUnique({
      where: { id: LodgeId },
    });

    if (!tenant || !Lodge) {
      throw new NotFoundError("Tenant or Lodge not found");
    }

    if (checkInDate >= checkOutDate) {
      throw new BadRequestError("Check-in date must be before check-out date");
    }

    const existingBookings = await prisma.booking.findMany({
      where: {
        LodgeId,
        OR: [
          {
            checkInDate: {
              gte: checkInDate,
              lt: checkOutDate,
            },
          },
          {
            checkOutDate: {
              gt: checkInDate,
              lte: checkOutDate,
            },
          },
        ],
      },
    });

    if (existingBookings.length > 0) {
      throw new BadRequestError(
        "Property is not available for the requested dates"
      );
    }

    return prisma.booking.create({
      data: {
        tenant: { connect: { id: tenantId } },
        Lodge: { connect: { id: LodgeId } },
        checkInDate,
        checkOutDate,
        status: BookingStatus.PENDING,
        paymentDetails: {},
        totalRent: 3000,
      },
    });
  };

  /**
   * Retrieves all bookings for a given Lodge.
   * @param LodgeId - The ID of the Lodge.
   * @returns An array of booking objects for the Lodge.
   */
  const getBookingsByProperty = async (LodgeId: string): Promise<Booking[]> => {
    return prisma.booking.findMany({
      where: {
        LodgeId,
      },
      include: {
        tenant: true,
      },
    });
  };

  /**
   * Retrieves all bookings for a given user.
   * @param userId - The ID of the user.
   * @returns An array of booking objects for the user.
   */
  const getBookingsByTenant = async (tenantId: string): Promise<Booking[]> => {
    const bookings = await prisma.booking.findMany({
      where: { tenantId: tenantId },
      include: {
        Lodge: true,
      },
    });

    return bookings;
  };

  /**
   * Get a specific booking for a tenant.
   * @param tenantId - The ID of the tenant.
   * @param bookingId - The ID of the booking.
   * @returns The booking for the tenant.
   * @throws NotFoundError if the tenant or booking is not found.
   */
  const getBookingByTenant = async (
    tenantId: string,
    bookingId: string
  ): Promise<Booking | null> => {
    return prisma.booking.findFirst({
      where: { id: bookingId, tenantId },
      include: { Lodge: true },
    });
  };

  /**
   * Update a booking for a tenant.
   * @param tenantId - The ID of the tenant.
   * @param bookingId - The ID of the booking to update.
   * @param updates - The updates to apply to the booking.
   * @returns The updated booking.
   * @throws NotFoundError if the tenant or booking is not found.
   * @throws BadRequestError if the check-in date is after the check-out date, or if the Lodge is not available for the requested dates.
   */
  const updateBookingByTenant = async (
    tenantId: string,
    bookingId: string,
    updates: Partial<Booking>
  ): Promise<Booking> => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, tenantId },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    if (updates.checkInDate && updates.checkOutDate) {
      if (updates.checkInDate >= updates.checkOutDate) {
        throw new BadRequestError(
          "Check-in date must be before check-out date"
        );
      }

      const existingBookings = await prisma.booking.findMany({
        where: {
          LodgeId: booking.LodgeId,
          id: { not: bookingId },
          OR: [
            {
              checkInDate: {
                gte: updates.checkInDate,
                lt: updates.checkOutDate,
              },
            },
            {
              checkOutDate: {
                gt: updates.checkInDate,
                lte: updates.checkOutDate,
              },
            },
          ],
        },
      });

      if (existingBookings.length > 0) {
        throw new BadRequestError(
          "Property is not available for the requested dates"
        );
      }
    }

    return prisma.booking.update({
      where: { id: bookingId },
      data: {
        ...updates,
        paymentDetails: updates.paymentDetails as Prisma.InputJsonValue,
      },
    });
  };

  /**
   * Cancel a booking for a tenant.
   * @param tenantId - The ID of the tenant.
   * @param bookingId - The ID of the booking to cancel.
   * @returns The canceled booking.
   * @throws NotFoundError if the tenant or booking is not found.
   */
  const cancelBookingByTenant = async (
    tenantId: string,
    bookingId: string
  ): Promise<Booking> => {
    const booking = await prisma.booking.findFirst({
      where: { id: bookingId, tenantId },
    });

    if (!booking) {
      throw new NotFoundError("Booking not found");
    }

    return prisma.booking.delete({ where: { id: bookingId } });
  };

  return {
    createBooking,
    getBookingsByProperty,
    getBookingsByTenant,
    getBookingByTenant,
    updateBookingByTenant,
    cancelBookingByTenant,
  };
};

export const bookingService = createBookingService();
