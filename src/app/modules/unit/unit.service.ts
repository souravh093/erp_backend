import { prisma } from '../../../db/db.config';
import AppError from '../../errors/AppError';

type CreateUnitPayload = {
  name: string;
  conversion_base_unit?: string;
  companyId: string;
};

type UpdateUnitPayload = {
  name?: string;
  conversion_base_unit?: string;
};

const createUnitIntoDB = async (payload: CreateUnitPayload) => {
  const company = await prisma.company.findUnique({
    where: { id: payload.companyId },
    select: { id: true },
  });

  if (!company) {
    throw new AppError(404, 'Company not found');
  }

  const existingUnit = await prisma.unit.findFirst({
    where: {
      name: payload.name,
      companyId: payload.companyId,
    },
  });

  if (existingUnit) {
    throw new AppError(409, 'Unit with this name already exists');
  }

  const response = await prisma.unit.create({
    data: payload,
  });

  return response;
};

const getUnitsFromDB = async (companyId: string) => {
  const response = await prisma.unit.findMany({
    where: { companyId },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return response;
};

const getUnitByIdFromDB = async (id: string) => {
  const response = await prisma.unit.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!response) {
    throw new AppError(404, 'Unit not found');
  }

  return response;
};

const updateUnitFromDB = async (id: string, payload: UpdateUnitPayload) => {
  const existingUnit = await prisma.unit.findUnique({
    where: { id },
  });

  if (!existingUnit) {
    throw new AppError(404, 'Unit not found');
  }

  if (payload.name && payload.name !== existingUnit.name) {
    const sameNameUnit = await prisma.unit.findFirst({
      where: {
        name: payload.name,
        companyId: existingUnit.companyId,
      },
    });

    if (sameNameUnit) {
      throw new AppError(409, 'Unit with this name already exists');
    }
  }

  const response = await prisma.unit.update({
    where: { id },
    data: payload,
  });

  return response;
};

const deleteUnitFromDB = async (id: string) => {
  const existingUnit = await prisma.unit.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  if (!existingUnit) {
    throw new AppError(404, 'Unit not found');
  }

  if (existingUnit._count.products > 0) {
    throw new AppError(409, 'Unit is already assigned to products');
  }

  await prisma.unit.delete({
    where: { id },
  });
};

export const unitService = {
  createUnitIntoDB,
  getUnitsFromDB,
  getUnitByIdFromDB,
  updateUnitFromDB,
  deleteUnitFromDB,
};
