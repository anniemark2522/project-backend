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

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dbmuaythai-50c15-firebase-adminsdk-fbsvc-04309008a3.json'), 'utf8'));

// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Function to update only the 'image' field in Firestore
const updateGymImages = async (jsonFilePath) => {
    try {
        // Load data from JSON file
        const data = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
        console.log('Data loaded:', data);

        // Reference to Firestore
        const db = admin.firestore();
        const gymsCollectionRef = db.collection('detailGym');
        console.log('Connected to Firestore');

        // Loop through each gym and update 'image' field
        for (const gym of data) {
            if (!gym.gymId || gym.gymId.trim() === '') {
                console.log('Skipping gym due to invalid gymId:', gym);
                continue; // Skip gyms with no gymId
            }

            const docRef = gymsCollectionRef.doc(gym.gymId); // Use gymId as document reference
            await docRef.update({
                image: admin.firestore.FieldValue.arrayUnion(...gym.image)
            });
            console.log(`Updated images for gym: ${gym.name}`);
        }

        console.log('Image update completed!');
    } catch (error) {
        console.error('Error updating images in Firestore:', error);
    }
};

// เรียกใช้ฟังก์ชันกับไฟล์ JSON ที่ต้องการอัปเดต
updateGymImages(path.resolve(__dirname, '../db/detail_gym_now.json'));
