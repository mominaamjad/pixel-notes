const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { logger } = require("../config/logger");

// to check ke user logged in hai? agar hai toh user obj request ke saath agay bhej do
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(404).json({
          status: "not_found",
          message: "User not found",
        });
      }
      next();
    } catch (error) {
      logger.error(`Authorization error: ${error.message}`);
      res.status(401).json({
        status: "unaauthorized",
        message: "Not authorized",
        error: process.env.NODE_ENV === "development" ? error.message : "",
      });
    }

    if (!token) {
      res.status(401).json({
        status: "unauthorized",
        message: "Please login to continue",
      });
    }
  }
};
