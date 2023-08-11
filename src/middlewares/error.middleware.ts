import { Request, Response, NextFunction } from "express";
import AppError from "../errors/appError";

export const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.statusCode ?? 500;
  const message = err.message ?? "Internal server error";

  res.status(status).json({
    message: message,
  });
};
