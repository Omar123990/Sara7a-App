import nodemailer from "nodemailer";
import { env } from "../../config/env.service.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.emailService,
    pass: env.emailPassword,
  },
});
export const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: "sara7app@gmail.com",
    to,
    subject,
    html,
  });
};
