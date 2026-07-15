import { Schema, model, InferSchemaType } from "mongoose";

const propertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    type: { type: String, enum: ["villa", "farmhouse"], required: true },
    tagline: { type: String, trim: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      mapEmbedUrl: { type: String, default: "" },
    },
    pricing: {
      basePrice: { type: Number, required: true },
      weekendPrice: { type: Number },
      currency: { type: String, default: "INR" },
    },
    capacity: {
      maxGuests: { type: Number, required: true },
      bedrooms: { type: Number, required: true },
      bathrooms: { type: Number, required: true },
    },
    blockedDates: [
      {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        reason: { type: String, default: "booked" },
      },
    ],
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
  },
  { timestamps: true }
);

export type Property = InferSchemaType<typeof propertySchema>;
export const PropertyModel = model("Property", propertySchema);
