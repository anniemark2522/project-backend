import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// ใช้ import.meta.url แทน __dirname ใน ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);  // ดูว่าค่าที่อ่านได้เป็นพาธที่ถูกต้อง

// ตรวจสอบว่าตัวแปร FIREBASE_SERVICE_ACCOUNT_PATH ถูกกำหนดแล้ว
if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
    console.error('FIREBASE_SERVICE_ACCOUNT_PATH is not defined in the .env file.');
    process.exit(1);
  }
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dbmuaythai-50c15-firebase-adminsdk-fbsvc-04309008a3.json'), 'utf8'));

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
const uploadJSONToFirestore = async (jsonFilePath) => {
    try {
      // Load data from JSON file
      const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      console.log('Data loaded:', data);
  
      // Reference to Firestore
      const db = admin.firestore();
      const gymsCollectionRef = db.collection('gymsprovince_eng');
      console.log('Connected to Firestore');
  
      // Loop through each province
      for (const province in data) {
        if (Object.prototype.hasOwnProperty.call(data, province)) {
          const gyms = data[province]; // Get the list of gyms for this province
  
          // Loop through gyms and upload to Firestore
          for (const gymName of gyms) {
            if (!gymName || gymName.trim() === '') {
              console.log('Skipping empty gym name in province:', province);
              continue;
            }
  
            // Create a unique document ID using province and gym name
            const docId = `${province}-${gymName}`.replace(/\s+/g, '-'); // Replace spaces with dashes
  
            const docRef = gymsCollectionRef.doc(docId);
            await docRef.set({
              province: province.replace(/\s*\(\d+\)\s*/, ''), // Remove number in parentheses
              name: gymName,
            });
  
            console.log(`Added gym: ${gymName} in ${province}`);
          }
        }
      }
  
      console.log('Data upload completed!');
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
    }
  };
  
// เรียกใช้ฟังก์ชันกับไฟล์ JSON ที่คุณต้องการอัปโหลด
uploadJSONToFirestore('../db/new_gyms_by_province.json');  // กำหนดพาธของไฟล์ JSON
// const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../db/detail_gym_now.json'), 'utf8'));

