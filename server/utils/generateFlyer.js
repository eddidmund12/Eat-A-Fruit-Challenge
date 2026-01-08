import sharp from "sharp";
import text2png from "text2png";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIDTH = 1024;

const FRAME_DIAMETER = 430;   // exact circle size on template
const OVERSIZE = 480;         // resize slightly larger to avoid gaps

const IMAGE_X = 512;          // center X of circle
const IMAGE_Y = 640;          // center Y of circle
const NAME_Y = 875;

export default async function generateFlyer(name, imageUrl) {
  const templatePath = path.join(__dirname, "../assets/template.png");

  // Fetch user image
  const res = await fetch(imageUrl);
  const userImageBuffer = Buffer.from(await res.arrayBuffer());

  // Circle mask (SVG)
  const mask = Buffer.from(`
    <svg width="${FRAME_DIAMETER}" height="${FRAME_DIAMETER}">
      <circle
        cx="${FRAME_DIAMETER / 2}"
        cy="${FRAME_DIAMETER / 2}"
        r="${FRAME_DIAMETER / 2}"
        fill="white"
      />
    </svg>
  `);

  // Resize → crop → mask (perfect circular image)
  const userCircle = await sharp(userImageBuffer)
    .resize(OVERSIZE, OVERSIZE, { fit: "cover", position: "centre" })
    .extract({
      left: Math.floor((OVERSIZE - FRAME_DIAMETER) / 2),
      top: Math.floor((OVERSIZE - FRAME_DIAMETER) / 2),
      width: FRAME_DIAMETER,
      height: FRAME_DIAMETER,
    })
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();

  // Name text
  const textBuffer = text2png(name, {
    font: "600 48px Poppins",
    color: "#2E7D32",
    backgroundColor: "transparent",
    textAlign: "center",
    padding: 10,
  });

  const textMeta = await sharp(textBuffer).metadata();
  const templateMeta = await sharp(templatePath).metadata();

  // Final composite (user image → template → text)
  const finalImage = await sharp({
    create: {
      width: templateMeta.width,
      height: templateMeta.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      // User image BEHIND
      {
        input: userCircle,
        top: Math.round(IMAGE_Y - FRAME_DIAMETER / 2),
        left: Math.round(IMAGE_X - FRAME_DIAMETER / 2),
      },

      // Template ON TOP (transparent image window)
      {
        input: templatePath,
        top: 0,
        left: 0,
      },

      // Name text ON TOP
      {
        input: textBuffer,
        top: NAME_Y,
        left: Math.round(WIDTH / 2 - textMeta.width / 2),
      },
    ])
    .png()
    .toBuffer();

  // Upload to Cloudinary
  const upload = await cloudinary.uploader.upload(
    `data:image/png;base64,${finalImage.toString("base64")}`,
    { folder: "eat-a-fruit/flyers" }
  );

  return upload.secure_url;
}
