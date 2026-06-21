const { mailSender } = require("../helpers/mailService");
const {
  isValidEmail,
  StrongPassword,
  generateSecureOTP,
  generateAccessToken,
} = require("../helpers/utils");
const authSchema = require("../models/authSchema");
const cloudinary = require("../configs/cloudinary");
const {
  uploadToCloudinary,
  destroyFromCloudinary,
} = require("../helpers/cloudinaryService");

const registration = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName.trim()) return res.status(400).send("Full Name is required");
    if (!email) return res.status(400).send("email is required");
    if (!isValidEmail(email)) return res.status(400).send("Invalid Email");
    if (!password) return res.status(400).send("password is required");
    if (!StrongPassword(password))
      return res.status(400).send("Strong password is required");

    const existingEmail = await authSchema.findOne({ email });

    if (existingEmail) return res.status(400).send("Email already exist");

    const OTP_Num = generateSecureOTP();

    const user = await new authSchema({
      fullName,
      email,
      password,
      otp: OTP_Num,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    user.save();

    console.log(user);

    await mailSender({ email, Subject: "OTP Verification Mail", otp: OTP_Num });

    return res.status(200).send("Registration Successfully");
  } catch (error) {
    console.log(error);
    console.log(error);

    return res.status(500).send("Internal Server Error");
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await authSchema.findOneAndUpdate(
      {
        email,
        otp,
        otpExpiry: { $gt: Date.now() },
      },
      { isVerified: true, otp: "" },
      { returnDocument: "after" },
    );
    console.log(user);
    res.status(200).send("Email Verified Successfully");
  } catch (error) {
    console.log(error);

    res.status(400).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await authSchema.findOne({ email });

    console.log(user);

    if (!user) res.status(400).send("Invalid Credential");
    if (!user.isVerified) (res.status(400), send("Email is not verified"));

    const matchPass = await user.comparePassword(password);
    if (!matchPass) return res.status(400).send("Password is incorrect");

    const accessToken = generateAccessToken({
      _id: user._id,
      email: user.email,
    });

    res.cookie("accessToken", accessToken);

    res.status(200).send("Login Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

const userProfile = async (req, res) => {
  try {
    const userData = await authSchema
      .findOne({ _id: req.user._id })
      .select("avatar fullName email");

    if (!userData) res.status(400).send("User not found");
    res.status(200).send(userData);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

const updateProfile = async (req, res) => {
  const { fullName } = req.body;
  const userId = req.user._id;

  try {
    const userData = await authSchema.findOne({ _id: userId });

    if (fullName?.trim()) userData.fullName = fullName;

    if (req.file) {
      const avatarUrl = await uploadToCloudinary({
        mimetype: req.file.mimetype,
        imgBuffer: req.file.buffer,
      });

      destroyFromCloudinary(userData.avatar);

      userData.avatar = await avatarUrl.secure_url;
    }

    userData.save();

    res.status(200).send("Updated Successfully");
  } catch (error) {
    console.log(error);
  }
};

module.exports = { registration, verifyOTP, login, userProfile, updateProfile };
