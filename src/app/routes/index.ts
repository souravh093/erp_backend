import { Router } from 'express';
import { TModuleRoute } from '../types/moduleRoute.type';
import { authRoutes } from '../modules/auth/auth.routes';
import { companyRoutes } from '../modules/company/company.routes';
import { subscriptionRoutes } from '../modules/subscription/subscription.routes';
import { usersRoutes } from '../modules/users/users.routes';
import { roleRoutes } from '../modules/role/role.routes';
import { branchRoutes } from '../modules/branch/branch.routes';
import { categoryRoutes } from '../modules/category/category.routes';

const router = Router();

const moduleRoutes: TModuleRoute[] = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/users',
    route: usersRoutes,
  },
  {
    path: '/role',
    route: roleRoutes,
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
    path: '/branch',
    route: branchRoutes,
  },
  {
    path: '/category',
    route: categoryRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
