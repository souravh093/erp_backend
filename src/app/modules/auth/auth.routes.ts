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

router.post(
  '/login',
  validation(authValidation.login),
  authController.loginUser,
);

export const authRoutes = router;
