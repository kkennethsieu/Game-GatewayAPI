import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { gatewayRouter } from "./routes/gatewayRoutes.js";
import { gamesRouter } from "./routes/catalog.js";
import { usersRouter } from "./routes/users.js";
import { reviewsRouter } from "./routes/reviews.js";
import { notificationRouter } from "./routes/notification.js";
import { likesRouter } from "./routes/likes.js";

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

app.get("/", (req, res) => {
  res.json("Gateway service is running");
});

app.use("/gateway", gatewayRouter);

app.use("/api/users", usersRouter);
app.use("/api/games", gamesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/likes", likesRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

export default app;
