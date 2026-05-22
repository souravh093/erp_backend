import z from 'zod';

const currencyTypes = z.enum(['USD', 'EUR', 'INR', 'BDT']);

const setupCompanyValidation = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user id'),
    trade_license_number: z
      .string()
      .max(100, 'Trade license must be less than 100 characters')
      .optional(),
    vat_registration_number: z
      .string()
      .max(100, 'VAT number must be less than 100 characters')
      .optional(),
    address: z.string().optional(),
    phone: z
      .string()
      .max(20, 'Phone number must be less than 20 characters')
      .optional(),
    email: z.string().email('Invalid email address').optional(),
    currency_default: currencyTypes.optional(),
  }),
});

export const companyValidation = {
  setup: setupCompanyValidation,
};
