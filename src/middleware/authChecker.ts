import { Request, Response, NextFunction } from "express";

export function validateAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      next();
    } catch (e) {
      console.log(e);
      res.status(400).json({
        status: 400,
        errorCode: "request.validation.error",
        message: "Request contains invalid (values) request body.",
        instance: req.path,
      });
    }
  };
}
