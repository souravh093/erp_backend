import { Branch } from '../../../../generated/prisma/client';
import { prisma } from '../../../db/db.config';

const createBranchIntoDB = async (payload: Branch) => {
  const isCompanyExist = await prisma.company.findUnique({
    where: { id: payload.companyId },
  });

  if (!isCompanyExist) {
    throw new Error('Company not found');
  }

  const response = await prisma.branch.create({
    data: payload,
  });

  return response;
};

const getBranchesFromDB = async (companyId: string) => {
  const response = await prisma.branch.findMany({
    where: {
      companyId,
    },
  });

  return response;
};

const getBranchByIdFromDB = async (id: string) => {
  const response = await prisma.branch.findUnique({
    where: { id },
  });

  if (!response) {
    throw new Error('Branch not found');
  }

  return response;
};

const updateBranchIntoDB = async (id: string, payload: Partial<Branch>) => {
  const isBranchExist = await prisma.branch.findUnique({
    where: { id },
  });

  if (!isBranchExist) {
    throw new Error('Branch not found');
  }

  const response = await prisma.branch.update({
    where: { id },
    data: payload,
  });

  return response;
};

const deleteBranchFromDB = async (id: string) => {
  const isBranchExist = await prisma.branch.findUnique({
    where: { id },
  });

  if (!isBranchExist) {
    throw new Error('Branch not found');
  }

  await prisma.branch.delete({
    where: { id },
  });
};

const assignUserToBranchInDB = async (branchId: string, userId: string) => {
  const isBranchExist = await prisma.branch.findUnique({
    where: { id: branchId },
  });

  if (!isBranchExist) {
    throw new Error('Branch not found');
  }

  const isUserExist = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!isUserExist) {
    throw new Error('User not found');
  }

  const response = await prisma.userBranch.create({
    data: {
      branchId,
      userId,
    },
  });

  return response;
};



export const branchService = {
  createBranchIntoDB,
  getBranchesFromDB,
  getBranchByIdFromDB,
  updateBranchIntoDB,
  deleteBranchFromDB,
  assignUserToBranchInDB,
};
