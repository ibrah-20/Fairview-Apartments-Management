const { PrismaClient } = require('@prisma/client');
console.log("Creating client...");
const prisma = new PrismaClient();
console.log("Client created.");
prisma.user.count().then(c => console.log("User count:", c)).catch(e => console.error(e));
