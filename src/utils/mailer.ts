import nodemailer from 'nodemailer';
import { render } from "@react-email/render";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com", 
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Your App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};
