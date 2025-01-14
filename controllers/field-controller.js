const db = require('../models/db');
// นำเข้าโมดูลสำหรับสื่อสารกับฐานข้อมูล

// ฟังก์ชันดึงข้อมูลฟิลด์ทั้งหมด
exports.getFields = async (req, res, next) => {
    try {
        const fields = await db.field.findMany(); 
        // ดึงข้อมูลฟิลด์ทั้งหมดจากฐานข้อมูล

        res.status(200).json(fields);
        // ส่งข้อมูลฟิลด์ทั้งหมดกลับในรูปแบบ JSON
    } catch (error) {
        next(error);
        // ส่งข้อผิดพลาดไปยัง middleware ถัดไป
    }
};

// ฟังก์ชันสร้างฟิลด์ใหม่
exports.createField = async (req, res, next) => {
    try {
        const { name, location, pricePerHour } = req.body;
        // รับข้อมูล `name`, `location`, และ `pricePerHour` จาก body ของคำขอ

        if (!name || !location || !pricePerHour) {
            return res.status(400).json({ message: 'Missing required fields' });
            // ตรวจสอบว่าข้อมูลครบถ้วน ถ้าไม่ครบส่งข้อความข้อผิดพลาดกลับ
        }

        const price = parseFloat(pricePerHour); 
        // แปลง `pricePerHour` เป็นเลขทศนิยม (float)

        if (isNaN(price)) {
            return res.status(400).json({ message: 'Invalid pricePerHour value' });
            // ตรวจสอบว่า `price` เป็นตัวเลขที่ถูกต้อง ถ้าไม่ใช่ส่งข้อผิดพลาด
        }

        const newField = await db.field.create({
            data: { name, location, pricePerHour: price },
            // บันทึกข้อมูลฟิลด์ใหม่ลงฐานข้อมูล
        });
        res.status(201).json(newField);
        // ส่งข้อมูลฟิลด์ที่สร้างสำเร็จกลับในรูปแบบ JSON
    } catch (error) {
        next(error);
        // ส่งข้อผิดพลาดไปยัง middleware ถัดไป
    }
};

// ฟังก์ชันอัปเดตข้อมูลฟิลด์
exports.updateField = async (req, res, next) => {
    try {
        const { id } = req.params;
        // รับ `id` ของฟิลด์จากพารามิเตอร์ใน URL
        const { name, location, pricePerHour } = req.body;
        // รับข้อมูลใหม่ที่ต้องการอัปเดตจาก body ของคำขอ

        if (!name || !location || !pricePerHour) {
            return res.status(400).json({ message: 'Missing required fields' });
            // ตรวจสอบว่าข้อมูลครบถ้วน ถ้าไม่ครบส่งข้อความข้อผิดพลาดกลับ
        }

        const updatedField = await db.field.update({
            where: { id: Number(id) },
            // ค้นหาฟิลด์ตาม `id` แล้วทำการอัปเดตข้อมูล
            data: { name, location, pricePerHour },
        });

        if (!updatedField) {
            return res.status(404).json({ message: 'Field not found' });
            // ส่งข้อความข้อผิดพลาดหากไม่พบฟิลด์
        }

        res.status(200).json(updatedField);
        // ส่งข้อมูลฟิลด์ที่อัปเดตสำเร็จกลับในรูปแบบ JSON
    } catch (error) {
        next(error);
        // ส่งข้อผิดพลาดไปยัง middleware ถัดไป
    }
};

// ฟังก์ชันลบข้อมูลฟิลด์
exports.deleteField = async (req, res, next) => {
    try {
        const { id } = req.params;
        // รับ `id` ของฟิลด์จากพารามิเตอร์ใน URL

        const deletedField = await db.field.delete({
            where: { id: Number(id) },
            // ค้นหาฟิลด์ตาม `id` แล้วลบออกจากฐานข้อมูล
        });

        if (!deletedField) {
            return res.status(404).json({ message: 'Field not found' });
            // ส่งข้อความข้อผิดพลาดหากไม่พบฟิลด์
        }

        res.status(200).json({ message: 'Field deleted successfully' });
        // ส่งข้อความยืนยันการลบฟิลด์สำเร็จ
    } catch (error) {
        next(error);
        // ส่งข้อผิดพลาดไปยัง middleware ถัดไป
    }
};
