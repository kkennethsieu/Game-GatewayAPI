import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import gatewayRoutes from "./routes/gatewayRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/gateway", gatewayRoutes);

app.get("/", (req, res) => {
  res.json("Gateway service is running");
});

export default app;
