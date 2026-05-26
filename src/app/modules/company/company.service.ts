import { prisma } from '../../../db/db.config';
import AppError from '../../errors/AppError';
import { TCompanySetupPayload } from './company.interface';

const setupCompany = async (payload: TCompanySetupPayload) => {
  const { userId, ...companyData } = payload;

  // Step 1: Ensure user exists and retrieve their company ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  // Step 2: Execute transactional setup to ensure atomic consistency
  const result = await prisma.$transaction(async (tx) => {
    // 2.1 Update Company Profile and toggle is_setup_complete
    const company = await tx.company.update({
      where: { id: user.companyId },
      data: {
        ...companyData,
        is_setup_complete: true,
      },
    });

    // 2.2 Create a Default Branch for the company
    const defaultBranch = await tx.branch.create({
      data: {
        name: `${company.name} HQ`,
        address: companyData.address || company.address || null,
        phone: companyData.phone || company.phone || null,
        email: companyData.email || company.email || null,
        companyId: company.id,
      },
    });

    // 2.3 Associate the User with the Default Branch
    await tx.userBranch.create({
      data: {
        userId: user.id,
        branchId: defaultBranch.id,
      },
    });

    // 2.4 Create the "super-admin" Role for the Company
    // Note: If you face unique constraint issues due to global role_name uniqueness in schema.prisma,
    // ensure to update schema.prisma as suggested in the documentation.
    const superAdminRole = await tx.role.create({
      data: {
        role_name: 'super-admin',
        companyId: company.id,
      },
    });

    // 2.5 Query all global system permissions
    const systemPermissions = await tx.permission.findMany({
      select: { id: true },
    });

    if (systemPermissions.length > 0) {
      // 2.6 Map all permissions to the super-admin role
      await tx.rolePermission.createMany({
        data: systemPermissions.map((perm) => ({
          roleId: superAdminRole.id,
          permissionId: perm.id,
        })),
        skipDuplicates: true,
      });
    }

    // 2.7 Assign the "super-admin" role to the setting-up user
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
