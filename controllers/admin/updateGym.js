import admin from "firebase-admin";

const updateGym = async (req, res) => {
  const { gymId } = req.params; // gymId จะอยู่ใน params
  console.log("Updating gym with ID:", gymId);  // Log gymId
  const { name, location, description, image, openHours, url } = req.body;
  console.log("Received query params:", { name, location, description, image, openHours, url }); // Debug ค่า query params

  try {
    const gymRef = admin.firestore().collection("testadmin").doc(gymId);
    const gymDoc = await gymRef.get();

    // ตรวจสอบว่า gym นี้มีอยู่ใน Firestore หรือไม่
    if (!gymDoc.exists) {
      console.error(`Gym with ID ${gymId} not found.`);
      return res.status(404).json({ error: "Gym not found" });
    }

    // อัปเดตข้อมูล gym
    await gymRef.update({
      name,
      location,
      description,
      image,
      openHours,
      url
    });

    return res.status(200).json({ message: "Gym updated successfully" });
  } catch (error) {
    console.error("Error updating gym:", error);
    return res.status(500).json({ error: "Failed to update gym" });
  }
};

export { updateGym };
