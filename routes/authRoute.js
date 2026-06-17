const express = require("express");
const {
  registration,
  verifyOTP,
  login,
  userProfile,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);
router.post("/userProfile", authMiddleware, userProfile);

module.exports = router;
