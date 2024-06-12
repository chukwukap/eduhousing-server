import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";
import { ValidationError } from "./";

const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Generates a JSON Web Token (JWT) with the provided payload and expiration time.
 * @param payload - The payload to be included in the JWT.
 * @param expiresIn - The expiration time for the JWT (e.g., '1h', '7d').
 * @returns The generated JWT token.
 */

export function generateToken(payload: JwtPayload, expiresIn: string): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verifies and decodes a JSON Web Token (JWT).
 * @param token - The JWT token to be verified.
 * @returns The decoded JWT payload.
 * @throws ValidationError if the token is invalid or expired.
 */
export function verifyToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new ValidationError("Invalid or expired token");
  }
}

/**
 * Checks if a JSON Web Token (JWT) is valid and not expired.
 * @param token - The JWT token to be checked.
 * @returns `true` if the token is valid and not expired, `false` otherwise.
 */
export function isTokenValid(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Extracts the payload from a JSON Web Token (JWT).
 * @param token - The JWT token to extract the payload from.
 * @returns The decoded JWT payload.
 * @throws ValidationError if the token is invalid or expired.
 */
export function getPayloadFromToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new ValidationError("Invalid or expired token");
  }
}

/**
 * Decodes a JSON Web Token (JWT) without verifying its signature.
 * @param token - The JWT token to be decoded.
 * @returns The decoded JWT payload.
 * @throws ValidationError if the token is malformed or invalid.
 */
export function decodeToken(token: string): JwtPayload {
  try {
    const decoded = jwt.decode(token) as JwtPayload;
    if (!decoded) {
      throw new ValidationError("Invalid token");
    }
    return decoded;
  } catch (err) {
    throw new ValidationError("Invalid token");
  }
}
