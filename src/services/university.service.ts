import { University } from "@prisma/client";
import { NotFoundError, UnauthorizedError } from "../utils/";
import prisma from "../config/database";

const createUniversityService = () => {
  const addUniversity = async (
    name: string,
    location: { type: "Point"; coordinates: [number, number] },
    description?: string,
    website?: string
  ): Promise<University> => {
    const existingUniversity = await prisma.university.findUnique({
      where: { name },
    });
    if (existingUniversity) {
      throw new Error("University with this name already exists");
    }
    const newUniversity = await prisma.university.create({
      data: {
        name,
        location,
      },
    });
    return newUniversity;
  };

  const listUniversities = async (): Promise<University[]> => {
    const universities = await prisma.university.findMany();
    return universities;
  };

  const getUniversityById = async (
    universityId: string
  ): Promise<University> => {
    const university = await prisma.university.findUnique({
      where: { id: universityId },
    });
    if (!university) {
      throw new NotFoundError("University not found");
    }
    return university;
  };

  const updateUniversity = async (
    university: Partial<University>,
    universityId: string
  ): Promise<University> => {
    const existingUniversity = await prisma.university.findUnique({
      where: { id: universityId },
    });
    if (!existingUniversity) {
      throw new NotFoundError("University not found");
    }
    const updatedUniversity = await prisma.university.update({
      where: { id: universityId },
      data: {
        ...university,
        location: university.location as any,
      },
    });
    return updatedUniversity;
  };

  const deleteUniversity = async (
    universityId: string
  ): Promise<University> => {
    const existingUniversity = await prisma.university.findUnique({
      where: { id: universityId },
    });
    if (!existingUniversity) {
      throw new NotFoundError("University not found");
    }
    const deletedUniversity = await prisma.university.delete({
      where: { id: universityId },
    });
    return deletedUniversity;
  };

  // Return the object with all the methods
  return {
    addUniversity,
    listUniversities,
    getUniversityById,
    updateUniversity,
    deleteUniversity,
  };
};

export const universityService = createUniversityService();
