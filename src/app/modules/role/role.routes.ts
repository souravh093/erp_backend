import { Router } from 'express';
import auth from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import validation from '../../middlewares/validation';
import { roleValidation } from './role.validation';
import { roleController } from './role.controller';

const router = Router();

router.post(
  '/',
  auth(),
  requirePermission('manage_roles'),
  validation(roleValidation.createRole),
  roleController.createRole,
);

router.post(
  '/assign',
  auth(),
  requirePermission('manage_roles'),
  roleController.assignRoleToUser,
);

router.get(
  '/company/:companyId',
  auth(),
  requirePermission('manage_roles'),
  roleController.getAllRolesOfCompany,
);

router.get(
  '/:roleId',
  auth(),
  requirePermission('manage_roles'),
  roleController.getRoleById,
);

router.put(
  '/:roleId',
  auth(),
  requirePermission('manage_roles'),
  validation(roleValidation.createRole),
  roleController.updateRoleById,
);

router.delete(
  '/:roleId',
  auth(),
  requirePermission('manage_roles'),
  roleController.deleteRoleById,
);


export const roleRoutes = router;