import { prisma } from '../../db/db.config';
import { permissions } from '../constant/permissions';

/**
 * Seeds default permissions into the PostgreSQL database.
 * Uses a safe lookup-and-insert approach to prevent duplicate errors.
 */
export const seedPermissions = async () => {
  console.log('🌱 Starting permission seeding...');

  try {
    // 1. Fetch all existing permissions from the database
    const existingPermissions = await prisma.permission.findMany({
      select: { permission: true },
    });

    const existingSet = new Set(existingPermissions.map((p) => p.permission));

    // 2. Filter out permissions that already exist in the database
    const missingPermissions = permissions.filter(
      (perm) => !existingSet.has(perm)
    );

    if (missingPermissions.length === 0) {
      console.log('✅ All permissions are already up-to-date in the database.');
      return;
    }

    console.log(`🔍 Found ${missingPermissions.length} new permissions to seed.`);

    // 3. Bulk insert the missing permissions inside a transaction
    await prisma.permission.createMany({
      data: missingPermissions.map((perm) => ({ permission: perm })),
    });

    console.log(`🎉 Successfully seeded ${missingPermissions.length} new permissions!`);
  } catch (error) {
    console.error('❌ Error during permission seeding:', error);
    throw error;
  }
};

// Execute the seeder if run directly as a script
const runSeeder = async () => {
  try {
    await seedPermissions();
    await prisma.$disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

runSeeder();
