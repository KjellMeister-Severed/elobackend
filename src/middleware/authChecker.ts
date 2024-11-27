import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { TokenFormatI } from "../types/AuthTypes";

export function validateAuth() {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.headers.authorization) {
        throw new Error("No token provided.");
      }
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(
        token,
        process.env.JWTSECRET || "",
        { algorithms: ["HS256"] },
        (err, decoded) => {
          if (err || !decoded) {
            throw new Error("Invalid token.");
          }
          const decodedToken = jwt.decode(token, { complete: true, json: true })
            ?.payload as TokenFormatI;

          req.body.decodedToken = decodedToken;
        },
      );
      next();
    } catch (e) {
      console.log(e);
      res.status(401).json({
        status: 401,
        errorCode: "request.token.invalid",
        message: "Invalid token.",
        instance: req.path,
      });
    }
  };
}
