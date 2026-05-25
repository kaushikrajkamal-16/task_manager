const express = require("express");
const authRoute = require("./authRoute");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("Hello from the index.js");
});

router.use("/auth", authRoute);

module.exports = router;
