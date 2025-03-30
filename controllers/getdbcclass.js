import db from "../config/firebase.js"; // การเชื่อมต่อกับ Firebase

export const getGymClasses = async (req, res) => {
  try {
    const { gymId, name, loca } = req.query;
    let collectionRef = db.collection("detailGymClasses");

    // กรองตาม gymId หากมี
    if (gymId) {
      collectionRef = collectionRef.where("gymId", "==", gymId); 
    }

    // กรองตาม name หากมี
    let decodedName = null;
    if (name) {
      decodedName = decodeURIComponent(name).toLowerCase();
      console.log(`Searching for: ${decodedName}`);

      // ค้นหาค่าที่เริ่มต้นด้วยคำค้นหา (case-insensitive)
      collectionRef = collectionRef
      .orderBy("name") // เรียงลำดับตามชื่อ
      .startAt(decodedName)  // เริ่มต้นจากคำค้นหา
      .endAt(decodedName + "\uf8ff");  // ครอบคลุมชื่อที่เริ่มต้นด้วยคำค้นหา
    }

    // กรองตาม location หากมี
    if (loca) {
      const decodedLoca = decodeURIComponent(loca).toLowerCase();
      console.log(`Searching for Province: ${decodedLoca}`);

      collectionRef = collectionRef.where("province", "==", decodedLoca); // ใช้ "province" แทน "location"
    }

    const [snapshot1] = await Promise.all([
      collectionRef.get(),
    ]);

    // หากไม่พบข้อมูล
    if (snapshot1.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    // ดึงข้อมูลจาก Firestore
    const data = snapshot1.docs.map(doc => {
      const docData = doc.data();
      return {
        ...docData,
        classes: docData.classes || []  // ดึง classes ด้วย
      };
    });

    let combineData = [...data];

    // 📌 ถ้ามี name ให้ filter ตาม name หรือ className
    if (decodedName) {
      combineData = combineData.filter(gym => {
        const gymNameMatch = gym.name.toLowerCase().includes(decodedName);
        const classNameMatch = gym.classes?.some(cls =>
          cls.className.toLowerCase().includes(decodedName)
        );
        return gymNameMatch || classNameMatch;  // ชื่อ gym หรือชื่อ class ตรงก็ได้
      });
    }

    // กรองข้อมูล classes ตาม className ถ้ามีการกรอกคำค้นหา
    if (decodedName) {
      combineData = combineData.map(gym => {
        // กรองคลาสภายใน gym ตามชื่อคลาส
        const filteredClasses = gym.classes.filter(cls =>
          cls.className.toLowerCase().includes(decodedName)
        );
        return { ...gym, classes: filteredClasses };
      }).filter(gym => gym.classes.length > 0); // เอาเฉพาะ gym ที่มี class ที่ตรงกับคำค้นหา
    }

    if (combineData.length === 0) {
      return res.status(404).json({ message: "No matching data found" });
    }

    return res.status(200).json(combineData);
    
  } catch (error) {
    console.error("Error fetching data from Firestore:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
