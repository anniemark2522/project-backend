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

// ตั้งค่า Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const imageFolder = path.resolve(__dirname, '../db/assets/images/accommodation');
const jsonFilePath = path.resolve(__dirname, '../db/hotel_apt.json');




// โหลด JSON ข้อมูลร้านอาหาร
let accData = [];
try {
    accData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));
} catch (error) {
    console.error('❌ อ่านไฟล์ JSON ไม่ได้:', error);
    process.exit(1);
}

// ฟังก์ชันอัปโหลดและอัปเดต JSON
const uploadImagesAndUpdateJSON = async () => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

    try {
        const files = fs.readdirSync(imageFolder).filter(file =>
            allowedExtensions.includes(path.extname(file).toLowerCase())
        );

        for (const file of files) {
            const filePath = path.join(imageFolder, file);
            const fileNameWithoutExt = path.parse(file).name;  // เช่น "1" จาก "1.jpg"

            console.log(`📤 Uploading: ${filePath}`);

            // อัปโหลดรูปไป Cloudinary
            const result = await cloudinary.v2.uploader.upload(filePath, {
                folder: 'accommodation',
                use_filename: true,
                unique_filename: false,
            });

            console.log(`✅ อัปโหลดสำเร็จ: ${file} → ${result.secure_url}`);

            // หาใน JSON ว่ามี foodId ตรงกับชื่อไฟล์มั้ย
            const accItem = accData.find(item => item.hotelId === fileNameWithoutExt);
            if (accItem) {
                accItem.image = result.secure_url;  // ใส่ลิงก์ลงใน image
            } else {
                console.warn(`⚠️ ไม่เจอ AccId ตรงกับไฟล์ ${file}`);
            }
        }

        // เขียนกลับลงไฟล์ JSON
        fs.writeFileSync(jsonFilePath, JSON.stringify(accData, null, 2), 'utf-8');
        console.log('✅ อัปเดตไฟล์ JSON สำเร็จ');

    } catch (error) {
        console.error('❌ อัปโหลดล้มเหลว:', error);
    }
};

// เรียกใช้งาน
uploadImagesAndUpdateJSON();
