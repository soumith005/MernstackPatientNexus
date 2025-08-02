import express from "express";
import { dbConnection } from "./database/dbConnection.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// API Routes
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/appointment", appointmentRouter);

// Health check endpoint for Render
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString()
  });
});

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// Serve static files from dashboard/dist (if it exists)
const dashboardDistPath = path.join(__dirname, "../dashboard/dist");
if (fs.existsSync(dashboardDistPath)) {
  app.use("/dashboard", express.static(dashboardDistPath));
} else {
  console.log("Dashboard dist folder not found, skipping dashboard static files");
}

// Root route - serve frontend
app.get("/", (req, res) => {
  const frontendPath = path.join(__dirname, "../frontend/dist/index.html");
  if (fs.existsSync(frontendPath)) {
    res.sendFile(frontendPath);
  } else {
    res.status(404).json({ error: "Frontend not built" });
  }
});

// Dashboard route
app.get("/dashboard", (req, res) => {
  const dashboardPath = path.join(__dirname, "../dashboard/dist/index.html");
  if (fs.existsSync(dashboardPath)) {
    res.sendFile(dashboardPath);
  } else {
    res.status(404).json({ 
      error: "Dashboard not built", 
      message: "Dashboard dist folder not found. Please ensure the dashboard build process completed successfully." 
    });
  }
});

// Catch all other routes and return the frontend app
app.get("*", (req, res) => {
  const frontendPath = path.join(__dirname, "../frontend/dist/index.html");
  if (fs.existsSync(frontendPath)) {
    res.sendFile(frontendPath);
  } else {
    res.status(404).json({ error: "Frontend not built" });
  }
});

dbConnection();

app.use(errorMiddleware);
export default app;
