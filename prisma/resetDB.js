require('dotenv').config(); // ✅ โหลด .env ก่อน PrismaClient

const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  await prisma.$executeRawUnsafe('DROP Database tai')
  await prisma.$executeRawUnsafe('CREATE Database tai')
}
console.log('Reset DB')
run()