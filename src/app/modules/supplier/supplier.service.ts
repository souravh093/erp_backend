import { Supplier } from '../../../../generated/prisma/client';
import { prisma } from '../../../db/db.config';
import AppError from '../../errors/AppError';

const createSupplierIntoDB = async (payload: Supplier) => {
  const isCompanyExists = await prisma.company.findUnique({
    where: { id: payload.companyId },
    select: { id: true },
  });

  if (!isCompanyExists) {
    throw new AppError(404, 'Company not found');
  }

  const response = await prisma.supplier.create({
    data: payload,
  });

  return response;
};

const updateSupplierIntoDB = async (
  supplierId: string,
  payload: Partial<Supplier>,
) => {
  const isSupplierExists = await prisma.supplier.findUnique({
    where: { id: supplierId },
    select: { id: true },
  });

  if (!isSupplierExists) {
    throw new AppError(404, 'Supplier not found');
  }

  const response = await prisma.supplier.update({
    where: { id: supplierId },
    data: payload,
  });

  return response;
};

export const supplierService = {
  createSupplierIntoDB,
  updateSupplierIntoDB,
};
