const express = require("express");
const router = express.Router();
const competitionController = require("../controllers/competition-controller");
const multer = require("multer");

// ใช้ memory storage เพื่ออัปโหลดรูปไปที่ ImgBB
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// เส้นทาง API
router.get("/competitions", competitionController.getCompetitions);
router.get("/competitions/:id", competitionController.getCompetitionById);
router.post("/competitions", upload.single("image"), competitionController.createCompetition);
router.put("/competitions/:id", upload.single("image"), competitionController.updateCompetition);
router.delete("/competitions/:id", competitionController.deleteCompetition);
router.get("/recent-competitions", competitionController.getRecentCompetitions);

module.exports = router;