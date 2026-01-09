import express from "express";
import User from "../models/User.js";

const router = express.Router();

// Validate passcode
router.post("/validate-passcode", (req, res) => {
  const { passcode } = req.body;
  if (passcode === "@10dayschallenge") {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

// Get all users
router.get("/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

// Get single user
router.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Delete all users
router.delete("/users", async (req, res) => {
  await User.deleteMany({});
  res.json({ message: "All users deleted" });
});

export default router;
