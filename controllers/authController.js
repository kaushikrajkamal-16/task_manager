const { mailSender } = require("../helpers/mailService");
const {
  isValidEmail,
  StrongPassword,
  generateSecureOTP,
} = require("../helpers/utils");
const authSchema = require("../models/authSchema");

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

    if (!user) res.status(400).send("Invalid Credential");
    if (!user.isVerified) (res.status(400), send("Email is not verified"));

    const matchPass = await user.comparePassword(password);
    if (!matchPass) return res.status(400).send("Password is incorrect");

    res.status(200).send("Login Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { registration, verifyOTP, login };
