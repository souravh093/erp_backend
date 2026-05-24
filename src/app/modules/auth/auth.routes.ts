import { Router } from 'express';
import validation from '../../middlewares/validation';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';

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

router.post(
  '/forgot-password',
  validation(authValidation.forgotPassword),
  authController.forgotPassword,
);

router.post(
  '/reset-password',
  validation(authValidation.resetPassword),
  authController.resetPassword,
);

router.post(
  '/change-password',
  auth(),
  validation(authValidation.changePassword),
  authController.changePassword,
);

export const authRoutes = router;
