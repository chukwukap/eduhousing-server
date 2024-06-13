import { Request, Response } from "express-serve-static-core";
import { propertyService } from "../services/";
import { Property, User } from "@prisma/client";
import { CustomError, NotFoundError, UnauthorizedError } from "../utils/";

const createPropertyController = () => {
  return {
    createProperty: async (req: Request, res: Response) => {
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
        } = req.body as Property;

        const property = await propertyService.createProperty({
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
        res.status(201).json(property);
      } catch (err) {
        if (err instanceof CustomError)
          res.status(err.statusCode).json({ error: err.message });
      }
    },

    listProperties: async (req: Request, res: Response) => {
      try {
        const properties = await propertyService.listProperties();

        res.status(200).json({ properties });
      } catch (error) {
        res.status(400).json({ error: "Error fetching properties " });
      }
    },

    getPropertyById: async (req: Request, res: Response) => {
      const propertyId = req.params.id;
      try {
        const property = await propertyService.getPropertyById(propertyId);
        res.status(200).json({ property });
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res
            .status(400)
            .json({ error: `Error fetching property ${propertyId}` });
        }
      }
    },

    getPropertiesByUniversity: async (req: Request, res: Response) => {
      try {
        const universityId = req.params.universityId;
        const properties = await propertyService.getPropertiesByUniversity(
          universityId
        );
        res.status(200).json(universityId);
      } catch (err) {
        res.status(400).json({ error: "" });
      }
    },

    updateProperty: async (req: Request, res: Response) => {
      try {
        const propertyId = req.params.id;
        const ownerId = (req.user as User)!.id;
        const property = req.body;
        const updatedProperty = await propertyService.UpdateProperty(
          property,
          ownerId,
          propertyId
        );
        res.status(200).json({ property: updatedProperty });
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "error updating property" });
        }
      }
    },

    deleteProperty: async (req: Request, res: Response) => {
      try {
        const propertyId = req.params.id;
        const ownerId = (req.user as User)!.id;
        const deletedProperty = await propertyService.deleteProperty(
          propertyId,
          ownerId
        );
        res.status(200).json({ deletedProperty });
      } catch (error) {
        if (
          error instanceof NotFoundError ||
          error instanceof UnauthorizedError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error deleting property" });
        }
      }
    },
  };
};

export const propertyController = createPropertyController();
