require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL); // เช็คค่าที่โหลดมา

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userData = [
  { username: "andy", password: "1234", email: "andy@gmail.com" },
  { username: "tai", password: "1234", email: "tai@gmail.com" },
  { username: "wtpl", password: "1234", email: "wpddd@gmail.com" },
  { username: "admin", password: "1234", email: "andy2@gmail.com", role: "admin" },
  { username: "admin2", password: "1234", email: "tai1@gmail.com", role: "admin" },
  { username: "test01", password: "1234", email: "family4485@gmail.com" },
];

const run = async () => {
  try {
    console.log("🔄 Deleting existing users...");
    await prisma.user.deleteMany(); // ลบข้อมูลเดิมทั้งหมด

    console.log("✅ Seeding new users...");
    await prisma.user.createMany({ data: userData });

    console.log("🎉 Seed completed!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
  } finally {
    await prisma.$disconnect();
  }
};

run();
