import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
export default prisma;
