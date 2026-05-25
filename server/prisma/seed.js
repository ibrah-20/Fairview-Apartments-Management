const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@citylake.com' },
    update: {},
    create: {
      email: 'admin@citylake.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`Upserted Super Admin: ${admin.email}`);

  // Create Water Staff
  const waterStaff = await prisma.user.upsert({
    where: { email: 'water@citylake.com' },
    update: {},
    create: {
      email: 'water@citylake.com',
      password: hashedPassword,
      name: 'Water Sales Team',
      role: 'WATER_STAFF',
    },
  });
  console.log(`Upserted Water Staff: ${waterStaff.email}`);

  // Create Apartment Manager
  const manager = await prisma.user.upsert({
    where: { email: 'manager@citylake.com' },
    update: {},
    create: {
      email: 'manager@citylake.com',
      password: hashedPassword,
      name: 'Property Manager',
      role: 'APARTMENT_MANAGER',
    },
  });
  console.log(`Upserted Manager: ${manager.email}`);

  // Create Test Tenant
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@citylake.com' },
    update: {},
    create: {
      email: 'tenant@citylake.com',
      password: hashedPassword,
      name: 'John Doe (Tenant)',
      role: 'TENANT',
    },
  });
  console.log(`Upserted Tenant: ${tenant.email}`);

  // 2. Generate Rooms (90 units: 6 floors, 15 units each)
  const floors = [
    { prefix: 'G', label: 'Ground Floor' },
    { prefix: 'A', label: 'First Floor' },
    { prefix: 'B', label: 'Second Floor' },
    { prefix: 'C', label: 'Third Floor' },
    { prefix: 'D', label: 'Fourth Floor' },
    { prefix: 'E', label: 'Fifth Floor' },
  ];

  const roomsData = [];
  for (const floor of floors) {
    for (let i = 1; i <= 15; i++) {
      const isCorner = i === 1 || i === 8 || i === 15;
      const roomId = `${floor.prefix}${i}`;
      roomsData.push({
        id: roomId,
        floor: floor.label,
        price: isCorner ? 6500 : 7000,
        isCorner: isCorner,
        status: 'VACANT',
      });
    }
  }

  for (const room of roomsData) {
    await prisma.room.upsert({
      where: { id: room.id },
      update: {},
      create: room,
    });
  }
  
  console.log(`Seeded ${roomsData.length} rooms.`);

  // 3. Initialize Water Inventory
  await prisma.waterInventory.upsert({
    where: { type: 'PURIFIED_WATER_LITERS' },
    update: {},
    create: {
      type: 'PURIFIED_WATER_LITERS',
      quantity: 5000,
    }
  });

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
