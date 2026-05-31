import { prisma } from '../../../db/db.config';
import { TRolePayload } from './role.type';

const createRoleIntoDB = async (payload: TRolePayload) => {
  const response = await prisma.$transaction(async (prisma) => {
    const sameNameRoleInCompany = await prisma.role.findFirst({
      where: {
        role_name: payload.role_name,
        companyId: payload.companyId,
      },
    });

    if (sameNameRoleInCompany) {
      throw new Error('Role with the same name already exists in the company');
    }

    const role = await prisma.role.create({
      data: {
        role_name: payload.role_name,
        companyId: payload.companyId,
        rolePermissions: {
          createMany: {
            data: payload.permissions.map((permissionId) => ({
              permissionId,
            })),
          },
        },
      },
    });

    return role;
  });

  return response;
};

const getAllRolesOfCompanyFromDB = async (companyId: string) => {
  const response = await prisma.role.findMany({
    where: {
      companyId,
    },
    include: {
      rolePermissions: {
        select: {},
        include: {
          permission: true,
        },
      },
      userRoles: {
        select: {},
        include: {
          user: true,
        },
      },
    },
  });

  return response;
};

const getRoleByIdFromDB = async (roleId: string) => {
  const response = await prisma.role.findUnique({
    where: {
      id: roleId,
    },
    include: {
      rolePermissions: {
        select: {},
        include: {
          permission: true,
        },
      },
      userRoles: {
        include: {
          user: true,
        },
      },
    },
  });

  return response;
};

const deleteRoleByIdFromDB = async (roleId: string) => {
  const response = await prisma.role.delete({
    where: {
      id: roleId,
    },
  });

  return response;
};

const updateRoleByIdFromDB = async (roleId: string, payload: TRolePayload) => {
  const response = await prisma.$transaction(async (prisma) => {
    const sameNameRoleInCompany = await prisma.role.findFirst({
      where: {
        role_name: payload.role_name,
        companyId: payload.companyId,
        NOT: {
          id: roleId,
        },
      },
    });

    if (sameNameRoleInCompany) {
      throw new Error('Role with the same name already exists in the company');
    }

    const role = await prisma.role.update({
      where: {
        id: roleId,
      },
      data: {
        role_name: payload.role_name,
        companyId: payload.companyId,
        rolePermissions: {
          deleteMany: {},
          createMany: {
            data: payload.permissions.map((permissionId) => ({
              permissionId,
            })),
          },
        },
      },
    });

    return role;
  });

  return response;
};

const assignRoleToUserInDB = async (roleId: string, userId: string) => {
  const response = await prisma.userRole.create({
    data: {
      roleId,
      userId,
    },
  });

  return response;
};

export const roleService = {
  createRoleIntoDB,
  getAllRolesOfCompanyFromDB,
  getRoleByIdFromDB,
  deleteRoleByIdFromDB,
  updateRoleByIdFromDB,
  assignRoleToUserInDB,
};
