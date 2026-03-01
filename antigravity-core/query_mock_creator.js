const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const profile = await prisma.creatorProfile.findFirst();
  console.log(profile.id);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
