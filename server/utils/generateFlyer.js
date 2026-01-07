// utils/generateFlyer.js
import sharp from "sharp";
import text2png from "text2png";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch"; // Assuming fetch is available or add to deps

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTH = 1024;
const HEIGHT = 1536;

// IMAGE POSITION (LOCKED)
const IMAGE_DIAMETER = 430;
const IMAGE_X = 512;
const IMAGE_Y = 640;

// NAME POSITION
const NAME_Y = 915;

export default async function generateFlyer(name, imageUrl) {
  // Load template
  const templatePath = path.join(__dirname, "../assets/template.png");
  let template = sharp(templatePath);

  // Fetch user image
  const userImageResponse = await fetch(imageUrl);
  const userImageBuffer = await userImageResponse.buffer();

  // Create circular mask for user image
  const mask = Buffer.from(`
    <svg width="${IMAGE_DIAMETER}" height="${IMAGE_DIAMETER}">
      <circle cx="${IMAGE_DIAMETER / 2}" cy="${IMAGE_DIAMETER / 2}" r="${IMAGE_DIAMETER / 2}" fill="white"/>
    </svg>
  `);

  // Resize and mask user image
  const maskedUserImage = await sharp(userImageBuffer)
    .resize(IMAGE_DIAMETER, IMAGE_DIAMETER, { fit: 'cover' })
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  // Composite masked user image onto template
  template = await template
    .composite([{
      input: maskedUserImage,
      top: IMAGE_Y - IMAGE_DIAMETER / 2,
      left: IMAGE_X - IMAGE_DIAMETER / 2
    }]);

  // Generate text image
  const textImageBuffer = text2png(name, {
    font: '600 48px Poppins',
    color: '#2E7D32',
    backgroundColor: 'transparent',
    textAlign: 'center',
    lineSpacing: 0,
    padding: 0
  });

  // Get exact text dimensions
  const textMetadata = await sharp(textImageBuffer).metadata();
  const textWidth = textMetadata.width;
  const textHeight = textMetadata.height;

  // Composite text onto template (baseline at NAME_Y)
  const finalImage = await template
    .composite([{
      input: textImageBuffer,
      top: NAME_Y - textHeight,
      left: 512 - textWidth / 2
    }])
    .png()
    .toBuffer();

  // Upload to Cloudinary
  const upload = await cloudinary.uploader.upload(
    `data:image/png;base64,${finalImage.toString("base64")}`,
    { folder: "eat-a-fruit/flyers" }
  );

  return upload.secure_url;
}
