import z from 'zod';

const createSubCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
    description: z
      .string()
      .max(200, 'Description must be at most 200 characters')
      .optional(),
  }),
});

const updateSubCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').optional(),
    categoryId: z.string().min(1, 'Category ID is required').optional(),
    description: z
      .string()
      .max(200, 'Description must be at most 200 characters')
      .optional(),
  }),
});

export const subCategoryValidation = {
  createSubCategorySchema,
  updateSubCategorySchema,
};
