import db from "../../config/firebase.js";

export const getAttractions = async (req, res) => {
  try {
    const { attId, type } = req.query;
    let collectionRef = db.collection("attraction");
    if (attId) {
      collectionRef = collectionRef.where("attId", "==", attId);
    }

    if (type) {
      collectionRef = collectionRef.where("type", "==", type.toLowerCase());
    }

    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No data found" });
    }

    const data = snapshot.docs.map(doc => doc.data());

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching attractions:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
