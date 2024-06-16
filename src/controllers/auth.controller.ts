import { Request, Response } from "express-serve-static-core";
import { authService } from "../services/auth.service";
import { ValidationError } from "../utils/";
import { Prisma } from "@prisma/client";
import { NextFunction } from "express-serve-static-core";
import { userService } from "../services/";
import { generateToken } from "../utils/jwt.utils";
import { sendPasswordResetEmail, sendVerificationEmail } from "../utils/";
import prisma from "../config/database";

const createAuthController = () => {
  return {
    /**
     * Register a new user.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    registerUser: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { firstName, lastName, email, password, university } = req.body;
        // Validate input
        if (!email || !password || !firstName || !lastName || !university) {
          return res.status(400).json({
            error: false,
            message: "missing required fields",
          });
        }

        // dev purpose only
        // await prisma.user.deleteMany();

        // Check if the user already exists
        const existingUser = await userService.getUserByEmail(email);
        if (existingUser) {
          return res.status(201).json({
            message: `user with email: ${email} already existss`,
          });
        }

        console.log(
          "_________________--creating user--________________________"
        );

        // Create a new user
        const user = await authService.registerUser(
          email,
          password,
          firstName,
          lastName,
          university
        );

        // Generate a verification token
        if (user) {
          const verificationToken = generateToken({ userId: user.id }, "1h");

          // Send a verification email
          await sendVerificationEmail(email, {
            subject: "Verify your email",

            text: `Hello, please verify your email by clicking the following link: ${process.env.BASE_URL}/verify-email?token=${verificationToken}`,
          });

          res.status(201).json({
            user,
            message:
              "User registered successfully. Please check your email to verify your account.",
          });
        }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          // Handle Prisma-specific errors here
          if (error.code === "P2002") {
            return res
              .status(409)
              .json({ error: "Unique constraint violation" });
          }
        }
        return next(error);
      }
    },

    /**
     * Login a user.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    loginUser: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
          throw new ValidationError("Please provide email and password.");
        }

        // Check if the user exists and credentials are valid
        const accessToken = await authService.loginUser(email, password);

        res.status(200).json({ accessToken });
      } catch (error) {
        next(error);
      }
    },

    /**
     * Logout a user.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    logoutUser: async (_: Request, res: Response, next: NextFunction) => {
      try {
        // Implement any necessary logout logic here, such as invalidating the access token
        res.status(200).json({ message: "User logged out successfully." });
      } catch (error) {
        next(error);
      }
    },

    /**
     * Request a password reset.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    requestPasswordReset: async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const { email } = req.body;

        // Validate input
        if (!email) {
          throw new ValidationError("Please provide an email address.");
        }

        // Check if the user exists
        const user = await userService.getUserByEmail(email);
        if (!user) {
          throw new ValidationError("No user found with this email address.");
        }

        // Generate a password reset token
        // const resetToken = generateToken({ userId: user.id }, "1h");

        // Send a password reset email
        await sendPasswordResetEmail(email, {});

        res.status(200).json({
          message: "Password reset instructions have been sent to your email.",
        });
      } catch (error) {
        next(error);
      }
    },

    /**
     * Reset a user's password.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req.params;
        const { newPassword } = req.body;

        // Validate input
        if (!token || !newPassword) {
          throw new ValidationError(
            "Please provide a valid token and new password."
          );
        }

        // Verify the token and reset the user's password
        await authService.resetPassword(token, newPassword);

        res.status(200).json({ message: "Password reset successfully." });
      } catch (error) {
        next(error);
      }
    },

    /**
     * Verify a user's email address.
     * @param req - The Express request object.
     * @param res - The Express response object.
     * @param next - The Express next middleware function.
     */
    verifyEmail: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { token } = req.params;

        // Validate input
        if (!token) {
          throw new ValidationError("Please provide a valid token.");
        }

        // Verify the user's email
        await authService.verifyEmail(token);

        res.status(200).json({ message: "Email verified successfully." });
      } catch (error) {
        next(error);
      }
    },
  };
};

export const authController = createAuthController();
