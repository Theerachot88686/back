const {PrismaClient} = require ('@prisma/client')
const prisma = new PrismaClient()


module.exports = {
  
    Booking: prisma.booking,
    // หากมีโมเดลอื่นๆ ที่ต้องการเชื่อมต่อเพิ่มเติมสามารถเพิ่มเข้ามาได้ตามต้องการ
    
  };

module.exports = prisma