import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const c = await prisma.creatorProfile.findFirst();
  console.log('CreatorID:', c?.id);
}

main().finally(() => prisma.$disconnect());
