import sharp from "sharp";
import text2png from "text2png";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTH = 1024;
const HEIGHT = 1536;

const IMAGE_DIAMETER = 430;
const IMAGE_X = 512;
const IMAGE_Y = 640;
const NAME_Y = 875;

export default async function generateFlyer(name, imageUrl) {
  const templatePath = path.join(__dirname, "../assets/template.png");

  // Fetch user image
  const response = await fetch(imageUrl);
  const userImageBuffer = Buffer.from(await response.arrayBuffer());

  // Create circular mask
  const circleMask = Buffer.from(`
    <svg width="${IMAGE_DIAMETER}" height="${IMAGE_DIAMETER}">
      <circle cx="${IMAGE_DIAMETER / 2}" cy="${IMAGE_DIAMETER / 2}" r="${IMAGE_DIAMETER / 2}" fill="white"/>
    </svg>
  `);

  // Crop image into a transparent circle
  const croppedUserImage = await sharp(userImageBuffer)
    .resize(IMAGE_DIAMETER, IMAGE_DIAMETER, { fit: "cover" })
    .composite([{ input: circleMask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Render name text
  const textImageBuffer = text2png(name, {
    font: "600 48px Poppins",
    color: "#2E7D32",
    backgroundColor: "transparent",
    textAlign: "center",
    padding: 10,
  });

  const textMetadata = await sharp(textImageBuffer).metadata();

  // Composite everything onto template
  const finalImage = await sharp(templatePath)
    .composite([
      {
        input: croppedUserImage,
        top: Math.round(IMAGE_Y - IMAGE_DIAMETER / 2),
        left: Math.round(IMAGE_X - IMAGE_DIAMETER / 2),
      },
      {
        input: textImageBuffer,
        top: Math.round(NAME_Y),
        left: Math.round(WIDTH / 2 - textMetadata.width / 2),
      },
    ])
    .png()
    .toBuffer();

  // Upload final flyer
  const upload = await cloudinary.uploader.upload(
    `data:image/png;base64,${finalImage.toString("base64")}`,
    { folder: "eat-a-fruit/flyers" }
  );

  return upload.secure_url;
}
