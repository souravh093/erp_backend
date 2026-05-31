import { z } from 'zod';

const createBranchSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Branch name is required'),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
    companyId: z.string().min(1, 'Company ID is required'),
  }),
});

const updateBranchSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Branch name is required').optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email('Invalid email format').optional(),
  }),
});

export const BranchValidation = {
  createBranchSchema,
  updateBranchSchema,
};
