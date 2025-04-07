import db from "../../config/firebase.js";

export const getGymsAdmin = async (req, res) => {
  try {
    const { gymId, name, loca } = req.query;
    let collectionRef = db.collection("detailGym");

    if (gymId) {
      collectionRef = collectionRef.where("gymId", "==", String(gymId));
    }

    if (name) {
      const decodedName = decodeURIComponent(name).toLowerCase();
      collectionRef = collectionRef
        .orderBy("name")
        .startAt(decodedName)
        .endAt(decodedName + "\uf8ff");
    }

    if (loca) {
      const decodedLoca = decodeURIComponent(loca).toLowerCase();
      collectionRef = collectionRef.where("province", "==", decodedLoca);
    }

    const snapshot = await collectionRef.get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    const data = snapshot.docs.map(doc => doc.data());
    return res.status(200).json(data);
  } catch (error) {
    console.error("[Admin] Error fetching gyms:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

