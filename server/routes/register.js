import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import generateFlyer from "../utils/generateFlyer.js";
import User from "../models/User.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    const imageBuffer = req.file.buffer;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(
      `data:image/png;base64,${imageBuffer.toString("base64")}`,
      { folder: "eat-a-fruit/profiles" }
    );

    // Generate flyer (your custom function)
    const flyerUrl = await generateFlyer(name, uploadRes.secure_url);

    // Save user to DB
    await User.create({
      name,
      profileImage: uploadRes.secure_url,
      flyerImage: flyerUrl,
    });

    res.json({ success: true, flyerUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
