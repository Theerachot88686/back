const db = require('../models/db');

// ฟังก์ชันดึงข้อมูลฟิลด์ทั้งหมด
exports.getFields = async (req, res, next) => {
    try {
        const fields = await db.field.findMany(); 
        res.status(200).json(fields);
    } catch (error) {
        next(error);
    }
};

// ฟังก์ชันสร้างฟิลด์ใหม่
exports.createField = async (req, res, next) => {
    try {
        const { name, location, pricePerHour } = req.body;

        if (!name || !location || !pricePerHour) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // แปลง pricePerHour เป็น float ก่อนบันทึก
        const price = parseFloat(pricePerHour); // หรือใช้ `Number(pricePerHour)` ได้เช่นกัน

        // ตรวจสอบว่า pricePerHour ที่แปลงแล้วเป็น number ที่ถูกต้อง
        if (isNaN(price)) {
            return res.status(400).json({ message: 'Invalid pricePerHour value' });
        }

        const newField = await db.field.create({
            data: { name, location, pricePerHour: price },
        });
        res.status(201).json(newField);
    } catch (error) {
        next(error);
    }
};

// ฟังก์ชันอัปเดตข้อมูลฟิลด์
exports.updateField = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, location, pricePerHour } = req.body;

        if (!name || !location || !pricePerHour) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const updatedField = await db.field.update({
            where: { id: Number(id) },
            data: { name, location, pricePerHour },
        });

        if (!updatedField) {
            return res.status(404).json({ message: 'Field not found' });
        }

        res.status(200).json(updatedField);
    } catch (error) {
        next(error);
    }
};

// ฟังก์ชันลบข้อมูลฟิลด์
exports.deleteField = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedField = await db.field.delete({
            where: { id: Number(id) },
        });

        if (!deletedField) {
            return res.status(404).json({ message: 'Field not found' });
        }

        res.status(200).json({ message: 'Field deleted successfully' });
    } catch (error) {
        next(error);
    }
};
