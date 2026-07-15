import { Schema, model, InferSchemaType } from "mongoose";

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    subject: { type: String, default: "General enquiry" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export type Lead = InferSchemaType<typeof leadSchema>;
export const LeadModel = model("Lead", leadSchema);
