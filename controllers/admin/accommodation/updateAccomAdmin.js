import db from "../../../config/firebase.js";

export const updateAccommodation = async (req, res) => {
    try {
      const { hotelId } = req.params; //เอามาจาก URL
      const updateData = req.body;
  
      if (!hotelId) {
        return res.status(400).json({ message: "hotelId is required." });
      }
  
      await db.collection("accommodation").doc(hotelId).update(updateData);
  
      return res.status(200).json({ message: "Accommodation updated", data: updateData });
    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
