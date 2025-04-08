import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountPath),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

export default db;
