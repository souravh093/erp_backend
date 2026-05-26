import { NextFunction, Request, Response } from "express";

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
      });
    }
    next();
  };
}