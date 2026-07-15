import { Schema, model, InferSchemaType } from "mongoose";

const contentBlockSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export type ContentBlock = InferSchemaType<typeof contentBlockSchema>;
export const ContentBlockModel = model("ContentBlock", contentBlockSchema);

const faqItemSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type FaqItem = InferSchemaType<typeof faqItemSchema>;
export const FaqItemModel = model("FaqItem", faqItemSchema);

const policyPageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export type PolicyPage = InferSchemaType<typeof policyPageSchema>;
export const PolicyPageModel = model("PolicyPage", policyPageSchema);
