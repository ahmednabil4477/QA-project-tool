const prisma = require('./src/prismaClient');
async function main() {
  await prisma.flight.deleteMany({});
  console.log('All static flights deleted.');
}
main().finally(() => prisma.$disconnect());
