import { Property, PropertyType } from "@prisma/client";
import prisma from "../config/database";
import { NotFoundError, UnauthorizedError } from "../utils/";

const createPropertyService = () => {
  const createProperty = async (property: Property): Promise<Property> => {
    const landlord = await prisma.user.findUnique({
      where: { id: property.ownerId },
    });
    if (!landlord) {
      throw new NotFoundError("Landlord not found");
    }
    const university = await prisma.university.findUnique({
      where: { id: property.university },
    });
    if (!university) {
      throw new NotFoundError("University not found");
    }
    const newProperty = await prisma.property.create({
      data: {
        bathrooms: property.bathrooms,
        availableFrom: new Date(property.availableFrom),
        availableTo: new Date(property.availableTo),
        bedrooms: property.bedrooms,
        deposit: property.deposit,
        description: property.description,
        location: property.location as any,
        rent: property.rent,
        title: property.title,
        type: property.type,
        university: university.id,
        amenities: property.amenities,
        id: property.id,
        images: property.images,
        ownerId: landlord.id,
      },
    });
    return newProperty;
  };

  const listProperties = async (): Promise<Property[]> => {
    const properties = await prisma.property.findMany({
      include: {
        owner: { select: { id: true, firstName: true, lastName: true } },
        reviews: true,
      },
    });
    return properties;
  };

  const getPropertyById = async (propertyId: string): Promise<Property> => {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true } },
        reviews: true,
      },
    });
    if (!property) {
      throw new NotFoundError("Property not found");
    }
    return property;
  };

  const getPropertiesByUniversity = async (
    universityId: string
  ): Promise<Property[]> => {
    const properties = await prisma.property.findMany({
      where: { university: universityId },
      include: { reviews: true },
    });
    return properties;
  };

  const UpdateProperty = async (
    propty: Partial<Property>,
    ownerId: string,
    propertyId: string
  ): Promise<Property> => {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundError("Property not found");
    }
    if (property.ownerId !== ownerId) {
      throw new UnauthorizedError(
        "You are not authorized to update this property"
      );
    }
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...propty,
        location: propty.location as any,
        availableFrom: new Date(propty.availableFrom!),
        availableTo: new Date(propty.availableTo!),
      },
    });
    return updatedProperty;
  };

  const deleteProperty = async (
    propertyId: string,
    ownerId: string
  ): Promise<Property> => {
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!property) {
      throw new NotFoundError("Property not found");
    }
    if (property.ownerId !== ownerId) {
      throw new UnauthorizedError(
        "You are not authorized to delete this property"
      );
    }
    const deletedProperty = await prisma.property.delete({
      where: { id: propertyId },
    });
    return deletedProperty;
  };

  return {
    createProperty,
    listProperties,
    getPropertyById,
    getPropertiesByUniversity,
    UpdateProperty,
    deleteProperty,
  };
};

export const propertyService = createPropertyService();
