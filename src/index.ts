import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import syncTables from "./util/syncTables";
import { registerAuthRoutes } from "./util/registerRoutes";
import { registerGenericPaths } from "./services/registerGenericPaths";

dotenv.config();

export const sequelize = new Sequelize(process.env.PGCONNECTIONSTRING || "", {
  schema: "platform",
});
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

//initialize db connection before registering routes
sequelize
  .authenticate()
  // on success, register the app routes & models
  .then(async () => {
    await syncTables(sequelize);
    // Only applicable in DEV, resync models on every launch
    if (process.env.UPDATEDBONLAUNCH === "true") {
      console.log("Syncing tables");
      await sequelize.sync({ alter: true });
      console.log("[Sequelize Models -> Loaded]:", sequelize.models);
    }
    registerAuthRoutes(app);
    registerGenericPaths(app);
    app.get("*", (req, res) => {
      res.status(404).json({
        status: 404,
        errorCode: "service.notfound",
        message: "Resource not found.",
        instance: "*",
      });
    });
    console.log(app._router.stack);
  })
  // on error, register a general route that returns generic outage error
  .catch((e) => {
    app.get("*", (req, res) => {
      console.error(e);
      res.status(500).json({
        status: 500,
        errorCode: "service.unavailable.database",
        message: "Backend unavailable due to database connection errors.",
        instance: "*",
      });
    });
  });

app.listen(port, () => {
  console.log("Listening on port 3000");
});
