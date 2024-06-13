import { User } from "@prisma/client";

import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRoles = (req.user as User)?.roles; // Assuming you have a user object attached to the request with a 'role' property

    // if (!roles.includes(userRoles)) {
    //   return res
    //     .status(403)
    //     .json({ message: "Forbidden: Insufficient permissions" });
    // }
    return next();
  };
};
