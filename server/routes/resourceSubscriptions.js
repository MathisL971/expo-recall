const { Router } = require("express");
const resourceSubscriptionsRouter = Router();

resourceSubscriptionsRouter.get("/", (req, res) => {
  res.send("Hello World");
});

module.exports = resourceSubscriptionsRouter;
