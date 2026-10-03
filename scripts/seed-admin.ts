import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminUsername = "admin";
  const adminEmail = "admin@kirubaifoods.com";
  const defaultPassword = "admin"; // Admin password
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  console.log("Seeding Admin data into MongoDB 'Kirubai' database...");

  // Check if admin user already exists
  const existingUser = await prisma.userMaster.findFirst({
    where: {
      OR: [
        { username: adminUsername },
        { email: adminEmail }
      ]
    }
  });

  if (existingUser) {
    console.log("Existing admin user found. Updating password and details...");
    const updated = await prisma.userMaster.update({
      where: { id: existingUser.id },
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        name: "Kirubai Admin",
        role: "ADMIN"
      }
    });
    console.log("✅ Admin user master updated successfully in Kirubai DB:");
    console.log({
      id: updated.id,
      username: updated.username,
      email: updated.email,
      role: updated.role
    });
  } else {
    const newUser = await prisma.userMaster.create({
      data: {
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        name: "Kirubai Admin",
        role: "ADMIN"
      }
    });
    console.log("✅ Admin user master created successfully in Kirubai DB:");
    console.log({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    });
  }

  console.log("-----------------------------------------");
  console.log("🔑 Admin Login Credentials:");
  console.log(`   Username/Email: ${adminUsername} or ${adminEmail}`);
  console.log(`   Password:       ${defaultPassword}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Admin user data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
