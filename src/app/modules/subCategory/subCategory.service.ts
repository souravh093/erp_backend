import { SubCategory } from '../../../../generated/prisma/client';
import { prisma } from '../../../db/db.config';

const createSubCategoryIntoDB = async (payload: SubCategory) => {
  const existingSubCategory = await prisma.subCategory.findFirst({
    where: {
      categoryId: payload.categoryId,
      name: payload.name,
    },
  });

  if (existingSubCategory) {
    throw new Error(
      'SubCategory with the same name already exists in this category',
    );
  }

  const response = await prisma.subCategory.create({
    data: payload,
  });

  return response;
};

const updateSubCategoryIntoDB = async (
  id: string,
  payload: Partial<SubCategory>,
) => {
  const response = await prisma.subCategory.update({
    where: {
      id,
    },
    data: payload,
  });

  return response;
};

const deleteSubCategoryFromDB = async (id: string) => {
  const response = await prisma.subCategory.delete({
    where: {
      id,
    },
  });

  return response;
};

export const subCategoryService = {
  createSubCategoryIntoDB,
  updateSubCategoryIntoDB,
  deleteSubCategoryFromDB,
};
