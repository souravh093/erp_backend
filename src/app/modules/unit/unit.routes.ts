import { Router } from 'express';
import auth from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import validation from '../../middlewares/validation';
import { unitValidation } from './unit.validation';
import { unitController } from './unit.controller';

const router = Router();

router.post(
  '/',
  auth(),
  requirePermission('manage_units'),
  validation(unitValidation.createUnitValidation),
  unitController.createUnit,
);

router.get('/company/:companyId', auth(), unitController.getUnits);

router.get('/:id', auth(), unitController.getUnitById);

router.put(
  '/:id',
  auth(),
  requirePermission('manage_units'),
  validation(unitValidation.updateUnitValidation),
  unitController.updateUnit,
);

router.delete(
  '/:id',
  auth(),
  requirePermission('manage_units'),
  unitController.deleteUnit,
);

export const unitRoutes = router;
