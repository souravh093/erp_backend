import z from 'zod';

const createCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    description: z
      .string()
      .max(100, 'Description must be at most 100 characters')
      .optional(),
    companyId: z.string().min(1, 'Company ID is required'),
  }),
});

const updateCategoryValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    description: z
      .string()
      .max(100, 'Description must be at most 100 characters')
      .optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidation,
  updateCategoryValidation,
};
