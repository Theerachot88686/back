const express = require('express');
const router = express.Router();
const pullController = require('../controllers/pull-controller');

// เส้นทางสำหรับดึงข้อมูลผู้ใช้ที่มี role = "user"
router.get('/pull', pullController.getUsersWithRole);

module.exports = router
