import db from "../config/firebase.js"; // การเชื่อมต่อกับ Firebase

export const getDataAdmin = async (req, res) => {
  try {
    const { gymId, name, loca } = req.query;
    let collectionRef1 = db.collection("testadmin");

    console.log("Received query params:", { gymId, name, loca }); // Debug ค่า query params

    // กรองตาม gymId หากมี
    if (gymId) {
      console.log(`Filtering by gymId: ${gymId}`);
      collectionRef1 = collectionRef1.where("gymId", "==", String(gymId)); // แปลงเป็น String ก่อนกรอง
    }

    // กรองตาม name หากมี
    if (name) {
      const decodedName = decodeURIComponent(name).toLowerCase();
      console.log(`Searching for Name: ${decodedName}`);

      // เพิ่ม orderBy เพื่อรองรับการค้นหาตามตัวอักษร
      collectionRef1 = collectionRef1
        .orderBy("name")
        .startAt(decodedName)
        .endAt(decodedName + "\uf8ff");
    }

    // กรองตาม location หากมี
    if (loca) {
      const decodedLoca = decodeURIComponent(loca).toLowerCase();
      console.log(`Searching for Province: ${decodedLoca}`);

      collectionRef1 = collectionRef1.where("province", "==", decodedLoca);
    }

    const snapshot1 = await collectionRef1.get();

    // หากไม่พบข้อมูล
    if (snapshot1.empty) {
      console.log("No data found");
      return res.status(404).json({ message: "No data found" });
    }

    // ดึงข้อมูลจาก Firestore
    const data1 = snapshot1.docs.map((doc) => doc.data());

    if (data1.length === 0) {
      console.log("No matching data found");
      return res.status(404).json({ message: "No matching data found" });
    }

    console.log("Data found:", data1);
    return res.status(200).json(data1);
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
