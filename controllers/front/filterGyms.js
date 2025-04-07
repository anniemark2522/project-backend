import db from "../../config/firebase.js"; // การเชื่อมต่อกับ Firebase

const targetGymIds = ["1", "15", "26", "37", "41", "44", "46", "48", "49", "50"];

export const getFilteredGyms = async (req, res) => {
  try {
    // รับค่าพารามิเตอร์ location จาก query string (จาก URL เช่น /api/filtergym?location=Phuket)
    const locationFilter = req.query.location;

    // ดึงข้อมูลค่ายมวยจาก Firestore
    const gymsRef = db.collection("detailGym");
    const gymsSnapshot = await gymsRef.where("gymId", "in", targetGymIds).get();

    // ดึงข้อมูลตำแหน่งจาก Firestore
    const locationsRef = db.collection("GymsLatLong");
    const locationsSnapshot = await locationsRef.where("gymId", "in", targetGymIds).get();

    // สร้าง map สำหรับเก็บข้อมูลตำแหน่ง (location)
    const locationMap = {};
    locationsSnapshot.forEach(doc => {
      const locationData = doc.data();
      locationMap[locationData.gymId] = locationData;
    });

    // สร้างข้อมูลค่ายมวยและรวมข้อมูลตำแหน่ง
    const filteredGyms = gymsSnapshot.docs.map(doc => {
      const gymData = doc.data();
      const locationData = locationMap[doc.id]; // ใช้ gymId ค้นหาข้อมูลตำแหน่ง

      // ตัดข้อมูล location เพื่อให้แสดงแค่ชื่อจังหวัด
      const location = locationData?.location?.split(",")[1]?.trim() || "Unknown";

      return {
        image: gymData.image [1],
        location: location // แสดงแค่ชื่อจังหวัด
      };
    });

    // กรองตาม location หากมีการส่งมาใน query string
    const filteredByLocation = locationFilter
      ? filteredGyms.filter(gym => gym.location.toLowerCase() === locationFilter.toLowerCase())
      : filteredGyms;

    res.json(filteredByLocation); // ส่งข้อมูลที่กรองแล้ว
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).send("Error fetching gym data.");
  }
};
