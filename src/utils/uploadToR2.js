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

      // Start with clean dimensions (up to 800px wide for balanced quality details)
      // and iteratively adjust quality to target around 50kb size
      let quality = 75;
      optimizedBuffer = await sharp(file)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      // If buffer is too large (more than 55 KB), decrease quality iteratively
      while (optimizedBuffer.length > 56320 && quality > 15) {
        quality -= 10;
        optimizedBuffer = await sharp(file)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
      }
      
      // If still too large after quality drop, scale down width to 600px to enforce 50kb limit
      if (optimizedBuffer.length > 56320) {
        optimizedBuffer = await sharp(file)
          .resize({ width: 600, withoutEnlargement: true })
          .webp({ quality: 55 })
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