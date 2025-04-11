import admin from "firebase-admin";
import dotenv from "dotenv";
import serviceAccount from "../dbmuaythai-50c15-firebase-adminsdk-fbsvc-9e5d7ecae4.json" assert { type: "json" };

dotenv.config();

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore();
export default db;
