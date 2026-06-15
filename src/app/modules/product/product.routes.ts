import { Router } from 'express';
import auth from '../../middlewares/auth';
import { requirePermission } from '../../middlewares/requirePermission';
import validation from '../../middlewares/validation';
import { productValidation } from './product.validation';
import { productController } from './product.controller';

const router = Router();

router.post(
  '/',
  auth(),
  requirePermission('create_product'),
  validation(productValidation.createProductSchema),
  productController.createProduct,
);


export const ProductRoute = router;