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

  const userImageResponse = await fetch(imageUrl);
  const userImageBuffer = await userImageResponse.buffer();

  const circleMask = Buffer.from(
    `<svg width="${IMAGE_DIAMETER}" height="${IMAGE_DIAMETER}">
       <circle cx="${IMAGE_DIAMETER / 2}" cy="${IMAGE_DIAMETER / 2}" r="${IMAGE_DIAMETER / 2}" fill="white"/>
     </svg>`
  );

  const croppedUserImage = await sharp(userImageBuffer)
    .resize(IMAGE_DIAMETER, IMAGE_DIAMETER, { fit: 'cover' })
    .composite([{
      input: circleMask,
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  const textImageBuffer = text2png(name, {
    font: '600 48px Poppins',
    color: '#2E7D32',
    backgroundColor: 'transparent',
    textAlign: 'center'
  });

  const textMetadata = await sharp(textImageBuffer).metadata();

  const finalImage = await sharp(templatePath)
    .composite([
      {
        input: croppedUserImage,
        top: Math.round(IMAGE_Y - IMAGE_DIAMETER / 2),
        left: Math.round(IMAGE_X - IMAGE_DIAMETER / 2),
        blend: 'destination-over' 
      },
      {
        input: textImageBuffer,
        top: Math.round(NAME_Y - textMetadata.height),
        left: Math.round(WIDTH / 2 - textMetadata.width / 2)
      }
    ])
    .png()
    .toBuffer();

  const upload = await cloudinary.uploader.upload(
    `data:image/png;base64,${finalImage.toString("base64")}`,
    { folder: "eat-a-fruit/flyers" }
  );

  return upload.secure_url;
}