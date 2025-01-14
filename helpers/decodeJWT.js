const jwt = require('jsonwebtoken');
// นำเข้าโมดูล `jsonwebtoken` เพื่อจัดการกับ JWT

function getUserIdFromJWT(token) {
    try {
        console.log('form decodeJWT', token);
        // แสดงข้อมูล token ใน console เพื่อช่วย debug
        
        // แยก JWT token ออกจากค่า Authorization Header (ในรูปแบบ "Bearer <token>")
        const splitToken = token.split(' ')[1];
        
        // ตรวจสอบความถูกต้องของ JWT token และถอดรหัสด้วย secret key
        const decodedToken = jwt.verify(splitToken, process.env.JWT_SECRET);
        // ใช้ `process.env.JWT_SECRET` เป็น secret key ที่ตั้งไว้ใน environment variables
        
        // ดึง `id` ของผู้ใช้จาก token ที่ถอดรหัสแล้ว และส่งกลับไป
        return decodedToken.id;
    } catch (error) {
        // จัดการข้อผิดพลาด เช่น token ไม่ถูกต้องหรือหมดอายุ
        console.error('Error decoding JWT token:', error.message);
        // คืนค่า `null` ในกรณีที่ token ไม่ถูกต้อง
        return null;
    }
}

module.exports = getUserIdFromJWT;
// ส่งออกฟังก์ชันเพื่อให้สามารถใช้งานในไฟล์อื่นได้
