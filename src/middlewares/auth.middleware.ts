import { Request, Response, NextFunction } from "express-serve-static-core";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../utils/";
import { User, UserRole } from "@prisma/client";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  // if (!token) {
  //   return next(new UnauthorizedError("Authentication token is missing"));
  // }

  // jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
  //   if (err) return res.sendStatus(403);
  //   req.user = user;
  //   return next();
  // });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as User;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid authentication token"));
  }
};

export const isPropertyOwner = (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const { roles, id } = req.user as User;
  const propertyOwnerId = req.params.ownerId;

  if (!roles.includes(UserRole.Lodge_OWNER) || id !== propertyOwnerId) {
    return next(
      new UnauthorizedError("You are not authorized to perform this action")
    );
  }

  next();
};

export const isAdmin = (req: Request, _: Response, next: NextFunction) => {
  const { roles } = req.user! as User;

  if (!roles.includes(UserRole.ADMIN)) {
    return next(
      new UnauthorizedError("You are not authorized to perform this action")
    );
  }

  next();
};

// import app from "./app";
// import prisma from "./config/prisma";

// const PORT = process.env.PORT || 3000;

// async function startServer() {
//   try {
//     await prisma.$connect();
//     console.log("Connected to the database");

//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   } catch (error) {
//     console.error("Failed to start the server:", error);
//     process.exit(1);
//   }
// }

// startServer();
