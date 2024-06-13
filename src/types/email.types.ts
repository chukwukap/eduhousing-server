/**
 * Represents the payload for an email verification email.
 */
export interface EmailVerificationPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

/**
 * Represents additional options for a verification email.
 */
export interface VerificationEmailOptions {
  text?: string;
  attachments?: Attachment[];
  // Add any other options specific to your application
}

/**
 * Represents the payload for a password reset email.
 */
export interface EmailPasswordResetPayload {
  from: string;
  to: string;
  subject: string;
  html: string;
}

/**
 * Represents additional options for a password reset email.
 */
export interface PasswordResetEmailOptions {
  text?: string;
  attachments?: Attachment[];
  // Add any other options specific to your application
}

/**
 * Represents an email attachment.
 */
export interface Attachment {
  filename: string;
  content: Buffer;
  encoding?: string;
  contentType?: string;
}
