import { BusinessType } from '../../../../generated/prisma/client';

export type TAuthLoginPayload = {
  email: string;
  password: string;
};

export type TAuthRegisterPayload = {
  name: string;
  email: string;
  phone: string;
  password: string;
  avatar?: string;
  companyId?: string;
  companyName?: string;
  businessType?: BusinessType;
};
