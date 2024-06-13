import { User } from "@prisma/client";
import prisma from "../config/database";
import { NotFoundError } from "../utils/";

const createUserService = () => {
  /**
   * Get a user's profile by their ID.
   * @param userId - The user's ID.
   * @returns The user's profile.
   * @throws NotFoundError if the user is not found.
   */
  const getUserProfileById = async (userId: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id: userId } });
  };

  /**
   * Update a user's profile.
   * @param userId - The user's ID.
   * @param data - The data to update the user's profile with.
   * @returns The updated user's profile.
   * @throws NotFoundError if the user is not found.
   */
  const updateUserProfile = async (
    userId: string,
    data: Partial<User>
  ): Promise<User> => {
    return prisma.user.update({ where: { id: userId }, data });
  };

  const deleteUserProfile = async (userId: string): Promise<User> => {
    const deletedUser = await prisma.user.delete({ where: { id: userId } });
    return deletedUser;
  };

  /**
   * Get a user by email.
   * @param email - The email of the user.
   * @returns The user object or null if not found.
   */
  const getUserByEmail = async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
  };

  /**
   * Get a user by ID.
   * @param userId - The ID of the user.
   * @returns The user object or null if not found.
   */
  const getUserById = async (userId: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id: userId } });
  };

  /**
   * Get all users.
   * @returns An array of user objects.
   */
  const listUsers = async (): Promise<User[]> => {
    return prisma.user.findMany();
  };

  /**
   * Update a user.
   * @param userId - The ID of the user to update.
   * @param data - The data to update (firstName, lastName, email, role).
   * @returns The updated user object or null if not found.
   */
  const updateUser = async (
    userId: string,
    data: Partial<User>
  ): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    return prisma.user.update({ where: { id: userId }, data });
  };

  /**
   * Delete a user.
   * @param userId - The ID of the user to delete.
   * @returns The deleted user object or null if not found.
   */
  const deleteUser = async (userId: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundError(`User with ID ${userId} not found`);
    }
    return prisma.user.delete({ where: { id: userId } });
  };

  // Return the object with all the methods
  return {
    getUserProfileById,
    updateUserProfile,
    deleteUserProfile,
    getUserByEmail,
    getUserById,
    listUsers,
    updateUser,
    deleteUser,
  };
};

export const userService = createUserService();
