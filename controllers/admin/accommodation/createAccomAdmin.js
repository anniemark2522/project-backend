import db from "../../../config/firebase.js";

export const createAccommodation = async (req, res) => {
  try {
    const {
      name,
      type,
      location,
      province,
      description,
      open_hours,
      contact,
      website,
      map_url,
      image,
    } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "Name and location are required." });
    }

    const snapshot = await db.collection("accommodation").get();
    const ids = snapshot.docs.map(doc => parseInt(doc.id)).filter(n => !isNaN(n));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const hotelId = String(nextId);

    const newHotel = {
      hotelId,
      name,
      type,
      location,
      province,
      description,
      open_hours,
      contact,
      website,
      map_url,
      image,
    };

    await db.collection("accommodation").doc(hotelId).set(newHotel);

    return res.status(201).json({ message: "Accommodation created", hotelId, data: newHotel });
  } catch (error) {
    console.error("Create error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
