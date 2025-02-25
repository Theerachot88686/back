const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  await prisma.$executeRawUnsafe('DROP Database ccac01')
  await prisma.$executeRawUnsafe('CREATE Database ccac01')
}
console.log('Reset DB')
run()