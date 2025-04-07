import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import generalRoutes from "./routes/index.js";
import adminRoutes from "./routes/adminRoutes.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use("/api", generalRoutes);
app.use("/api", adminRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
