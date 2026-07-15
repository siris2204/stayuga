import dotenv from "dotenv";

dotenv.config({ quiet: true });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/stayuga"),
  jwtSecret: required("JWT_SECRET", "dev-secret-change-me"),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:3000",
  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  cloudinaryUrl: process.env.CLOUDINARY_URL ?? "",
  razorpayKeyId: process.env.RAZORPAY_KEY_ID ?? "",
};
