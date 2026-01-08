import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.ZOHO_EMAIL,
    pass: process.env.ZOHO_PASSWORD,
  },
  connectionTimeout: 10000, // ⏱️ 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});
