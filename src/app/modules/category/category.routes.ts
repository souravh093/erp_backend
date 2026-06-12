import { Router } from 'express';
import auth from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import validation from '../../middlewares/validation';
import { categoryValidation } from './category.validation';
import { categoryController } from './category.controller';

const router = Router();

router.post(
  '/',
  auth(),
  requirePermission('manage_categories'),
  validation(categoryValidation.createCategoryValidation),
  categoryController.createCategory,
);

router.get('/:companyId', auth(), categoryController.getCategories);

router.get('/:id', auth(), categoryController.getCategoryById);

router.put(
  '/:id',
  auth(),
  requirePermission('manage_categories'),
  validation(categoryValidation.updateCategoryValidation),
  categoryController.updateCategory,
);

router.delete(
  '/:id',
  auth(),
  requirePermission('manage_categories'),
  categoryController.deleteCategory,
);

export const categoryRoutes = router;
