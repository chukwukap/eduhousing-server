import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/";
import { User, UserRole } from "@prisma/client";

export const authenticate = (req: Request, _: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new UnauthorizedError("Authentication token is missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as User;
    next();
  } catch (err) {
    next(new UnauthorizedError("Invalid authentication token"));
  }
};

export const isPropertyOwner = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { role, id } = req.user! as User;
  const propertyOwnerId = req.params.ownerId;

  if (role !== UserRole.PROPERTY_OWNER || id !== propertyOwnerId) {
    return next(
      new UnauthorizedError("You are not authorized to perform this action")
    );
  }

  next();
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const { role } = req.user! as User;

  if (role !== UserRole.ADMIN) {
    return next(
      new UnauthorizedError("You are not authorized to perform this action")
    );
  }

  next();
};
