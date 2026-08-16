import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

export const configureCloudinary = () => {
  cloudinary.config({
    cloud_name: env.cloudinaryCloudName,
    api_key: env.cloudinaryApiKey,
    api_secret: env.cloudinaryApiSecret,
    secure: true,
  });
  return cloudinary;
};

// Configure Cloudinary explicitly after env import
configureCloudinary();

export const checkCloudinaryConnection = async (): Promise<boolean> => {
  try {
    configureCloudinary();
    const res = await cloudinary.api.ping();
    console.log("[Cloudinary Startup Self-Check] Connection successful:", res);
    return true;
  } catch (error) {
    console.warn("[Cloudinary] Connection check failed: Unable to connect to Cloudinary on boot.", error);
    return false;
  }
};

export default cloudinary;

