import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env";

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const cloudinaryEnabled = configureCloudinary(env.cloudinaryUrl);

function configureCloudinary(cloudinaryUrl: string): boolean {
  if (!cloudinaryUrl) return false;

  const match = cloudinaryUrl.match(/^cloudinary:\/\/(.+):(.+)@(.+)$/);
  if (!match) {
    console.warn("[storage] CLOUDINARY_URL is set but malformed — falling back to local disk storage");
    return false;
  }

  const [, apiKey, apiSecret, cloudName] = match;
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret, secure: true });
  return true;
}

/**
 * Always parses uploads into memory. Persistence is decided at request time by
 * `saveUploadedFile` — Cloudinary when CLOUDINARY_URL is configured, local disk
 * otherwise — so callers never depend on which backend is active.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

export async function saveUploadedFile(file: Express.Multer.File): Promise<string> {
  return cloudinaryEnabled ? uploadToCloudinary(file.buffer) : saveToLocalDisk(file);
}

function uploadToCloudinary(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "stayuga", resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

function saveToLocalDisk(file: Express.Multer.File): string {
  const ext = path.extname(file.originalname);
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  fs.writeFileSync(path.join(UPLOAD_DIR, filename), file.buffer);
  return `/uploads/${filename}`;
}

export const uploadsDir = UPLOAD_DIR;
