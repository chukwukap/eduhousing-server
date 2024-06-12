import { User } from "@prisma/client";

import { Request, Response, NextFunction } from "express";

export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req.user as User)?.role!; // Assuming you have a user object attached to the request with a 'role' property

    if (!roles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    return next();
  };
};
