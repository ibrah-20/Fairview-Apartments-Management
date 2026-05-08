const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const floors = [
    { prefix: 'G', label: 'Ground Floor' },
    { prefix: 'A', label: 'First Floor' },
    { prefix: 'B', label: 'Second Floor' },
    { prefix: 'C', label: 'Third Floor' },
    { prefix: 'D', label: 'Fourth Floor' },
    { prefix: 'E', label: 'Fifth Floor' },
  ];

  const cornerUnits = [1, 8, 15];

  console.log('Seeding rooms...');

  for (const f of floors) {
    for (let i = 1; i <= 15; i++) {
      const id = `${f.prefix}${i}`;
      const isCorner = cornerUnits.includes(i);
      const price = isCorner ? 6500 : 7000;

      await prisma.room.upsert({
        where: { id },
        update: {},
        create: {
          id,
          floor: f.label,
          price,
          isCorner,
          status: 'VACANT',
        },
      });
    }
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
