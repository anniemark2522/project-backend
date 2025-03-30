import db from "../config/firebase.js"; // การเชื่อมต่อกับ Firebase

export const getData = async (req, res) => {
  try {
    const { gymId, name, loca } = req.query;
    let collectionRef1 = db.collection("GymsLatLong");
    let collectionRef2 = db.collection("gymsprovince_eng");

    // กรองตาม gymId หากมี
    if (gymId) {
      collectionRef1 = collectionRef1.where("gymId", "==", gymId); 
      collectionRef2 = collectionRef2.where("gymId", "==", gymId);
    }

    // กรองตาม name หากมี
    let decodedName = null;
    if (name) {
      decodedName = decodeURIComponent(name).toLowerCase();
      console.log(`Searching for: ${decodedName}`);

      // ค้นหาค่าที่เริ่มต้นด้วยคำค้นหา (case-insensitive)
      collectionRef1 = collectionRef1
      .orderBy("name") // เรียงลำดับตามชื่อ
      .startAt(decodedName)  // เริ่มต้นจากคำค้นหา
      .endAt(decodedName + "\uf8ff");  // ครอบคลุมชื่อที่เริ่มต้นด้วยคำค้นหา

      collectionRef2 = collectionRef2
      .orderBy("name") // เรียงลำดับตามชื่อ
      .startAt(decodedName)  // เริ่มต้นจากคำค้นหา
      .endAt(decodedName + "\uf8ff");  // ครอบคลุมชื่อที่เริ่มต้นด้วยคำค้นหา

    }

    // กรองตาม location หากมี
    if (loca) {
      const decodedLoca = decodeURIComponent(loca).toLowerCase();
      console.log(`Searching for Province: ${decodedLoca}`);

      collectionRef1 = collectionRef1.where("province", "==", decodedLoca); // ใช้ "province" แทน "location"
      collectionRef2 = collectionRef2.where("province", "==", decodedLoca); // ใช้ "province" แทน "location"
    }

    const [snapshot1, snapshot2,] = await Promise.all([
      collectionRef1.get(),
      collectionRef2.get(),
    ]);

    // หากไม่พบข้อมูล
    if (snapshot1.empty && snapshot2.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    // ดึงข้อมูลจาก Firestore
    const data1 = snapshot1.docs.map(doc => doc.data());
    const data2 = snapshot2.docs.map(doc => doc.data());

    let combineData = [...data1, ...data2];



    if (combineData.length === 0) {
      return res.status(404).json({ message: "No matching data found" });
    }

    return res.status(200).json(combineData);
    
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
