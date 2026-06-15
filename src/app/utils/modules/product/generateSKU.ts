import { prisma } from '../../../../db/db.config';

export const generateSkuPrefix = (
  productName: string,
  categoryName: string,
): string => {
  const category = categoryName
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 3)
    .toUpperCase();

  const product = productName
    .replace(/[^a-zA-Z0-9]/g, '')
    .substring(0, 4)
    .toUpperCase();

  return `${category}-${product}`;
};

export const generateUniqueSku = async (
  prefix: string,
  companyId: string,
): Promise<string> => {
  const count = await prisma.product.count({
    where: {
      companyId,
      sku: {
        startsWith: prefix,
      },
    },
  });

  const sequenceNumber = (count + 1).toString().padStart(6, '0');

  return `${prefix}-${sequenceNumber}`;
};
