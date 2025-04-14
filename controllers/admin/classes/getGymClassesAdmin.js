import db from "../../../config/firebase.js";

export const getGymClassesAdmin = async (req, res) => {
  try {
    const { gymId } = req.query;
    if (!gymId) {
      return res.status(400).json({ error: "Missing gymId" });
    }

    const snapshot = await db
      .collection("detailGymClasses")
      .where("gymId", "==", gymId)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No classes found for this gym" });
    }

    const classes = snapshot.docs.map(doc => doc.data());
    return res.status(200).json(classes);
  } catch (error) {
    console.error("[Admin] Error fetching gym classes:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

