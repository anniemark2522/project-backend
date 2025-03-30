import admin from "firebase-admin";

const deleteGym = async (req, res) => {
    const { gymId } = req.params; // gymId from params
    console.log("Deleting gym with ID:", gymId); // Log to ensure we are getting the correct gymId
  
    try {
      const gymRef = admin.firestore().collection("testadmin").doc(gymId);
      const gymDoc = await gymRef.get();
  
      if (!gymDoc.exists) {
        console.log(`Gym with ID: ${gymId} not found`);  // Log if gym not found
        return res.status(404).json({ error: "Gym not found" });
      }
  
      await gymRef.delete();
      console.log(`Successfully deleted gym with ID: ${gymId}`);  // Log when gym is deleted
      return res.status(200).json({ message: "Gym deleted successfully" });
    } catch (error) {
      console.error(`Error deleting gym with ID: ${gymId}:`, error);  // Log error if any
      return res.status(500).json({ error: "Failed to delete gym" });
    }
  };
  

  export { deleteGym };

  