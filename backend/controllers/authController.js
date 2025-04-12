const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { logger } = require("../config/logger");
const sendEmail = require("../utils/email");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/users");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn(`Signup failed: Email already exists: ${email}`);
    return next(new AppError("User already exists", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
  });

  if (!newUser) {
    logger.error(`Signup error: Database error for email: ${email}`);
    return next(new AppError("Server error during registration", 500));
  }

  logger.info(`New user registered with mail ${newUser.email}`);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  // receive user data
  const { email, password } = req.body;

  if (!email || !password) {
    logger.warn(`Login failed: Missing credentials for email: ${email}`);
    return next(new AppError("Please provide email and password!", 400));
  }

  // check if user exists and password is correct
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    logger.warn(`Login failed: Invalid credentials for email: ${email}`);
    return next(new AppError("Incorrect email or password", 401));
  }

  logger.info(`User logged in: ${user.name}`);
  createSendToken(user, 200, res);
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new AppError("There is no user with this id", 404));
  }

  logger.info(`User data for: ${user.name}`);
  createSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  // generate random token for reset
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `const resetURL = http://localhost:5173/reset-password?token=${resetToken}`;
  const message = `Forgot you password??? Submit a new password on this URL to : ${resetUrl} \n This is only valid for 10 min`;

  logger.info(`Password reset token generated for ${user.email}`);

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset Your Password For Pixel Notes",
      message,
    });

    logger.info(`Password reset email sent to ${user.email}`);

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (error) {
    logger.error(`Error sending email: ${error.message}`);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateModifiedOnly: true });

  logger.info(`Password reset successful for ${user.email}`);

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // get user from request
  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    return next(new AppError("User does not exist", 400));
  }

  if (!req.body.password) {
    return next(new AppError("Current password is required", 400));
  }

  // check if past password corret
  if (!(await user.matchPassword(req.body.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // update password
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save({ validateModifiedOnly: true });
  logger.info(`Password changed for user ${user.email}`);

  // get new token
  createSendToken(user, 200, res);
});
