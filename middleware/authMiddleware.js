const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    const decoded = jwt.verify(accessToken, process.env.JWT_SEC);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      res.status(401).send("Unauthorized Access Request");
    }
  } catch (error) {
    res.status(401).send("Unauthorized Access Request");
  }
};

module.exports = { authMiddleware };
