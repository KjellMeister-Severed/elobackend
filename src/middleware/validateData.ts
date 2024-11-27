// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessages = error.errors.map((issue: any) => ({
          property: issue.path.join("."),
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        res.status(400).json({
          status: 400,
          errorCode: "request.validation.error",
          message: "Request contains invalid (values) request body.",
          instance: req.path,
          messages: errorMessages,
        });
      } else {
        res.status(500).json({
          status: 500,
          errorCode: "request.validation.exception",
          message:
            "Validation caused an unexpected error, please try again later.",
          instance: "*",
        });
      }
    }
  };
}
