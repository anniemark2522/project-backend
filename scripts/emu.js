import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, doc, setDoc } from "firebase/firestore";
import gymsData from "../db/gym_location2.json" assert { type: "json" };

const app = initializeApp({ projectId: "demo-emulator-project" });
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080);

async function importGyms() {
  for (const gym of gymsData) {
    const id = gym.gymId || Math.random().toString(36).substring(2, 9);
    console.log("📦 เพิ่มเข้า GymsLatLong:", id, gym.name);
    await setDoc(doc(db, "GymsLatLong", id), gym); // ✅ ชื่อคอลเลกชันตรงตามที่ใช้จริง
  }
  console.log("✅ Import gyms.json เข้าสู่ Firestore Emulator เรียบร้อยแล้ว!");
}

importGyms();
