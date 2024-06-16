import { Lodge, LodgeType } from "@prisma/client";
import prisma from "../config/database";
import { NotFoundError, UnauthorizedError } from "../utils/";

const createLodgeService = () => {
  const createLodge = async (lodge: Lodge): Promise<Lodge> => {
    const landlord = await prisma.user.findUnique({
      where: { id: lodge.ownerId },
    });
    if (!landlord) {
      throw new NotFoundError("Landlord not found");
    }
    const university = await prisma.university.findUnique({
      where: { id: lodge.university },
    });
    if (!university) {
      throw new NotFoundError("University not found");
    }
    const newLodge = await prisma.lodge.create({
      data: {
        bathrooms: lodge.bathrooms,
        availableFrom: new Date(lodge.availableFrom),
        availableTo: new Date(lodge.availableTo),
        bedrooms: lodge.bedrooms,
        deposit: lodge.deposit,
        description: lodge.description,
        location: lodge.location as any,
        rent: lodge.rent,
        title: lodge.title,
        type: lodge.type,
        university: university.id,
        amenities: lodge.amenities,
        id: lodge.id,
        images: lodge.images,
        ownerId: landlord.id,
      },
    });
    return newLodge;
  };

  const listLodge = async (): Promise<Lodge[]> => {
    const properties = await prisma.lodge.findMany({
      include: {
        owner: { select: { id: true, firstName: true, lastName: true } },
        reviews: true,
      },
    });
    return properties;
  };

  const getLodgeById = async (lodgeId: string): Promise<Lodge> => {
    const lodge = await prisma.lodge.findUnique({
      where: { id: lodgeId },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true } },
        reviews: true,
      },
    });
    if (!lodge) {
      throw new NotFoundError("lodge not found");
    }
    return lodge;
  };

  const getPropertiesByUniversity = async (
    universityId: string
  ): Promise<Lodge[]> => {
    const properties = await prisma.lodge.findMany({
      where: { university: universityId },
      include: { reviews: true },
    });
    return properties;
  };

  const updateLodge = async (
    loge: Partial<Lodge>,
    ownerId: string,
    lodgeId: string
  ): Promise<Lodge> => {
    const lodge = await prisma.lodge.findUnique({
      where: { id: lodgeId },
    });
    if (!lodge) {
      throw new NotFoundError("lodge not found");
    }
    if (lodge.ownerId !== ownerId) {
      throw new UnauthorizedError(
        "You are not authorized to update this lodge"
      );
    }
    const updatedLodge = await prisma.lodge.update({
      where: { id: lodgeId },
      data: {
        ...loge,
        location: loge.location as any,
        availableFrom: new Date(loge.availableFrom!),
        availableTo: new Date(loge.availableTo!),
      },
    });
    return updatedLodge;
  };

  const deleteLodge = async (
    lodgeId: string,
    ownerId: string
  ): Promise<Lodge> => {
    const lodge = await prisma.lodge.findUnique({
      where: { id: lodgeId },
    });
    if (!lodge) {
      throw new NotFoundError("lodge not found");
    }
    if (lodge.ownerId !== ownerId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this lodge"
      );
    }
    const deletedLodge = await prisma.lodge.delete({
      where: { id: lodgeId },
    });
    return deletedLodge;
  };

  return {
    createLodge,
    listLodge,
    getLodgeById,
    getPropertiesByUniversity,
    updateLodge,
    deleteLodge,
  };
};

export const lodgeService = createLodgeService();
