import { Router } from 'express';
import { TModuleRoute } from '../types/moduleRoute.type';
import { authRoutes } from '../modules/auth/auth.routes';
import { companyRoutes } from '../modules/company/company.routes';
import { subscriptionRoutes } from '../modules/subscription/subscription.routes';

const router = Router();

const moduleRoutes: TModuleRoute[] = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: '/subscription',
    route: subscriptionRoutes,
  },
  {
    path: '/company',
    route: companyRoutes,
  }
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
