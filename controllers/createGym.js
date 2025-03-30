import admin from "firebase-admin";

const createGym = async (req, res) => {
  const { gymId, name, location, description, image, openHours, url } = req.body;

  try {
    // Check if gymId already exists
    const gymRef = admin.firestore().collection("testadmin").doc(gymId);
    const gymDoc = await gymRef.get();

    if (gymDoc.exists) {
      return res.status(400).json({ error: "Gym with this ID already exists" });
    }

    // Add new gym to Firestore
    await gymRef.set({
      gymId,
      name,
      location,
      description,
      image,
      openHours,
      url
    });

    return res.status(201).json({ message: "Gym created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Failed to create gym" });
  }
};

export { createGym };
