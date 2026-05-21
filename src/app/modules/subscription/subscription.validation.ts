import z from 'zod';

const planTypes = z.enum(['MONTHLY', 'YEARLY']);

const createCheckoutSessionValidation = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user id'),
    plan: planTypes,
  }),
});

const subscriptionStatusValidation = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user id'),
  }),
});

export const subscriptionValidation = {
  createCheckoutSession: createCheckoutSessionValidation,
  status: subscriptionStatusValidation,
};
