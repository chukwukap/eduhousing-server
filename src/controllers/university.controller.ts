import { Request, Response } from "express-serve-static-core";
import { universityService } from "../services/";
import { University, User } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/";

const createUniversityController = () => {
  return {
    addUniversity: async (req: Request, res: Response) => {
      try {
        const { name, location, description, website } = req.body;
        const { roles } = (req.user as User)!;
        const newUniversity = await universityService.addUniversity(
          name,
          location,
          description,
          website
        );
        res.status(201).json({ university: newUniversity });
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          res.status(401).json({ error: err.message });
        } else {
          res.status(400).json({ error: "error creating university" });
        }
      }
    },

    listUniversities: async (req: Request, res: Response) => {
      try {
        const universities = await universityService.listUniversities();
        res.status(200).json(universities);
      } catch (err) {
        res.status(400).json({ error: "Error fetching universities" });
      }
    },

    getUniversityById: async (req: Request, res: Response) => {
      const universityId = req.params.id;
      try {
        const university = universityService.getUniversityById(universityId);
        res.status(200).json({ university });
      } catch (err) {
        if (err instanceof NotFoundError) {
          res.status(404).json({ error: err.message });
        } else {
          res.status(400).json({ error: "error retrieving university" });
        }
      }
    },

    updateUniversity: async (req: Request, res: Response) => {
      try {
        const universityId = req.params.id;
        const { name, location } = req.body;
        const { roles } = (req.user as User)!;
        const updatedUniversity = universityService.updateUniversity(
          { name, location },
          universityId
        );
        res.status(200).json({ university: updatedUniversity });
      } catch (error) {
        if (
          error instanceof UnauthorizedError ||
          error instanceof NotFoundError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error updating university." });
        }
      }
    },

    deleteUniversity: async (req: Request, res: Response) => {
      try {
        const universityId = req.params.id;
        const { roles } = (req.user as User)!;
        const deletedUniversity =
          universityService.deleteUniversity(universityId);
        res.status(200).json({ message: "University deleted successfully" });
      } catch (error) {
        if (
          error instanceof UnauthorizedError ||
          error instanceof NotFoundError
        ) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          res.status(400).json({ error: "Error deleting university" });
        }
      }
    },
  };
};

export const universityController = createUniversityController();
