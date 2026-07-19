import { Schema, model, InferSchemaType } from "mongoose";

const ownerUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    // Both optional, but at least one is enforced by pre-validate hook
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, required: true },
    properties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  },
  { timestamps: true }
);

ownerUserSchema.pre("validate", function (next) {
  if (!this.email && !this.phone) {
    next(new Error("An owner must have at least an email or a phone number"));
  } else {
    next();
  }
});

export type OwnerUser = InferSchemaType<typeof ownerUserSchema>;
export const OwnerUserModel = model("OwnerUser", ownerUserSchema);
