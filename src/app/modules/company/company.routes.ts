import { Router } from 'express';
import validation from '../../middlewares/validation';
import { companyController } from './company.controller';
import { companyValidation } from './company.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post(
  '/setup',
  auth(),
  validation(companyValidation.setup),
  companyController.setupCompany,
);

export const companyRoutes = router;
