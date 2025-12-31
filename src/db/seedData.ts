import configs from '../app/configs';
import prisma from './db.config';
import bcryptjs from 'bcryptjs';

const seedData = async () => {
  await prisma.$transaction(async (prisma) => {
    const existingAdmin = await prisma.adminUser.findFirst();

    if (!existingAdmin) {
      const hashPassword = await bcryptjs.hash(
      configs.adminPassword as string,
      10,
    );

    await prisma.adminUser.create({
      data: {
        name: configs.adminName as string,
        email: configs.adminEmail as string,
        password: hashPassword,
      },
    });
    }
  });
};

export default seedData;
