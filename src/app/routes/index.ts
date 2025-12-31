import { Router } from 'express';
import { TModuleRoute } from '../types/moduleRoute.type';
import { AdminUserRoutes } from '../modules/admin/admin.routes';
import { CourseRoutes } from '../modules/course/course.routes';
import { StudentRoutes } from '../modules/student/student.routes';
import { RoomRoutes } from '../modules/room/room.routes';

const router = Router();

const moduleRoutes: TModuleRoute[] = [
  {
    path: '/auth/admin',
    route: AdminUserRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/rooms',
    route: RoomRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
