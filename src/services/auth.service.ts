import bcrypt from "bcrypt";
import prisma from "../config/database";
import { AuthenticationError, ValidationError } from "../utils/";
import { User, UserRole } from "@prisma/client";
import { verifyToken } from "../utils/";

const createAuthService = () => {
  const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  return {
    /**
     * Register a new user.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @param firstName - The user's first name.
     * @param lastName - The user's last name.
     * @returns The created user object.
     */
    registerUser: async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      university: string
    ): Promise<User> => {
      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          role: UserRole.PROPERTY_OWNER,
          lastName,
          verified: false, // Set verified to false initially
        },
      });

      return user;
    },

    /**
     * Login a user.
     * @param email - The user's email address.
     * @param password - The user's password.
     * @returns The authenticated user object.
     */
    loginUser: async (email: string, password: string): Promise<User> => {
      // Find the user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AuthenticationError("Invalid email or password.");
      }

      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError("Invalid email or password.");
      }

      // If the user is not verified, throw an error
      if (!user.verified) {
        throw new AuthenticationError(
          "Please verify your email address before logging in."
        );
      }

      return user;
    },

    /**
     * Reset a user's password.
     * @param token - The password reset token.
     * @param newPassword - The new password.
     */
    resetPassword: async (
      token: string,
      newPassword: string
    ): Promise<void> => {
      // Verify the token and extract the user ID
      const { userId } = verifyToken(token);

      // Find the user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new ValidationError("Invalid token or user not found.");
      }

      // Hash the new password
      const hashedPassword = await hashPassword(newPassword);

      // Update the user's password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });
    },

    /**
     * Verify a user's email address.
     * @param token - The email verification token.
     */
    verifyEmail: async (token: string): Promise<void> => {
      // Verify the token and extract the user ID
      const { userId } = verifyToken(token);

      // Find the user
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new ValidationError("Invalid token or user not found.");
      }

      // Update the user's verification status
      await prisma.user.update({
        where: { id: userId },
        data: { verified: true },
      });
    },
  };
};

export const authService = createAuthService();
