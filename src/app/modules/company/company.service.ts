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

  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.update({
      where: { id: user.companyId },
      data: {
        ...companyData,
        is_setup_complete: true,
      },
    });

    const defaultBranch = await tx.branch.create({
      data: {
        name: `${company.name} HQ`,
        address: companyData.address || company.address || null,
        phone: companyData.phone || company.phone || null,
        email: companyData.email || company.email || null,
        companyId: company.id,
      },
    });

    await tx.userBranch.create({
      data: {
        userId: user.id,
        branchId: defaultBranch.id,
      },
    });

    const superAdminRole = await tx.role.create({
      data: {
        role_name: 'super-admin',
        companyId: company.id,
      },
    });

    const systemPermissions = await tx.permission.findMany({
      select: { id: true },
    });

    if (systemPermissions.length > 0) {
      await tx.rolePermission.createMany({
        data: systemPermissions.map((perm) => ({
          roleId: superAdminRole.id,
          permissionId: perm.id,
        })),
        skipDuplicates: true,
      });
    }

    await tx.userRole.create({
      data: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    });

    return company;
  });

  return result;
};


export const companyServices = {
  setupCompany,
};
