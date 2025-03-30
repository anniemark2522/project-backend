import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// ใช้ import.meta.url แทน __dirname ใน ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// ตรวจสอบว่า FIREBASE_SERVICE_ACCOUNT_PATH ถูกกำหนดแล้ว
if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    console.error('FIREBASE_SERVICE_ACCOUNT_PATH is not defined in the .env file.');
    process.exit(1);
}

// ใช้ Firebase Admin SDK
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dbmuaythai-50c15-firebase-adminsdk-fbsvc-04309008a3.json'), 'utf8'));

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// เชื่อมต่อ Firestore
const db = admin.firestore();

const updateProvinceField = async () => {
    try {
      const collectionRef = db.collection("detailGymClasses");
      const snapshot = await collectionRef.get();
  
      if (snapshot.empty) {
        console.log("No documents found!");
        return;
      }
  
      snapshot.forEach(async (doc) => {
        const data = doc.data();
        const location = data.location;
  
        // แยกชื่อจังหวัดจาก location
        const province = location.split(", ").pop(); // เอาค่าหลังสุด (จังหวัด)
  
        if (province) {
          await collectionRef.doc(doc.id).update({
            province: province.toLowerCase() // บันทึกเป็นตัวพิมพ์เล็ก
          });
  
          console.log(`Updated gymId ${data.gymId} with province: ${province}`);
        }
      });
    } catch (error) {
      console.error("Error updating province field:", error);
    }
  };
  
  // รันฟังก์ชันนี้เพื่ออัปเดต Firestore
  updateProvinceField();
  