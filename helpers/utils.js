const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function StrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

const generateSecureOTP = () => {
  // Generates a cryptographically secure integer between 100000 and 999999
  return crypto.randomInt(100000, 999999).toString();
};

const generateAccessToken = (user) => {
  const token = jwt.sign(user, process.env.JWT_SEC);
  return token;
};

module.exports = {
  isValidEmail,
  StrongPassword,
  generateSecureOTP,
  generateAccessToken,
};
