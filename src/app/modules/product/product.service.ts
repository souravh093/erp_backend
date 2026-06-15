import { prisma } from '../../../db/db.config';
import AppError from '../../errors/AppError';
import { generateBarcode } from '../../utils/modules/product/generateBarcode';
import {
  generateSkuPrefix,
  generateUniqueSku,
} from '../../utils/modules/product/generateSKU';
import { TProduct } from './product.type'; 

const createProductIntoDB = async (payload: TProduct) => {
  const [existingCategory, existingUnit, existingCompany] = await Promise.all([
    prisma.category.findUnique({ where: { id: payload.categoryId }, select: { name: true } }),
    prisma.unit.findUnique({ where: { id: payload.unitId }, select: { id: true } }),
    prisma.company.findUnique({ where: { id: payload.companyId }, select: { id: true } }),
  ]);

  if (!existingCategory) throw new AppError(404,'Category not found');
  if (!existingUnit) throw new AppError(404,'Unit not found');
  if (!existingCompany) throw new AppError(404,'Company not found');

  const skuPrefix = generateSkuPrefix(payload.name, existingCategory.name);
  const uniqueSku = await generateUniqueSku(skuPrefix, payload.companyId);
  const barcode = await generateBarcode(payload.companyId);

  return await prisma.$transaction(async (tx) => {
    return await tx.product.create({
      data: {
        name: payload.name,
        description: payload.description || null,
        productType: payload.productType,
        categoryId: payload.categoryId,
        subCategoryId: payload.subCategoryId || null,
        unitId: payload.unitId,
        companyId: payload.companyId,
        sku: uniqueSku,
        barcode: barcode,
        productPricing: {
          create: {
            purchase_price: payload.productPricing.purchase_price,
            selling_price: payload.productPricing.selling_price,
            vat_rate_percent: payload.productPricing.vat_rate_percent,
            discount_rate_percent: payload.productPricing.discount_rate_percent,
            effective_from: payload.productPricing.effective_from,
          },
        },
        stocks: {
          create: {
            current_quantity: payload.stock.current_quantity,
            reorder_level: payload.stock.reorder_level,
            branchId: payload.stock.branchId,
          },
        },
      },
      include: {
        productPricing: true,
        stocks: true,
      }
    });
  });
};

export const productService = {
    createProductIntoDB,
}