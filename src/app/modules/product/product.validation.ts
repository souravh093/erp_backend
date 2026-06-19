import z from 'zod';
import { ProductType } from '../../../../generated/prisma/enums';

const createProductSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().optional(),
    productType: z.enum([ProductType.GOODS, ProductType.SERVICE]),
    unitId: z.string().min(1, 'Unit ID is required'),
    companyId: z.string().min(1, 'Company ID is required'),
    categoryId: z.string().min(1, 'Category ID is required'),
    subCategoryId: z.string().optional(),
    productPricing: z
      .object({
        purchase_price: z
          .number()
          .positive('Purchase price must be greater than 0'),
        selling_price: z
          .number()
          .positive('Selling price must be greater than 0'),
        vat_rate_percent: z
          .number({ required_error: 'Vat percent rate is required' })
          .min(0, 'VAT cannot be negative')
          .max(100, 'VAT cannot exceed 100%'),
        discount_rate_percent: z
          .number({ required_error: 'Discount percent rate is required' })
          .min(0, 'Discount cannot be negative')
          .max(100, 'Discount cannot exceed 100%'),
        effective_from: z.coerce.date({
          errorMap: () => ({ message: 'Effective from must be a valid date' }),
        }),
      })
      .refine((data) => data.selling_price >= data.purchase_price, {
        message: 'Selling price cannot be less than the purchase price',
        path: ['selling_price'],
      }),
  }),
});

const updateProductSchema = z.object({
  body: createProductSchema.partial().superRefine((data, ctx) => {
    if (
      data?.body?.productPricing?.selling_price &&
      data?.body?.productPricing?.purchase_price
    ) {
      if (
        data.body.productPricing.selling_price <
        data.body.productPricing.purchase_price
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Selling price cannot be less than the purchase price',
          path: ['productPricing', 'selling_price'],
        });
      }
    }
  }),
});

export const productValidation = {
  createProductSchema,
  updateProductSchema,
};
