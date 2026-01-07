import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import registerRoute from "./routes/register.js";
import adminRoute from "./routes/admin.js";

// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoute);

// ===== Serve Frontend =====

// Get __dirname (required for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "client" folder
app.use(express.static(path.join(__dirname, "client")));

// Fallback route for any unmatched route (useful for SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "index.html"));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  // Connect to MongoDB
  await connectDB();
});
