// utils/generateFlyer.js
import { createCanvas, loadImage } from "canvas";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";

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
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext("2d");

  // Load template
  const template = await loadImage(
    path.join(__dirname, "../assets/template.png")
  );
  ctx.drawImage(template, 0, 0, WIDTH, HEIGHT);

  // Load user image
  const userImage = await loadImage(imageUrl);

  // Clip circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(IMAGE_X, IMAGE_Y, IMAGE_DIAMETER / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw image
  ctx.drawImage(
    userImage,
    IMAGE_X - IMAGE_DIAMETER / 2,
    IMAGE_Y - IMAGE_DIAMETER / 2,
    IMAGE_DIAMETER,
    IMAGE_DIAMETER
  );
  ctx.restore();

  // Draw name
  ctx.fillStyle = "#2E7D32";
  ctx.font = "600 48px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(name, 512, NAME_Y);

  // Export flyer
  const buffer = canvas.toBuffer("image/png");

  const upload = await cloudinary.uploader.upload(
    `data:image/png;base64,${buffer.toString("base64")}`,
    { folder: "eat-a-fruit/flyers" }
  );

  return upload.secure_url;
}
