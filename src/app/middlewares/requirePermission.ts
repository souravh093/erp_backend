import { NextFunction, Request, Response } from "express";
import { Permission } from "../constant/permissions";

export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
      });
    }
    next();
  };
}