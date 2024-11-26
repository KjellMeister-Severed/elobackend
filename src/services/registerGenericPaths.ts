import { Express } from "express";

function registerGenericPaths(express: Express) {
  express.get("/test", (req, res) => {
    res.json({
      test: "hello",
    });
  });
}

export { registerGenericPaths };
