import { Router } from 'express';
import validation from '../../middlewares/validation';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';

const router = Router();

router.post(
  '/register',
  validation(authValidation.register),
  authController.createUser,
);


export const authRoutes = router;