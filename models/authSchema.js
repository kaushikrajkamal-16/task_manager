const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const authSchema = new mongoose.Schema({
  avatar: {
    type: String,
    default: "",
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: "",
  },
  otpExpiry: {
    type: Date,
  },
});

authSchema.pre("save", async function () {
  // Only hash if password changed
  if (!this.isModified("password")) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal Server Error");
  }
});

authSchema.methods.comparePassword = async function (plainpassword) {
  return await bcrypt.compare(plainpassword, this.password);
};

module.exports = mongoose.model("user", authSchema);
