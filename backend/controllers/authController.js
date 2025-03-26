const jwt = require("jsonwebtoken");
const User = require("../models/users");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
    logger.info(`New user registered with mail ${newUser.email}`);
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });
  }
};
