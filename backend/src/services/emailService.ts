import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

const emailHost = process.env.EMAIL_HOST;
const emailPort = Number(process.env.EMAIL_PORT || 587);
const emailSecure = process.env.EMAIL_SECURE === 'true';
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailFrom = process.env.EMAIL_FROM;

if (!emailHost || !emailUser || !emailPassword || !emailFrom) {
  throw new Error(
    'Email configuration is incomplete. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASSWORD, and EMAIL_FROM.'
  );
}

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailSecure,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

export async function verifyEmailConnection(): Promise<void> {
  await transporter.verify();
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<void> {
  await transporter.sendMail({
    from: emailFrom,
    to,
    subject,
    html,
  });
}
