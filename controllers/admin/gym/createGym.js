import db from "../../../config/firebase.js";
import fetch from "node-fetch";

export const createGym = async (req, res) => {
  try {
    const {
      name,
      url,
      description,
      openHours,
      location,
      image,
      province,
    } = req.body;

    // ตรวจสอบฟิลด์ที่จำเป็น
    if (!name || !location || !province) {
      return res.status(400).json({ message: "Name, location, and province are required" });
    }

    // 🔢 สร้าง gymId ใหม่ (เลขลำดับ +1)
    const snapshot = await db.collection("detailGym").get();
    const ids = snapshot.docs
      .map((doc) => parseInt(doc.id))
      .filter((n) => !isNaN(n));
    const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
    const gymId = String(nextId);

    // 📝 สร้างข้อมูล detailGym
    const newGymData = {
      gymId,
      name,
      url: url || "",
      description: description || "",
      openHours: openHours || {},
      location,
      image: image || [],
      province: province || "",
    };

    // ✅ บันทึกลง detailGym
    await db.collection("detailGym").doc(gymId).set(newGymData);

    // 🌍 ใช้ Mapbox Geocoding หาพิกัด
    const mapboxToken = process.env.MAPBOX_TOKEN;
    const fullAddress = `${name} ${province}`;
    const geoRes = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        fullAddress
      )}.json?access_token=${mapboxToken}`
    );
    const geoData = await geoRes.json();

    if (geoData?.features?.[0]) {
      const [lng, lat] = geoData.features[0].center;

      const gymLocationData = {
        gymId,
        name,
        location,
        province: province.toLowerCase(),
        lat: lat.toString(),
        long: lng.toString(),
        url: url || "",
      };

      // ✅ บันทึกลง GymsLatLong ด้วย gymId เดียวกัน
      await db.collection("GymsLatLong").doc(gymId).set(gymLocationData);
    } else {
      console.warn("⚠️ Geocoding failed: Cannot find coordinates.");
    }

    return res.status(201).json({
      message: "Gym created successfully",
      gymId,
      data: newGymData,
    });
  } catch (error) {
    console.error("❌ Error creating gym:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// import db from "../../../config/firebase.js";

// export const createGym = async (req, res) => {
//   try {
//     const {
//       name,
//       url,
//       description,
//       openHours,
//       location,
//       image,
//       province,
//     } = req.body;

//     // ตรวจสอบ field ที่จำเป็น
//     if (!name || !location) {
//       return res.status(400).json({ message: "Name and location are required" });
//     }

//     // 🔢 คำนวณ gymId ใหม่ (max + 1)
//     const snapshot = await db.collection("detailGym").get();
//     const ids = snapshot.docs
//       .map(doc => parseInt(doc.id))
//       .filter(n => !isNaN(n));
//     const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1;
//     const gymId = String(nextId);

//     // เตรียมข้อมูล
//     const newGymData = {
//       gymId,
//       name,
//       url: url || "",
//       description: description || "",
//       openHours: openHours || {},
//       location,
//       image: image || [],
//       province: province || "",
//     };

//     // บันทึกลง Firebase
//     await db.collection("detailGym").doc(gymId).set(newGymData);

//     return res.status(201).json({
//       message: "Gym created successfully",
//       gymId,
//       data: newGymData,
//     });
//   } catch (error) {
//     console.error("❌ Error creating gym:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// };
