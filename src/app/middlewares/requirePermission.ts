import { NextFunction, Request, Response } from 'express';
import { prisma } from '../../db/db.config';
import { Permission } from '../constant/permissions';

export function requirePermission(permission: Permission) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id as string | undefined;

      if (!userId) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      const hasPermission = await prisma.user.findFirst({
        where: {
          id: userId,
          userRoles: {
            some: {
              role: {
                rolePermissions: {
                  some: {
                    permission: {
                      permission,
                    },
                  },
                },
              },
            },
          },
        },
        select: { id: true },
      });

      if (!hasPermission) {
        return res.status(403).json({
          message: 'Insufficient permissions',
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
