import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'inezangogazeno11@gmail.com';
  const name = 'Admin User';
  const password = 'admin@123';

  console.log(`Checking if admin with email ${email} exists...`);
  
  const existingAdmin = await prisma.admin.findUnique({
    where: { email }
  });

  if (existingAdmin) {
    console.log('Admin already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      passwordHash,
      role: 'admin'
    }
  });

  console.log(`Admin created successfully: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
