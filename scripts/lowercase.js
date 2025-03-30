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

// ฟังก์ชันที่จะอัปเดตข้อมูล
const updateDataToLowerCase = async () => {
  try {
    const collectionRef = db.collection("detailGymClasses"); // ชื่อ collection ของคุณ
    const snapshot = await collectionRef.get(); // ดึงข้อมูลทั้งหมดจาก collection

    if (snapshot.empty) {
      console.log("No documents found!");
      return;
    }

    // สำหรับเอกสารแต่ละตัว
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      // const gymId = data.gymId;
      const name = data.name;
      // const location = data.location;
      const province = data.province;
      const location = data.location;

      // แปลง name เป็นตัวพิมพ์เล็ก
      const nameLower = name.toLowerCase();
      // const locationLower = location.toLowerCase();
      const provinceLower = province.toLowerCase();
      const locationLower = location.toLowerCase();

      // อัปเดต Firestore โดยใช้ gymId เป็นตัวระบุเอกสาร
      await collectionRef.doc(doc.id).update({
        name: nameLower ,// อัปเดตชื่อให้เป็นตัวพิมพ์เล็ก
        // location: locationLower,
        province: provinceLower,
        location: locationLower
      });

      console.log(`Updated with name: ${nameLower},province: ${provinceLower},location ${locationLower}`);
    });

  } catch (error) {
    console.error("Error updating data:", error);
  }
};

// เรียกใช้ฟังก์ชันนี้เพื่อทำการอัปเดตข้อมูล
updateDataToLowerCase();
