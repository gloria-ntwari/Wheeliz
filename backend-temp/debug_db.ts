
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking Kid Data...');
  let kids: { id: string; name: string; email: string | null; lastLogin: Date | null; createdAt: Date }[] = [];
  for (let i = 0; i < 3; i++) {
    try {
        console.log(`Attempt ${i + 1} to connect...`);
        kids = await prisma.kid.findMany({
            select: {
            id: true,
            name: true,
            email: true,
            lastLogin: true,
            createdAt: true
            }
        });
        break;
    } catch (e: any) {
        console.error(`Attempt ${i + 1} failed:`, e.message);
        if (i === 2) throw e;
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log(`Found ${kids.length} kids.`);
  kids.forEach(kid => {
    console.log(`Kid: ${kid.name} (${kid.email})`);
    console.log(`  - CreatedAt: ${kid.createdAt}`);
    console.log(`  - LastLogin: ${kid.lastLogin}`);
    console.log('---');
  });

  console.log('\n--- Simulating Chart Logic ---');
  const now = new Date();
  const currentYear = now.getFullYear();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = 0; i < 12; i++) {
      const monthName = months[i];
      // UTC Dates as per controller
      const startOfMonth = new Date(Date.UTC(currentYear, i, 1));
      const endOfMonth = new Date(Date.UTC(currentYear, i + 1, 0, 23, 59, 59, 999));

      if (startOfMonth > now) {
          console.log(`Month: ${monthName} (Future) - Skipping`);
          continue;
      }

      const totalAtMonth = await prisma.kid.count({
          where: { createdAt: { lte: endOfMonth } }
      });

      let activeCount = 0;
      if (i === now.getMonth()) {
           activeCount = await prisma.kid.count({
              where: { lastLogin: { gte: startOfMonth } }
           });
      } else {
           activeCount = await prisma.kid.count({
               where: { lastLogin: { gte: startOfMonth, lte: endOfMonth } }
           });
      }
      
      const offline = Math.max(0, totalAtMonth - activeCount);
      console.log(`Month: ${monthName}, Total: ${totalAtMonth}, Active: ${activeCount}, Offline: ${offline}`);
      console.log(`   Range: ${startOfMonth.toISOString()} - ${endOfMonth.toISOString()}`);
  }
  }


main()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
