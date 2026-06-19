import z from 'zod';

const createSupplierSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    email: z.string().email('Invalid email address').optional(),
    phone: z.string().trim().min(1, 'Phone number is required'),
    companyId: z.string().min(1, 'Company ID is required'),
    address: z.string().trim().optional(),
    vat_registered: z.boolean().optional(),
  }),
});

const updateSupplierSchema = z.object({
  body: createSupplierSchema.partial().superRefine((data, ctx) => {
    if (!data?.body?.name && !data?.body?.email && !data?.body?.phone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'At least one of name, email, or phone must be provided',
        path: ['body'],
      });
    }
  }),
});

export const supplierValidation = {
  createSupplierSchema,
  updateSupplierSchema,
};
