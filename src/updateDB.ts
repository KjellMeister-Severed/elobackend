import express from "express";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import syncTables from "./util/syncTables";
import { Player } from "./models/Player";
dotenv.config();

export const sequelize = new Sequelize(process.env.PGCONNECTIONSTRING || "", {
  schema: "platform",
});
const app = express();
const port = process.env.PORT || 3000;

//initialize db connection before registering routes
sequelize
  .authenticate()
  // on success, register the app routes
  .then(async () => {
    syncTables(sequelize).then(() => {
      console.log("Syncing tables");
      Player.sync({ alter: true });
    });
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
