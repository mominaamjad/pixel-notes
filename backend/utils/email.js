const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("🔍 EMAIL CONFIG:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USERNAME,
  });
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD, // ✅ Correct key
    },
  });

  // define email options
  const mailOptions = {
    from: "Pixel Notes <mominaamjad@pixelnotes.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
