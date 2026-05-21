import { BusinessType, Currency } from '../../../../generated/prisma/client';

export type TCompanySetupPayload = {
  userId: string;
  name: string;
  business_type: BusinessType;
  trade_license_number?: string;
  vat_registration_number?: string;
  address?: string;
  phone?: string;
  email?: string;
  currency_default?: Currency;
};
