import { Router } from 'express';
import auth from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import validation from '../../middlewares/validation';
import { subCategoryValidation } from './subCategory.validation';
import { subCategoryController } from './subCategory.controller';

const router = Router();

router.post(
  '/',
  auth(),
  requirePermission('manage_categories'),
  validation(subCategoryValidation.createSubCategorySchema),
  subCategoryController.createSubCategory,
);

router.put(
  '/:id',
  auth(),
  requirePermission('manage_categories'),
  validation(subCategoryValidation.updateSubCategorySchema),
  subCategoryController.updateSubCategory,
);

router.delete(
  '/:id',
  auth(),
  requirePermission('manage_categories'),
  subCategoryController.deleteSubCategory,
);

export const subCategoryRoutes = router;
