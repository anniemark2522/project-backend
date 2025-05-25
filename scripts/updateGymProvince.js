import db from "../config/firebase.js";

async function updateGymsWithProvince() {
  try {
    const classSnap = await db.collection("detailGymClasses").get();

    for (const doc of classSnap.docs) {
      const gymId = doc.id;
      const data = doc.data();
      const province = data?.province;

      if (province) {
        const gymRef = db.collection("detailGym").doc(gymId);
        await gymRef.update({ province });
        console.log(`Updated gym ${gymId} with province: ${province}`);
      } else {
        console.warn(`No province found for gym ${gymId}`);
      }
    }

    console.log("All gyms updated with province.");
  } catch (error) {
    console.error("Failed to update gyms with province:", error);
  }
}

updateGymsWithProvince();
