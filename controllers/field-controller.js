const db = require('../models/db');
const { MongoClient } = require('mongodb');
exports.getByUser = async (req, res, next) => {
    try {
        const field = await db.field.findMany(); // ดึงข้อมูล Field ทั้งหมด
        res.status(200).json(field); // ส่งข้อมูลกลับให้กับไคลเอนท์ในรูปแบบ JSON พร้อมรหัสสถานะ HTTP 200
    } catch (error) {
        next(error);
    }
};