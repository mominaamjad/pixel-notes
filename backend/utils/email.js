const nodemailer = require("nodemailer");
const { SENDER_NAME, SENDER_EMAIL } = require("../constants");

const sendEmail = async (options) => {
  // create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // define email options
  const mailOptions = {
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
