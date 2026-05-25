const express = require("express");
const {
  registration,
  verifyOTP,
  login,
} = require("../controllers/authController");
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);

module.exports = router;
