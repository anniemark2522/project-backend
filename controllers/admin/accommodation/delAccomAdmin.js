import db from "../../../config/firebase.js";

export const deleteAccommodation = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!hotelId) {
      return res.status(400).json({ message: "hotelId is required." });
    }

    await db.collection("accommodation").doc(hotelId).delete();

    return res.status(200).json({ message: `Deleted accommodation ${hotelId}` });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
