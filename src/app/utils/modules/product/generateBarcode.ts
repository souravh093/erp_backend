import { prisma } from "../../../../db/db.config";

export const generateBarcode = async (companyId: string) => {
  const count = await prisma.product.count({
    where: {
      companyId,
    },
  });

  return String(count + 1).padStart(12, '0');
};
