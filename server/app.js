import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import registerRoute from "./routes/register.js";
import adminRoute from "./routes/admin.js";

// Connect to MongoDB
await connectDB(); 
// Initialize Express
const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/register", registerRoute);
app.use("/api/admin", adminRoute);

app.get("/", (req, res) => res.send("Eat a Fruit Challenge API running!"));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
