import nodemailer from "nodemailer";
import {
  EmailPasswordResetPayload,
  EmailVerificationPayload,
  PasswordResetEmailOptions,
  VerificationEmailOptions,
} from "../types/";
import { generateToken } from "./jwt.utils";
import { config } from "../config";

/**
 * Sends an email verification email to the specified email address.
 * @param email - The email address to send the verification email to.
 * @param options - Additional options for the verification email.
 */
export async function sendVerificationEmail(
  email: string,
  options?: VerificationEmailOptions
): Promise<void> {
  // Create a nodemailer transporter using SMTP configuration
  const transporter = nodemailer.createTransport({
    // host: config.email.smtp.host,
    // port: config.email.smtp.port,
    // secure: config.email.smtp.secure,
    service: "gmail",
    auth: {
      user: config.email.smtp.user,
      pass: config.email.smtp.password,
    },
  });

  // Generate a verification token
  const verificationToken: string = generateToken(
    {
      email,
      type: "emailVerification",
    },
    "1d"
  ); // Token expires in 1 day

  // Prepare the email payload
  const emailPayload: EmailVerificationPayload = {
    from: config.email.from,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <h1>Verify Your Email Address</h1>
      <p>Please click the following link to verify your email address:</p>
      <a href="http://your-frontend-url.com/verify-email?token=${verificationToken}">Verify Email</a>

      <a href="${config.app.baseUrl}/verify-email?token=${verificationToken}">Verify Email</a>
      <p>If you did not request this email, please ignore it.</p>
    `,
  };

  // Merge the email payload with additional options (if provided)
  const mailOptions = { ...emailPayload, ...options };

  // Send the email
  await transporter.sendMail(mailOptions);
}

/**
 * Sends a password reset email to the specified email address.
 * @param email - The email address to send the password reset email to.
 * @param options - Additional options for the password reset email.
 */
export async function sendPasswordResetEmail(
  email: string,
  options?: PasswordResetEmailOptions
): Promise<void> {
  // Create a nodemailer transporter using SMTP configuration
  const transporter = nodemailer.createTransport({
    host: config.email.smtp.host,
    port: config.email.smtp.port,
    secure: config.email.smtp.secure,
    auth: {
      user: config.email.smtp.user,
      pass: config.email.smtp.password,
    },
  });

  // Generate a password reset token
  const passwordResetToken: string = generateToken(
    {
      email,
      type: "passwordReset",
    },
    "1h"
  ); // Token expires in 1 hour

  // Prepare the email payload
  const emailPayload: EmailPasswordResetPayload = {
    from: config.email.from,
    to: email,
    subject: "Reset Your Password",
    html: `
      <h1>Reset Your Password</h1>
      <p>You have requested to reset your password. Please click the following link to reset your password:</p>
      <a href="${config.app.baseUrl}/reset-password?token=${passwordResetToken}">Reset Password</a>
      <p>If you did not request this email, please ignore it.</p>
    `,
  };

  // Merge the email payload with additional options (if provided)
  const mailOptions = { ...emailPayload, ...options };

  // Send the email
  await transporter.sendMail(mailOptions);
}
