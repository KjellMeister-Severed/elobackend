import { Express } from "express";
import {
  LoginRequestI,
  RegisterRequestI,
  TokenFormatI,
} from "../types/AuthTypes";
import { authenticateUser, registerPlayer } from "../services/authservice";
import { validateData } from "../middleware/validateData";
import { RegisterSchema } from "../schemas/AuthSchemas";
import { checkPlayerExistence } from "./checkPlayerExistence";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { Player } from "../models/Player";
import { Op } from "sequelize";

export const registerAuthRoutes = (app: Express) => {
  app.post("/login", async (req, res) => {
    const body: LoginRequestI = req.body;
    const findUser = await authenticateUser(body.usernameEmail);
    if (
      !findUser ||
      !(await bcrypt.compare(body.password, findUser.password))
    ) {
      res.status(401).json({
        status: 401,
        errorCode: "request.validation.user.invalid",
        message: "Invalid username or password.",
        instance: req.path,
      });
      return;
    }
    const refreshToken = (findUser.refreshToken = uuidv4());
    findUser.refreshToken = refreshToken;
    await findUser.save();
    res.status(200).json({
      access_token: jwt.sign(
        {
          username: findUser.userName,
          role: findUser.role,
          id: findUser.id,
          email: findUser.email,
          displayName: findUser.displayName,
          playerTag: findUser.playerTag,
          refreshToken: refreshToken,
        },
        process.env.JWTSECRET || "",
        { expiresIn: "1h", algorithm: "HS256" },
      ),
      token_type: "Bearer",
      expires_in: 3600,
      refresh_token: refreshToken,
      scope: "app",
    });
  });

  app.get("/refresh", async (req, res) => {
    jwt.verify(
      req.headers.authorization?.split(" ")[1] || "",
      process.env.JWTSECRET || "",
      { algorithms: ["HS256"], ignoreExpiration: true },
      async (err, decoded) => {
        if (err || !decoded) {
          res.status(401).json({
            status: 401,
            errorCode: "request.validation.token.invalid",
            message: "Invalid token.",
            instance: req.path,
          });
          return;
        }
        const decodedToken = jwt.decode(
          req.headers.authorization?.split(" ")[1] || "",
          { complete: true, json: true },
        )?.payload as TokenFormatI;
        const user = await Player.findOne({
          where: {
            [Op.or]: [
              { id: decodedToken.id },
              { refreshToken: decodedToken.refreshToken },
            ],
          },
        });
        if (!user) {
          res.status(401).json({
            status: 401,
            errorCode: "request.validation.user.invalid",
            message: "Invalid (refresh) token.",
            instance: req.path,
          });
          return;
        }
        const refreshToken = uuidv4();
        user.refreshToken = refreshToken;
        await user.save();
        res.status(200).json({
          access_token: jwt.sign(
            {
              username: user.userName,
              role: user.role,
              id: user.id,
              email: user.email,
              displayName: user.displayName,
              playerTag: user.playerTag,
              refreshToken: user.refreshToken,
            },
            process.env.JWTSECRET || "",
            { expiresIn: "1h", algorithm: "HS256" },
          ),
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: refreshToken,
          scope: "app",
        });
      },
    );
  });

  app.post("/register", validateData(RegisterSchema), async (req, res) => {
    const body: RegisterRequestI = req.body;
    if (await checkPlayerExistence(body.username, body.email)) {
      res.status(400).json({
        status: 400,
        errorCode: "request.validation.user.exists",
        message: "Username or email already exists.",
        instance: req.path,
      });
      return;
    }
    registerPlayer(body)
      .then(() => {
        res.status(201).json({
          status: 201,
          message: "Player registered successfully.",
        });
      })
      .catch((e) => {
        console.error(e);
        res.status(500).json({
          status: 500,
          errorCode: "service.unavailable.database",
          message: "Backend unavailable due to database connection errors.",
          instance: "*",
        });
      });
  });

  app.get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      errorCode: "service.notfound",
      message: "Resource not found.",
      instance: "*",
    });
  });
};
