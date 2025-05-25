import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

//อ่าน .env และตั้ง __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  console.error('FIREBASE_SERVICE_ACCOUNT_PATH is not defined in the .env file.');
  process.exit(1);
}

//โหลด service account
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, '../dbmuaythai-50c15-firebase-adminsdk-fbsvc-9e5d7ecae4.json'),
    'utf8'
  )
);

//Firebase init
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

//แก้ชื่อฟิลด์ใน gymsprovince_eng
const updateLatLngFields = async () => {
  try {
    const db = admin.firestore();
    const gymsRef = db.collection('gymsprovince_eng');
    const snapshot = await gymsRef.get();

    console.log(`Total documents: ${snapshot.size}`);

    const batch = db.batch();

    snapshot.forEach((doc) => {
      const data = doc.data();
      const docRef = gymsRef.doc(doc.id);

      const updates = {};

      if (data.locationLat !== undefined) {
        updates.lat = data.locationLat;
        updates.locationLat = admin.firestore.FieldValue.delete();
      }

      if (data.locationLng !== undefined) {
        updates.long = data.locationLng;
        updates.locationLng = admin.firestore.FieldValue.delete();
      }

      if (Object.keys(updates).length > 0) {
        batch.update(docRef, updates);
      }
    });

    await batch.commit();
    console.log('Updated lat/long fields successfully!');
  } catch (err) {
    console.error('Error updating documents:', err);
  }
};

updateLatLngFields();
