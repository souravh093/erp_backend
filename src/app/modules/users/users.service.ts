import { prisma } from '../../../db/db.config';
import AppError from '../../errors/AppError';

const getMyPermissionsFromDB = async (userId: string) => {
    console.log(userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, is_Active: true },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (!user.is_Active) {
    throw new AppError(403, 'User is inactive');
  }

  const permissions = await prisma.permission.findMany({
    where: {
      rolePermissions: {
        some: {
          role: {
            userRoles: {
              some: { userId },
            },
          },
        },
      },
    },
    select: { permission: true },
    orderBy: { permission: 'asc' },
  });

  console.log(permissions);

  return permissions.map((item) => item.permission);
};

export const usersServices = {
  getMyPermissionsFromDB,
};
