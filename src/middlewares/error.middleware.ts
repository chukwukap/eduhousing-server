import { Request, Response } from "express";
import { CustomError } from "../utils/";

export const errorHandler = (err: Error, _: Request, res: Response) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal Server Error" });
};
