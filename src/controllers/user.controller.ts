// // user.controller.ts
// import { Request, Response } from "express-serve-static-core";
// import { UserService } from "../services/user.service";
// import { User } from "@prisma/client";
// import { NotFoundError, UnauthorizedError } from "../utils/error.utils";
// import { NextFunction } from "express";

// export class UserController {
//   private userService: UserService;

//   constructor() {
//     this.userService = new UserService();
//   }

//   /**
//    * Get the authenticated user's profile.
//    * @param req - The request object.
//    * @param res - The response object.
//    * @param next - The next middleware function.
//    */
//   async getUserProfile(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         throw new UnauthorizedError("Unauthorized");
//       }
//       const user = await this.userService.getUserProfileById(userId);
//       if (!user) {
//         throw new NotFoundError("User not found");
//       }
//       res.json(user);
//     } catch (err) {
//       next(err);
//     }
//   }

//   /**
//    * Update the authenticated user's profile.
//    * @param req - The request object.
//    * @param res - The response object.
//    * @param next - The next middleware function.
//    */
//   async updateUserProfile(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const userId = req.user?.id;
//       if (!userId) {
//         throw new UnauthorizedError("Unauthorized");
//       }
//       const data = req.body;
//       const updatedUser = await this.userService.updateUserProfile(
//         userId,
//         data
//       );
//       res.json(updatedUser);
//     } catch (err) {
//       next(err);
//     }
//   }
//   public async deleteUserProfile(req: Request, res: Response) {
//     try {
//       const userId = req.user!.id;
//       const deletedUser = await this.userService.deleteUserProfile(userId);
//       res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//       res.status(400).json({ error: "Encountered error deleting user" });
//     }
//   }

//   /**
//    * List all users.
//    * @param req - The request object.
//    * @param res - The response object.
//    * @param next - The next middleware function.
//    */
//   async listUsers(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const users = await this.userService.listUsers();
//       res.json(users);
//     } catch (err) {
//       next(err);
//     }
//   }

//   /**
//    * Get a specific user by their ID.
//    * @param req - The request object.
//    * @param res - The response object.
//    * @param next - The next middleware function.
//    */
//   async getUser(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const userId = req.params.userId;
//       const user = await this.userService.getUserById(userId);
//       if (!user) {
//         throw new NotFoundError("User not found");
//       }
//       res.json(user);
//     } catch (err) {
//       next(err);
//     }
//   }

//   /**
//    * Update a user by their ID.
//    * @param req - The request object.
//    * @param res - The response object.
//    * @param next - The next middleware function.
//    */
//   async updateUser(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const userId = req.params.userId;
//       const data = req.body;
//       const updatedUser = await this.userService.updateUser(userId, data);
//       res.json(updatedUser);
//     } catch (err) {
//       next(err);
//     }
//   }

//   /**
//    * Delete a user by their ID.
//    * @param req - The request object.
//    * @param res - The response object.
//    * @param next - The next middleware function.
//    */
//   async deleteUser(
//     req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> {
//     try {
//       const userId = req.params.userId;
//       const deletedUser = await this.userService.deleteUser(userId);
//       res.json(deletedUser);
//     } catch (err) {
//       next(err);
//     }
//   }
// }

import { Request, Response } from "express-serve-static-core";
import { userService } from "../services/user.service";
import { User } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/error.utils";
import { NextFunction } from "express";

const createUserController = () => {
  return {
    /**
     * Get the authenticated user's profile.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    getUserProfile: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new UnauthorizedError("Unauthorized");
        }
        const user = await userService.getUserProfileById(userId);
        if (!user) {
          throw new NotFoundError("User not found");
        }
        res.json(user);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Update the authenticated user's profile.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    updateUserProfile: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.user?.id;
        if (!userId) {
          throw new UnauthorizedError("Unauthorized");
        }
        const data = req.body;
        const updatedUser = await userService.updateUserProfile(userId, data);
        res.json(updatedUser);
      } catch (err) {
        next(err);
      }
    },

    deleteUserProfile: async (req: Request, res: Response) => {
      try {
        const userId = req.user!.id;
        const deletedUser = await userService.deleteUserProfile(userId);
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(400).json({ error: "Encountered error deleting user" });
      }
    },

    /**
     * List all users.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    listUsers: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const users = await userService.listUsers();
        res.json(users);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Get a specific user by their ID.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    getUser: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.params.userId;
        const user = await userService.getUserById(userId);
        if (!user) {
          throw new NotFoundError("User not found");
        }
        res.json(user);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Update a user by their ID.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    updateUser: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.params.userId;
        const data = req.body;
        const updatedUser = await userService.updateUser(userId, data);
        res.json(updatedUser);
      } catch (err) {
        next(err);
      }
    },

    /**
     * Delete a user by their ID.
     * @param req - The request object.
     * @param res - The response object.
     * @param next - The next middleware function.
     */
    deleteUser: async (
      req: Request,
      res: Response,
      next: NextFunction
    ): Promise<void> => {
      try {
        const userId = req.params.userId;
        const deletedUser = await userService.deleteUser(userId);
        res.json(deletedUser);
      } catch (err) {
        next(err);
      }
    },
  };
};

export const userController = createUserController();
