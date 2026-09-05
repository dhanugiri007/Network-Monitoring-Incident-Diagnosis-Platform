import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

export const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // set this on Railway once Vercel URL exists
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);