import { TRoleData } from '../types/roleData.type';

export const roleData: TRoleData = {
  name: 'Super Admin',
  features: [
    {
      name: 'Overview',
      path: '/dashboard',
      index: 1,
      icon: 'IconLayoutDashboard',
    },
    {
      name: 'Job Seekers',
      path: '/job-seekers',
      index: 2,
      icon: 'IconUser',
      featureAccess: [
        {
          name: 'get',
        },
        {
          name: 'post',
        },
        {
          name: 'update',
        },
        {
          name: 'delete',
        },
      ],
    },
    {
      name: 'Employees',
      path: '/employees',
      index: 3,
      icon: 'IconBrowserCheck',
      featureAccess: [
        {
          name: 'get',
        },
        {
          name: 'post',
        },
        {
          name: 'update',
        },
        {
          name: 'delete',
        },
      ],
    },
    {
      name: 'Blogs',
      path: '/blogs',
      index: 4,
      icon: 'IconNews',
      featureAccess: [
        {
          name: 'get',
        },
        {
          name: 'post',
        },
        {
          name: 'update',
        },
        {
          name: 'delete',
        },
      ],
    },
    {
      name: 'Courses',
      path: '/courses',
      index: 5,
      icon: 'IconBrandParsinta',
      featureAccess: [
        {
          name: 'get',
        },
        {
          name: 'post',
        },
        {
          name: 'update',
        },
        {
          name: 'delete',
        },
      ],
    },
    {
      name: 'FAQs',
      path: '/faqs',
      index: 7,
      icon: 'IconMessages',
      featureAccess: [
        {
          name: 'get',
        },
        {
          name: 'post',
        },
        {
          name: 'update',
        },
        {
          name: 'delete',
        },
      ],
    },
    {
      name: 'Settings',
      path: '/settings',
      index: 6,
      icon: 'IconSettings',
      featureAccess: [
        {
          name: 'get',
        },
        {
          name: 'post',
        },
        {
          name: 'update',
        },
        {
          name: 'delete',
        },
      ],
    },
  ],
};

export const featuresNames = {
  overview: 'Overview',
  jobSeekers: 'Job Seekers',
  employees: 'Employees',
  blogs: 'Blogs',
  courses: 'Courses',
  faqs: 'FAQs',
  settings: 'Settings',
}
