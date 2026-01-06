const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const generateFlyer = require("../utils/generateFlyer");

const router = express.Router();
const upload = multer({ storage:
    multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { name } = req.body;
        const imageBuffer = req.file.buffer;

        const uploadRes = await cloudinary.uploadRes.upload('data:image/png;base64, $ {imageBuffer.toString("base64")}', 
            {folder: "eat-a-fruit/profiles"}
        );

        const flyerUrl = await generateFlyer(name, uploadRes.secure_url);
        res.json({ success: true, flyerUrl });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false})
    }
});

module.exports = router


const User = require("../models/User");

// after flyer generation
await User.create({
  name,
  profileImage: uploadRes.secure_url,
  flyerImage: flyerUrl,
});
