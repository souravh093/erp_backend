import { prisma } from '../../../db/db.config';
import AppError from '../../errors/AppError';
import { TCompanySetupPayload } from './company.interface';

const setupCompany = async (payload: TCompanySetupPayload) => {
  const { userId, ...companyData } = payload;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  const company = await prisma.company.update({
    where: { id: user.companyId },
    data: {
      ...companyData,
      is_setup_complete: true,
    },
  });

  return company;
};

export const companyServices = {
  setupCompany,
};
