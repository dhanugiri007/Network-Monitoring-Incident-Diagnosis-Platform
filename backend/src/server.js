import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { syncModels } from "./models/index.js";
import "./config/redis.js"; 
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  await syncModels();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

start();