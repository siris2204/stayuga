import { Schema, model, InferSchemaType } from "mongoose";

const experienceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ["event", "retreat"], required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    location: { type: String, default: "" },
    scheduleNote: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export type Experience = InferSchemaType<typeof experienceSchema>;
export const ExperienceModel = model("Experience", experienceSchema);
