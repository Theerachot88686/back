const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");
const multer = require("multer");
const FormData = require("form-data"); // ต้องใช้ form-data package
const { uploadToImgBB } = require("./imgbbUploader");
// ตั้งค่าอัปโหลดไฟล์ (เก็บในหน่วยความจำ)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ฟังก์ชันดึงข้อมูลทั้งหมดจากฐานข้อมูล
exports.getCarousels = async (req, res) => {
  try {
    const carousels = await prisma.carousel.findMany({
      orderBy: {
        createdAt: 'desc', // เรียงลำดับจากล่าสุด
      },
    });
    res.status(200).json(carousels);
  } catch (error) {
    res.status(500).json({ error: "Error fetching carousels." });
  }
};

// ฟังก์ชันสร้างรูปภาพใหม่ใน Carousel
exports.createCarousel = async (req, res) => {
  console.log("📸 Uploaded file:", req.file); // เช็คว่ามีไฟล์มาหรือไม่

  if (!req.file) {
    return res.status(400).json({ error: "❌ No file uploaded." });
  }

  try {
    const imageUrl = await uploadToImgBB(req.file);
    const newCarousel = await prisma.carousel.create({
      data: { image: imageUrl },
    });
    res.status(201).json({ message: "✅ Carousel image created successfully", carousel: newCarousel });
  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "❌ Error creating carousel.", details: error.message });
  }
};



// ฟังก์ชันอัปเดตรูปภาพใน Carousel
exports.updateCarousel = async (req, res) => {
  const { id } = req.params;
  let imageUrl = null;
  if (req.file) {
    imageUrl = await uploadToImgBB(req.file.buffer); // อัปโหลดไป ImgBB
  }
  try {
    const updatedCarousel = await prisma.carousel.update({
      where: { id },
      data: { image: imagePath },
    });
    res.status(200).json({ message: "Carousel image updated successfully", carousel: updatedCarousel });
  } catch (error) {
    res.status(500).json({ error: "Error updating carousel." });
  }
};

// ฟังก์ชันลบรูปภาพจาก Carousel
exports.deleteCarousel = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.carousel.delete({
      where: { id },
    });
    res.status(200).json({ message: "Carousel image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting carousel." });
  }
};
