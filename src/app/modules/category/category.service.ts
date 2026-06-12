import { Category } from '../../../../generated/prisma/client';
import { prisma } from '../../../db/db.config';

const createCategoryIntoDB = async (payload: Category) => {
  const existingCategoryName = await prisma.category.findFirst({
    where: {
      name: payload.name,
      companyId: payload.companyId,
    },
  });

  if (existingCategoryName) {
    throw new Error('Category with this name already exists');
  }

  const response = await prisma.category.create({
    data: payload,
  });

  return response;
};

const getCategoriesFromDB = async (companyId: string) => {
  const response = await prisma.category.findMany({
    where: { companyId },
    include: {
      subCategories: true,
    },
  });

  return response;
};

const getCategoryByIdFromDB = async (id: string) => {
  const response = await prisma.category.findUnique({
    where: { id },
    include: {
      subCategories: true,
    },
  });

  return response;
};

const updateCategoryFromDB = async (id: string, payload: Partial<Category>) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  if (payload.name) {
    if (payload.name !== existingCategory.name) {
      const existingCategoryName = await prisma.category.findFirst({
        where: {
          name: payload.name,
          companyId: existingCategory.companyId,
        },
      });

      if (existingCategoryName) {
        throw new Error('Category with this name already exists');
      }
    }
  }

  const response = await prisma.category.update({
    where: { id },
    data: payload,
  });

  return response;
};

const deleteCategoryFromDB = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error('Category not found');
  }

  await prisma.category.delete({
    where: { id },
  });
};

export const categoryService = {
  createCategoryIntoDB,
  getCategoriesFromDB,
  getCategoryByIdFromDB,
  updateCategoryFromDB,
  deleteCategoryFromDB,
};
