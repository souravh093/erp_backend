import { Router } from 'express';
import auth from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import validation from '../../middlewares/validation';
import { BranchValidation } from './branch.validation';
import { branchController } from './branch.controller';

const router = Router();

router.post(
  '/',
  auth(),
  requirePermission('manage_branch'),
  validation(BranchValidation.createBranchSchema),
  branchController.createBranch,
);

router.post(
  '/assign/:branchId/user/:userId',
  auth(),
  requirePermission('manage_branch'),
  branchController.assignUserToBranch,
);

router.get(
  '/company/:companyId',
  auth(),
  requirePermission('manage_branch'),
  branchController.getBranches,
);

router.get(
  '/:id',
  auth(),
  requirePermission('manage_branch'),
  branchController.getBranchById,
);

router.put(
  '/:id',
  auth(),
  requirePermission('manage_branch'),
  validation(BranchValidation.updateBranchSchema),
  branchController.updateBranch,
);

router.delete(
  '/:id',
  auth(),
  requirePermission('manage_branch'),
  branchController.deleteBranch,
);

export const branchRoutes = router;