const express = require("express");
const {
  registration,
  verifyOTP,
  login,
  userProfile,
  updateProfile,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const multer = require("multer");
const upload = multer();

router.post("/registration", registration);
router.post("/verifyOTP", verifyOTP);
router.post("/login", login);
router.post("/userProfile", authMiddleware, userProfile);
router.put(
  "/updateProfile",
  authMiddleware,
  upload.single("avatar"),
  updateProfile,
);

module.exports = router;
