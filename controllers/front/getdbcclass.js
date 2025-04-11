import db from "../../config/firebase.js";

export const getGymClasses = async (req, res) => {
  try {
    const { gymId, name, loca } = req.query;
    let gyms = [];

    // ถ้า filter โดย gymId → ใช้ doc() จะเร็วและไม่เปลือง read
    if (gymId) {
      const doc = await db.collection("detailGymClasses").doc(gymId).get();
      if (!doc.exists) {
        return res.status(404).json({ message: "No gym found" });
      }
      const data = doc.data();
      gyms.push({ ...data, gymId: doc.id, classes: data.classes || [] });
    } else {
      // ถ้าไม่มี gymId → โหลดทั้งหมด (แนะนำให้มี index filter เพิ่ม)
      const snapshot = await db.collection("detailGymClasses").get();
      gyms = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          gymId: doc.id,
          classes: data.classes || []
        };
      });
    }

    let filteredGyms = [...gyms];

    // 🔍 filter by name (gymName or className)
    if (name) {
      const search = decodeURIComponent(name).toLowerCase();

      filteredGyms = filteredGyms
        .filter(gym => {
          const matchGymName = gym.name?.toLowerCase().includes(search);
          const matchClassName = gym.classes?.some(c =>
            c.className?.toLowerCase().includes(search)
          );
          return matchGymName || matchClassName;
        })
        .map(gym => ({
          ...gym,
          classes: gym.classes.filter(c =>
            c.className?.toLowerCase().includes(search)
          )
        }))
        .filter(gym => gym.classes.length > 0 || gym.name.toLowerCase().includes(search));
    }

    // 🌍 filter by province
    if (loca) {
      const province = decodeURIComponent(loca).toLowerCase();
      filteredGyms = filteredGyms.filter(gym =>
        gym.province?.toLowerCase() === province
      );
    }

    if (filteredGyms.length === 0) {
      return res.status(404).json({ message: "No matching data found" });
    }

    return res.status(200).json(filteredGyms);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
