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

exports.login = async (req, res, next) => {
  try {
    // receive user data
    const { email, password } = req.body;

    // check if user exists and password is correct
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // if yes, generate token and login
      const token = generateToken(user._id);

      res.status(200).json({
        status: "success",
        token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

      logger.info(`User logged in: ${user.user}`);
    } else {
      // other wiese show error
      res.status(401).json({
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });
    next(error);
  }
};
