import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageFolder = path.resolve(__dirname, '../db/assets/images/food');
const jsonFilePath = path.resolve(__dirname, '../db/food_category.json');

// โหลด JSON
let foodData = [];
try {
  foodData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
} catch (error) {
  console.error('❌ อ่านไฟล์ JSON ไม่ได้:', error);
  process.exit(1);
}

const uploadImagesAndUpdateJSON = async () => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  try {
    const files = fs.readdirSync(imageFolder).filter(file =>
      allowedExtensions.includes(path.extname(file).toLowerCase())
    );

    for (const file of files) {
      const filePath = path.join(imageFolder, file);
      const fileNameWithoutExt = path.parse(file).name;

      console.log(`📤 Uploading: ${filePath}`);

      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'food', // ใช้ชื่อ folder เดิมก็ได้
        use_filename: true,
        unique_filename: false,
        overwrite: true, // 👉 เพิ่มบรรทัดนี้เพื่อ "ทับไฟล์เดิม"
      });

      console.log(`✅ อัปโหลดสำเร็จ: ${file} → ${result.secure_url}`);

      // อัปเดต URL ใหม่ใน JSON
      const foodItem = foodData.find(item => item.foodId === fileNameWithoutExt);
      if (foodItem) {
        foodItem.image = result.secure_url;
      } else {
        console.warn(`⚠️ ไม่เจอ foodId ตรงกับไฟล์ ${file}`);
      }
    }

    // เขียนกลับลง JSON
    fs.writeFileSync(jsonFilePath, JSON.stringify(foodData, null, 2), 'utf-8');
    console.log('✅ อัปเดตไฟล์ JSON สำเร็จ');

  } catch (error) {
    console.error('❌ อัปโหลดล้มเหลว:', error);
  }
};

uploadImagesAndUpdateJSON();
