import configs from '../app/configs';
import { prisma } from './db.config';
import bcryptjs from 'bcryptjs';

const seedData = async () => {
  // Seed data logic is commented out because adminUser model is not present in the current prisma schema.
  /*
  await prisma.$transaction(async (tx) => {
    const existingAdmin = await tx.user.findFirst({
      where: { email: configs.adminEmail as string }
    });

    if (!existingAdmin) {
      const hashPassword = await bcryptjs.hash(
        configs.adminPassword as string,
        10,
      );
      // Creating an admin user requires a company. Seeding company and admin user here if needed.
    }
  });
  */
};

export default seedData;
