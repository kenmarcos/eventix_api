import { NextFunction, Request, Response } from "express";
import { errorMiddleware } from "../middlewares/error.middleware";
import AppError from "../errors/appError";

describe("Error Middleware", () => {
  it("should respond with the correct status and message AppError", () => {
    // Mocks
    const appError: AppError = {
      name: "AppError",
      statusCode: 404,
      message: "Not found",
    };

    const req: Partial<Request> = {};

    const res: Partial<Response> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next: NextFunction = jest.fn();

    errorMiddleware(appError, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Not found",
    });
  });
});
