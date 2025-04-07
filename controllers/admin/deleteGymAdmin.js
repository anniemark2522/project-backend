import admin from "firebase-admin";

const deleteGymAdmin = async (req, res) => {
    const { gymId } = req.params; 
    console.log("Deleting gym with ID:", gymId); 
  
    try {
      const gymRef = admin.firestore().collection("detailGym").doc(gymId);
      const gymDoc = await gymRef.get();
  
      if (!gymDoc.exists) {
        console.log(`Gym with ID: ${gymId} not found`);
        return res.status(404).json({ error: "Gym not found" });
      }
  
      await gymRef.delete();
      console.log(`Successfully deleted gym with ID: ${gymId}`);
      return res.status(200).json({ message: "Gym deleted successfully" });
    } catch (error) {
      console.error(`Error deleting gym with ID: ${gymId}:`, error);
      return res.status(500).json({ error: "Failed to delete gym" });
    }
  };

  export { deleteGymAdmin };

  