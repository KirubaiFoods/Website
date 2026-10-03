import { MongoClient } from 'mongodb';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error("MONGO_URL is not set in .env");
  process.exit(1);
}

const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to MongoDB...");
  const mongoClient = new MongoClient(mongoUrl as string);
  await mongoClient.connect();
  const db = mongoClient.db(); 

  console.log("Fetching orders from MongoDB...");
  const ordersCollection = db.collection('Order');
  const mongoOrders = await ordersCollection.find({}).toArray();
  console.log(`Found ${mongoOrders.length} orders.`);

  console.log("Fetching users from MongoDB...");
  const usersCollection = db.collection('user_master');
  const mongoUsers = await usersCollection.find({}).toArray();
  console.log(`Found ${mongoUsers.length} users.`);

  console.log("Connecting to PostgreSQL via Prisma...");
  await prisma.$connect();

  console.log("Migrating orders...");
  let ordersMigrated = 0;
  for (const o of mongoOrders) {
    try {
      await prisma.order.upsert({
        where: { id: o._id.toString() },
        update: {},
        create: {
          id: o._id.toString(),
          invoiceNumber: o.invoiceNumber || null,
          name: o.name,
          phone: o.phone,
          email: o.email,
          address: o.address,
          city: o.city || null,
          pincode: o.pincode || null,
          state: o.state || null,
          total: o.total,
          subtotal: o.subtotal || null,
          gst: o.gst || null,
          shipping: o.shipping,
          status: o.status || "PLACED",
          payment: o.payment || "COD",
          estimatedDelivery: o.estimatedDelivery || null,
          createdAt: o.createdAt || new Date(),
          items: o.items || "[]",
        }
      });
      ordersMigrated++;
    } catch (e) {
      console.error(`Error migrating order ${o._id}:`, e);
    }
  }
  console.log(`Successfully migrated ${ordersMigrated} out of ${mongoOrders.length} orders.`);

  console.log("Migrating users...");
  let usersMigrated = 0;
  for (const u of mongoUsers) {
    try {
      await prisma.userMaster.upsert({
        where: { id: u._id.toString() },
        update: {},
        create: {
          id: u._id.toString(),
          username: u.username,
          email: u.email || null,
          password: u.password,
          name: u.name || null,
          role: u.role || "ADMIN",
          createdAt: u.createdAt || new Date(),
          updatedAt: u.updatedAt || new Date(),
        }
      });
      usersMigrated++;
    } catch (e) {
      console.error(`Error migrating user ${u._id}:`, e);
    }
  }
  console.log(`Successfully migrated ${usersMigrated} out of ${mongoUsers.length} users.`);

  await mongoClient.close();
  await prisma.$disconnect();
  console.log("Migration complete!");
}

main().catch(console.error);
