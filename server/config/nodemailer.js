import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "192.178.158.108",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;