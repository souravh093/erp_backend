import { Router } from 'express';
import { TModuleRoute } from '../types/moduleRoute.type';

const router = Router();

const moduleRoutes: TModuleRoute[] = [];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
