import z from 'zod';

const createUnitValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(50, 'Name must be at most 50 characters'),
    conversion_base_unit: z
      .string()
      .max(50, 'Conversion base unit must be at most 50 characters')
      .optional(),
    companyId: z
      .string()
      .uuid('Invalid company ID')
      .min(1, 'Company ID is required'),
  }),
});

const updateUnitValidation = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(50, 'Name must be at most 50 characters')
      .optional(),
    conversion_base_unit: z
      .string()
      .max(50, 'Conversion base unit must be at most 50 characters')
      .optional(),
  }),
});

export const unitValidation = {
  createUnitValidation,
  updateUnitValidation,
};
