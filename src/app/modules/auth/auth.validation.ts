import z from 'zod';

const businessTypes = z.enum([
  'SHOP',
  'RESTAURANT',
  'PHARMACY',
  'HOTEL',
  'CLINIC',
  'GYM',
  'SALON',
  'WAREHOUSE',
  'FACTORY',
  'OFFICE',
]);

const registerValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be less than 100 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .max(255, 'Email must be less than 255 characters'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(20, 'Phone number must be less than 20 digits'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255, 'Password must be less than 255 characters'),
    avatar: z
      .string()
      .url('Avatar must be a valid URL')
      .max(255, 'Avatar URL must be less than 255 characters')
      .optional(),
    companyId: z.string().uuid('Invalid company id').optional(),
    companyName: z
      .string()
      .min(1, 'Company name is required')
      .max(255, 'Company name must be less than 255 characters'),
    businessType: businessTypes,
  }),
});

const loginValidation = z.object({
  body: z.object({
    email: z
      .string()
      .email('Invalid email address')
      .max(255, 'Email must be less than 255 characters'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255, 'Password must be less than 255 characters'),
  }),
});

export const authValidation = {
  register: registerValidation,
  login: loginValidation,
};
