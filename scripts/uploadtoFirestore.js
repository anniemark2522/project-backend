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
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dbmuaythai-50c15-firebase-adminsdk-fbsvc-9e5d7ecae4.json'), 'utf8'));

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});
// Function to upload JSON data to Firestore
const uploadJSONToFirestore = async (jsonFilePath) => {
    try {
      // Load data from JSON file
      const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
      console.log('Data loaded:', data);
  
      // Reference to Firestore
      const db = admin.firestore();
      const gymsCollectionRef = db.collection('food');
      console.log('Connected to Firestore');
  
      // Loop through each gym and upload to Firestore
      for (const food of data) {
        if (!food.foodId || food.foodId.trim() === '') {
          console.log('Skipping food due to invalid foodId:', food);
          continue;
        }
  
        const docRef = gymsCollectionRef.doc(food.foodId); // Use gymId as document reference
        await docRef.set(food); // Upload gym data
        console.log(`Added acc: ${food.name}`);
      }
  
      console.log('Data upload completed!');
    } catch (error) {
      console.error('Error uploading data to Firestore:', error);
    }
  };

// เรียกใช้ฟังก์ชันกับไฟล์ JSON ที่คุณต้องการอัปโหลด
uploadJSONToFirestore('../db/food_category.json');  // กำหนดพาธของไฟล์ JSON
// const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../db/detail_gym_now.json'), 'utf8'));

