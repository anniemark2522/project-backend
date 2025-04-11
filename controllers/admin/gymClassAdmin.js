import db from "../../config/firebase.js";

// ลบคลาสตาม index
export const deleteGymClass = async (req, res) => {
    const { gymId, index } = req.params;
  
    try {
      const snapshot = await db
        .collection("detailGymClasses")
        .where("gymId", "==", gymId)
        .get();
  
      if (snapshot.empty) {
        return res.status(404).json({ message: "Gym classes not found" });
      }
  
      const doc = snapshot.docs[0];
      const data = doc.data();
  
      const updatedClasses = (data.classes || []).filter((_, i) => i !== parseInt(index));
      await db.collection("detailGymClasses").doc(doc.id).update({ classes: updatedClasses });
  
      return res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
      console.error("Error deleting class:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// เพิ่มคลาสใหม่
export const addGymClass = async (req, res) => {
    const { gymId } = req.params;
    const newClass = req.body;
  
    try {
      const snapshot = await db
        .collection("detailGymClasses")
        .where("gymId", "==", gymId)
        .get();
  
      if (snapshot.empty) {
        return res.status(404).json({ message: "Gym classes not found" });
      }
  
      const doc = snapshot.docs[0];
      const data = doc.data();
  
      const updatedClasses = [...(data.classes || []), newClass];
      await db.collection("detailGymClasses").doc(doc.id).update({ classes: updatedClasses });
  
      return res.status(200).json({ message: "Class added successfully" });
    } catch (error) {
      console.error("Error adding class:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

// แก้ไขคลาส
export const updateGymClass = async (req, res) => {
    const { gymId, index } = req.params;
    const updatedClass = req.body;
  
    try {
      console.log("PATCHING class:", { gymId, index });
  
      const snapshot = await db
        .collection("detailGymClasses")
        .where("gymId", "==", gymId)
        .get();
  
      if (snapshot.empty) {
        console.log("❌ No document found with gymId:", gymId); // 💥 Log นี้จะบอกตรงๆ ว่าไม่เจอ
        return res.status(404).json({ message: "Gym classes not found" });
      }
  
      const doc = snapshot.docs[0];
      const data = doc.data();
  
      const classes = data.classes || [];
      classes[parseInt(index)] = updatedClass;
  
      await db.collection("detailGymClasses").doc(doc.id).update({ classes });
  
      return res.status(200).json({ message: "Class updated successfully" });
    } catch (error) {
      console.error("🔥 Error updating class:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  

