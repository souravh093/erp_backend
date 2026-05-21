import { Router } from 'express';
import validation from '../../middlewares/validation';
import { companyController } from './company.controller';
import { companyValidation } from './company.validation';

const router = Router();

router.post(
  '/setup',
  validation(companyValidation.setup),
  companyController.setupCompany,
);

export const companyRoutes = router;
