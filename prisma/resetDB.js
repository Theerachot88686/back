const {PrismaClient} =require('@prisma/client')
const prisma = new PrismaClient()

async function run() {
  await prisma.$executeRawUnsafe('DROP Database back')
  await prisma.$executeRawUnsafe('CREATE Database back')
}
console.log('Reset DB')
run()