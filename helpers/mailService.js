const nodemailer = require("nodemailer");
const { OTPMailTem } = require("./emailTemplate");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: "kaushik.rajkamal@gmail.com",
    pass: "ssfn mggc kcfn gpba",
  },
});

const mailSender = async ({ email, subject, otp }) => {
  await transporter.sendMail({
    from: '"TaskManager" <team@taskmanager.com>', // sender address
    to: email, // list of recipients
    subject: subject, // subject line
    html: OTPMailTem(otp),
  });
};

module.exports = { mailSender };
