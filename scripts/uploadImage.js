import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ใช้ import.meta.url แทน __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// โหลดไฟล์ .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ตรวจสอบว่าตัวแปรถูกโหลดหรือไม่
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Error: Cloudinary API keys are missing. Check your .env file.');
  process.exit(1);
}

// ตั้งค่า Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log('✅ Cloudinary Config Loaded Successfully');

// 📌 พาธโฟลเดอร์ที่มีรูป
const imageFolder = path.resolve(__dirname, '../db/assets/images/food');

// 📌 ฟังก์ชันอัปโหลดรูปทั้งหมดในโฟลเดอร์
const uploadImages = async () => {
  try {
    // กรองเฉพาะไฟล์ที่เป็นภาพเท่านั้น
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const files = fs.readdirSync(imageFolder).filter(file =>
      allowedExtensions.includes(path.extname(file).toLowerCase())
    );

    if (files.length === 0) {
      console.warn('⚠️ ไม่พบไฟล์ภาพที่รองรับในโฟลเดอร์นี้');
      return;
    }

    for (const file of files) {
      const filePath = path.join(imageFolder, file);

      console.log(`📤 Uploading: ${filePath}`);

      // อัปโหลดไป Cloudinary
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'food',
        use_filename: true,
        unique_filename: false,
      });

      console.log(`✅ อัปโหลดสำเร็จ: ${file} → ${result.secure_url}`);
    }

  } catch (error) {
    console.error('❌ อัปโหลดล้มเหลว:', error);
  }
};

// 🔥 เรียกใช้งานฟังก์ชัน
uploadImages();
