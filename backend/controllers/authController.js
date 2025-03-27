const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/users");
const sendEmail = require("../utils/email");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      id: user._id,
      email: user.email,
      name: user.name,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "bad_request",
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    createSendToken(newUser, 201, res);

    logger.info(`New user registered with mail ${newUser.email}`);
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    res.status(500).json({
      status: "internal_server_error",
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
      createSendToken(user, 200, res);

      logger.info(`User logged in: ${user.name}`);
    } else {
      // other wiese show error
      res.status(401).json({
        status: "unauthorized",
        message: "Invalid email or password",
      });
    }
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    res.status(500).json({
      message: "internal_server_error",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });
    next(error);
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      res.status(404).json({
        status: "not_found",
        message: "User not found",
      });
    }

    createSendToken(user, 200, res);
  } catch (error) {
    logger.error(`Profile fetch error: ${error.message}`);
    res.status(500).json({
      message: "Server error fetching profile",
      error: process.env.NODE_ENV === "development" ? error.message : "",
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(404).json({
        status: "not_found",
        message: "user does not exist",
      });
    }

    // generate random token for reset
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send it to users email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/resetPassword/${resetToken}`;
    const message = `Forgot you password??? Submit a new password on this URL to : ${resetUrl} \n This is only valid for 10 min`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Reset Your Password For Pixel Notes",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to mail",
      });
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      res.status(500).json({
        status: "internal_server_error",
        message: "there was an error sending the email",
        error: error.message, // ✅ Return error message for debugging
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "internal_server_error",
      message: "there was an error in reseting the password",
    });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        status: "bad_request",
        message: "Token is invalid or not found",
      });
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateModifiedOnly: true });

    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "internal_server_error",
      message: "Error resetting password",
      error: error.message,
    });
  }
};

// the logged in user can update password
exports.updatePassword = async (req, res, next) => {
  try {
    // get user from request
    const user = await User.findById(req.user.id).select("+password");

    if (!req.body.password || !user) {
      return res.status(400).json({
        status: "bad_request",
        message: "User does not exist or current password is required",
      });
    }

    // check if past password corret
    const isPasswordCorrect = await user.matchPassword(req.body.password);

    if (!isPasswordCorrect) {
      res.status(401).json({
        status: "unauthorized",
        message: "Incorrect Password",
      });
    }

    // update password
    user.password = req.body.newPassword;
    user.confirmPassword = req.body.confirmNewPassword;
    await user.save({ validateModifiedOnly: true });

    // get new token
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({
      status: "internal_server_error",
      message: "Cannot update password",
      error: error.message,
    });
  }
};
