import express from "express";
import User from "../models/Users.js";

const router = express.Router();

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

export default router;
