import resend from "../config/resend.js";

export const sendOTPEmail = async (email, otp) => {
  const { data, error } = await resend.emails.send({
    from: "Savari <otp@prabeshshrestha1.com.np>", 
    to: ["prabeshshrestha0112@gmail.com"],
    subject: "Verify your account",
    html: `<h2>Your OTP is <strong>${otp}</strong></h2>`,
  });

  if (error) {
    throw new Error(`Resend Error: ${error.message}`);
  }

  return data;
};