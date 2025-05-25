import admin from 'firebase-admin';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// ใช้ import.meta.url แทน __dirname ใน ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

if (!process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  console.error('FIREBASE_SERVICE_ACCOUNT_PATH is not defined in the .env file.');
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../dbmuaythai-50c15-firebase-adminsdk-fbsvc-04309008a3.json'), 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();
const mapboxAccessToken = 'pk.eyJ1IjoibWVlZWxvIiwiYSI6ImNtNmozbWFhZTBjdzYyaXFzbzZqZ3U4aWoifQ.NzVsCvNXJPT8AUPGbfkd8g'; // ใส่ Mapbox Token ที่ถูกต้อง

// ฟังก์ชันดึงข้อมูลจาก Firestore และอัปเดตพิกัดใหม่
const getGymsProvinceData = async () => {
  try {
    const gymsCollectionRef = db.collection('gymsprovince_eng');
    const gymsSnapshot = await gymsCollectionRef.get();

    if (gymsSnapshot.empty) {
      console.log('No gyms found in Firestore.');
      return;
    }

    const gyms = [];
    gymsSnapshot.forEach(doc => {
      const gymData = doc.data();
      gyms.push({
        gymId: doc.id,
        name: gymData.name,
        province: gymData.province,
      });
    });

    console.log(`Fetched ${gyms.length} gyms from Firestore.`);

    for (const gym of gyms) {
      if (gym.name && gym.province) {
        const fullAddress = `${gym.name} Muay Thai Gym, ${gym.province}, Thailand`;
        console.log(`Fetching coordinates for: ${fullAddress}`);

        const coordinates = await getCoordinatesFromMapbox(fullAddress);

        if (!coordinates) {
          fullAddress = `${gym.name}, ${gym.province}, Thailand`;
          console.log(`Retrying with: ${fullAddress}`);
          coordinates = await getCoordinatesFromMapbox(fullAddress);
        }

        if (coordinates) {
          console.log(`Updating ${gym.name}: Lat ${coordinates.lat}, Lng ${coordinates.lng}`);
          await db.collection('gymsprovince_eng').doc(gym.gymId).set({
            locationLat: coordinates.lat,
            locationLng: coordinates.lng,
          }, { merge: true });

          // ป้องกันการส่ง API เร็วเกินไป (Rate Limit)
          await new Promise(res => setTimeout(res, 1000));
        } else {
          console.warn(`Failed to find coordinates for: ${fullAddress}`);
        }
      }
    }

    console.log('Location updates completed for all gyms.');
  } catch (error) {
    console.error('Error getting gyms data from Firestore:', error);
  }
};

// ฟังก์ชันเรียกใช้ Mapbox API
const getCoordinatesFromMapbox = async (address) => {
  try {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxAccessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].geometry.coordinates;
      return { lat, lng };
    } else {
      console.warn(`Location not found: ${address}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${address}:`, error);
    return null;
  }
};

// เรียกใช้งานฟังก์ชัน
getGymsProvinceData();
