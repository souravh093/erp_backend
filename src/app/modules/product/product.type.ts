import { ProductType } from '../../../../generated/prisma/client';

export type TProduct = {
  name: string;
  description?: string;
  productType: ProductType;
  categoryId: string;
  unitId: string;
  companyId: string;
  subCategoryId?: string;
  productPricing: {
    purchase_price: number;
    selling_price: number;
    vat_rate_percent: number;
    discount_rate_percent: number;
    effective_from: Date;
  };
};
