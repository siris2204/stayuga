import { Schema, model, InferSchemaType } from "mongoose";

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export type AdminUser = InferSchemaType<typeof adminUserSchema>;
export const AdminUserModel = model("AdminUser", adminUserSchema);
