import db from "../../config/firebase.js";

export const getGymsWithClasses = async (req, res) => {
  try {
    const gymsSnapshot = await db.collection("detailGym").get();

    if (gymsSnapshot.empty) {
      return res.status(404).json({ message: "No gyms found" });
    }

    const gyms = await Promise.all(
      gymsSnapshot.docs.map(async (doc) => {
        const gymData = doc.data();
        const gymId = doc.id;

        // ดึงคลาสฝึกซ้อมที่มี gymId ตรงกับค่ายมวยนี้
        const classesSnapshot = await db
          .collection("detailGymClasses")
          .where("gymId", "==", gymId)
          .get();

        const classes = classesSnapshot.docs.map((classDoc) => classDoc.data());

        return {
          gymId,
          name: gymData.name,
          province: gymData.province || "",
          description: gymData.description || "",
          image: gymData.image?.[0] || "",
          openHours: gymData.openHours || {},
          classes,
        };
      })
    );

    return res.status(200).json(gyms);
  } catch (error) {
    console.error("Error fetching gyms with classes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
