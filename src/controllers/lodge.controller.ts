import { Request, Response } from "express-serve-static-core";
import { lodgeService } from "../services";
import { Lodge, User } from "@prisma/client";
import { CustomError, NotFoundError, UnauthorizedError } from "../utils";

const createLodgeController = () => {
  return {
    createLodge: async (req: Request, res: Response) => {
      try {
        const ownerId = (req.user as User as User)!.id; // Assuming authenticated user is available
        const {
          id,
          title,
          description,
          type,
          location,
          amenities,
          bedrooms,
          bathrooms,
          rent,
          availableFrom,
          availableTo,
          deposit,
          university,
          images,
        } = req.body as Lodge;

        const lodge = await lodgeService.createLodge({
          id,
          amenities,
          availableFrom,
          availableTo,
          bathrooms,
          bedrooms,
          deposit,
          description,
          images,
          location,
          ownerId,
          rent,
          title,
          type,
          university,
        });
        res.status(201).json(lodge);
      } catch (err) {
        if (err instanceof CustomError)
          res.status(err.statusCode).json({ error: err.message });
      }
    },

    listProperties: async (req: Request, res: Response) => {
      try {
        const properties = await lodgeService.listLodge();

        res.status(200).json({ properties });
      } catch (error) {
        res.status(400).json({ error: "Error fetching properties " });
      }
    },

    getLodgeById: async (req: Request, res: Response) => {
      const lodgeId = req.params.id;
      try {
        const lodge = await lodgeService.getLodgeById(lodgeId);
        res.status(200).json({ lodge });
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: `Error fetching lodge ${lodgeId}` });
        }
      }
    },

    getPropertiesByUniversity: async (req: Request, res: Response) => {
      try {
        const universityId = req.params.universityId;
        const properties = await lodgeService.getPropertiesByUniversity(
          universityId
        );
        res.status(200).json(universityId);
      } catch (err) {
        res.status(400).json({ error: "" });
      }
    },

    updateLodge: async (req: Request, res: Response) => {
      try {
        const lodgeId = req.params.id;
        const ownerId = (req.user as User)!.id;
        const lodge = req.body;
        const updatedLodge = await lodgeService.updateLodge(
          lodge,
          ownerId,
          lodgeId
        );
        res.status(200).json({ lodge: updatedLodge });
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "error updating lodge" });
        }
      }
    },

    deleteLodge: async (req: Request, res: Response) => {
      try {
        const lodgeId = req.params.id;
        const ownerId = (req.user as User)!.id;
        const deletedLodge = await lodgeService.deleteLodge(lodgeId, ownerId);
        res.status(200).json({ deletedLodge });
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error deleting lodge" });
        }
      }
    },
  };
};

export const lodgeController = createLodgeController();
