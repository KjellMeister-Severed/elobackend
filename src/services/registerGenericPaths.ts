import { Express } from "express";
import { validateAuth } from "../middleware/authChecker";

function registerGenericPaths(express: Express) {
  express.get("/authenticated", validateAuth(), async (req, res) => {
    res.json({
      message: "You are authenticated as " + req.body.decodedToken.username,
    });
  });
}

export { registerGenericPaths };
