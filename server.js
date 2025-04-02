import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
// import { verifyClerkToken } from "../middlewares/clerkToFirebase.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api", routes);
// app.use("/api", verifyClerkToken, routes);  // ใช้ middleware ในการตรวจสอบ token

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
