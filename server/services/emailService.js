import transporter from "../config/nodemailer.js";

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: '"LicenseHub" <prabeshshrestha0112@gmail.com>',
    to: email,
    subject: "Verify your account",
    html: `<h2>Your OTP is ${otp}</h2>`,
  });
};