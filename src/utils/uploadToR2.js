import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/config/r2";
import sharp from "sharp";

export const uploadToR2 = async ({ file, folder, fileName, contentType }) => {
  // Compress/resize the image using sharp
  let optimizedBuffer = file;
  let finalContentType = contentType;
  let finalFileName = fileName;

  if (contentType && contentType.startsWith("image/") && !contentType.includes("svg")) {
    try {
      // Ensure file name ends with .webp
      const lastDotIndex = fileName.lastIndexOf(".");
      finalFileName = lastDotIndex !== -1 
        ? `${fileName.substring(0, lastDotIndex)}.webp`
        : `${fileName}.webp`;
      
      finalContentType = "image/webp";

      // Start with decent dimensions (up to 1200px wide for good quality details)
      // and iteratively adjust quality to target around 200kb size
      let quality = 80;
      optimizedBuffer = await sharp(file)
        .resize({ width: 1200, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      // If buffer is too large (more than 220 KB), decrease quality iteratively
      while (optimizedBuffer.length > 225280 && quality > 20) {
        quality -= 10;
        optimizedBuffer = await sharp(file)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
      }
    } catch (err) {
      console.error("Error optimizing image with sharp:", err);
    }
  }

  const key = `${folder}/${finalFileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.CLOUD_FLARE_R2_BUCKET,
    Key: key,
    Body: optimizedBuffer,
    ContentType: finalContentType,
  });

  await r2.send(command);

  return {
    key,
    url: `${process.env.CLOUD_FLARE_R2_PUBLIC_URL}/${key}`,
  };
};