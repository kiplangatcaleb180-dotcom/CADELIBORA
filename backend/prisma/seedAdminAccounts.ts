import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const superAdminPasswordHash = await bcrypt.hash('cade5213', 10);
  const adminPasswordHash = await bcrypt.hash('5213', 10);

  const existingSuperAdmin = await prisma.user.findUnique({ where: { username: 'CADELIBORA' } });
  if (existingSuperAdmin) {
    await prisma.user.update({
      where: { id: existingSuperAdmin.id },
      data: { passwordHash: superAdminPasswordHash, role: 'SUPER_ADMIN', isVerified: true, accountStatus: 'ACTIVE' },
    });
  } else {
    await prisma.user.upsert({
    where: { email: 'admin@cadelibora.org' },
    update: {
      username: 'CADELIBORA',
      passwordHash: superAdminPasswordHash,
      role: 'SUPER_ADMIN',
      isVerified: true,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'admin@cadelibora.org',
      username: 'CADELIBORA',
      passwordHash: superAdminPasswordHash,
      fullName: 'CADELIBORA Super Administrator',
      role: 'SUPER_ADMIN',
      isVerified: true,
      profile: { create: { company: 'CADELIBORA', skillsJson: JSON.stringify([]) } },
    },
    });
  }

  const existingAdmin = await prisma.user.findUnique({ where: { username: 'CADE_ADMIN' } });
  if (existingAdmin) {
    await prisma.user.update({
      where: { id: existingAdmin.id },
      data: { passwordHash: adminPasswordHash, role: 'ADMIN', isVerified: true, accountStatus: 'ACTIVE' },
    });
  } else {
    await prisma.user.upsert({
    where: { email: 'cade.admin@cadelibora.org' },
    update: {
      username: 'CADE_ADMIN',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      isVerified: true,
      accountStatus: 'ACTIVE',
    },
    create: {
      email: 'cade.admin@cadelibora.org',
      username: 'CADE_ADMIN',
      passwordHash: adminPasswordHash,
      fullName: 'CADELIBORA Administrator',
      role: 'ADMIN',
      isVerified: true,
      profile: { create: { company: 'CADELIBORA', skillsJson: JSON.stringify([]) } },
    },
    });
  }

  console.log('Super-admin and admin login accounts are ready.');
}

main()
  .catch((error) => {
    console.error('Could not create admin accounts:', error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
