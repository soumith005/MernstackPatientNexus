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

// Load .env file from root directory
const rootEnvPath = path.join(__dirname, "../.env");
console.log("Looking for .env file at:", rootEnvPath);
console.log("File exists:", fs.existsSync(rootEnvPath));

if (fs.existsSync(rootEnvPath)) {
  config({ path: rootEnvPath });
  console.log("✅ .env file loaded successfully");
} else {
  console.log("❌ .env file not found at:", rootEnvPath);
  console.log("Creating .env file with default values...");
  
  const defaultEnvContent = `PORT=4000

MONGO_URI=mongodb+srv://HOSPITAL:HOSPITAL@cluster0.rh1efpz.mongodb.net/?retryWrites=true
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174

JWT_SECRET_KEY=asjhdkj3hkjd1fhksahfksad
JWT_EXPIRES=7d
COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=ddmlxju8j
CLOUDINARY_API_SECRET=pPURipHJig0iBNcUbiJgBnZzvpg
CLOUDINARY_API_KEY=465373931988997`;
  
  try {
    fs.writeFileSync(rootEnvPath, defaultEnvContent);
    console.log("✅ Created .env file with default values");
    config({ path: rootEnvPath });
  } catch (error) {
    console.error("❌ Could not create .env file:", error);
  }
}

// Debug: Check if environment variables are loaded
console.log("Environment check:");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ NOT LOADED");
console.log("PORT:", process.env.PORT || "❌ NOT LOADED");

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
