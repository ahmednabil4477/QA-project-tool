const bcrypt = require('bcryptjs');
const prisma = require('./src/prismaClient'); // Use existing client

async function createAdmin() {
  const email = 'admin@admin.com'; // You can change this
  const password = '123456789aA@'; // You can change this

  try {
    // 1. Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists!`);
      return;
    }

    // 2. Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // 3. Create the admin in the database
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log('✅ Admin account created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
