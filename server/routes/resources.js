const express = require("express");
const resourcesRouter = express.Router();

const { client } = require("../db");

resourcesRouter.get("/", async (req, res) => {
  try {
    const results = await client.query("SELECT * FROM resource");
    res.json(results.rows);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = resourcesRouter;
