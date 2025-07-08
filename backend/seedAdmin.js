require('dotenv').config(); // Load .env

const prisma = require('./prisma/client');
const bcrypt = require('bcryptjs');

async function ensureAdminExists() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(" ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
    return;
  }

  const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!admin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'TRAINER',
        isActive: true,
      },
    });
    console.log('Admin account created.');
  } else {
    console.log('Admin already exists.');
  }

  await prisma.$disconnect();
}

module.exports = ensureAdminExists;

if (require.main === module) {
  ensureAdminExists();
}
