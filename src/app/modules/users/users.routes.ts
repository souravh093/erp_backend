import { Router } from 'express';
import auth from '../../middlewares/auth';
import { usersController } from './users.controller';

const router = Router();

router.get('/me/permissions', auth(), usersController.getMyPermissions);

export const usersRoutes = router;
