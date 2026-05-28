import { Router } from 'express';
import { TModuleRoute } from '../types/moduleRoute.type';
import { authRoutes } from '../modules/auth/auth.routes';
import { companyRoutes } from '../modules/company/company.routes';
import { subscriptionRoutes } from '../modules/subscription/subscription.routes';
import { usersRoutes } from '../modules/users/users.routes';

const router = Router();

const moduleRoutes: TModuleRoute[] = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRoutes,
  },
  {
    path: '/company',
    route: companyRoutes,
  },
  {
    path: '/users',
    route: usersRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
