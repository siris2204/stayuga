import { Router } from "express";
import { z } from "zod";
import { ContentBlockModel, FaqItemModel, PolicyPageModel, TestimonialModel } from "../models/ContentBlock";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";
import { env } from "../config/env";

const router = Router();

/** "+918121933639" -> "+91 81219 33639" (last 10 digits are the number, rest is country code). */
function formatPhoneDisplay(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  const national = digits.slice(-10);
  const cc = digits.slice(0, digits.length - 10) || "91";
  if (national.length !== 10) return raw;
  return `+${cc} ${national.slice(0, 5)} ${national.slice(5)}`;
}

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [blocks, faqs, policies, testimonials] = await Promise.all([
      ContentBlockModel.find(),
      FaqItemModel.find().sort({ order: 1 }),
      PolicyPageModel.find(),
      TestimonialModel.find().sort({ order: 1 }),
    ]);
    const blockMap = Object.fromEntries(blocks.map((b) => [b.key, b.value]));

    // "contact-info" defaults to the env-configured values — the single source
    // of truth for the WhatsApp number, email, and Instagram link shown across
    // the site. An admin-edited block (via PUT /blocks/contact-info) overrides
    // individual fields on top of that default.
    blockMap["contact-info"] = {
      phone: env.whatsappNumber ? formatPhoneDisplay(env.whatsappNumber) : "",
      email: env.contactEmail,
      location: "Hyderabad, India",
      instagram: env.instagramUrl,
      ...(blockMap["contact-info"] ?? {}),
    };

    res.json({ blocks: blockMap, faqs, policies, testimonials });
  })
);

router.get(
  "/policies/:slug",
  asyncHandler(async (req, res) => {
    const policy = await PolicyPageModel.findOne({ slug: req.params.slug });
    if (!policy) throw new ApiError(404, "Policy page not found");
    res.json({ policy });
  })
);

const blockSchema = z.object({ value: z.unknown() });

router.put(
  "/blocks/:key",
  requireAdmin,
  validateBody(blockSchema),
  asyncHandler(async (req, res) => {
    const block = await ContentBlockModel.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json({ block });
  })
);

const faqSchema = z.object({
  question: z.string().min(2),
  answer: z.string().min(2),
  order: z.number().optional(),
});

router.post(
  "/faqs",
  requireAdmin,
  validateBody(faqSchema),
  asyncHandler(async (req, res) => {
    const faq = await FaqItemModel.create(req.body);
    res.status(201).json({ faq });
  })
);

router.put(
  "/faqs/:id",
  requireAdmin,
  validateBody(faqSchema.partial()),
  asyncHandler(async (req, res) => {
    const faq = await FaqItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) throw new ApiError(404, "FAQ not found");
    res.json({ faq });
  })
);

router.delete(
  "/faqs/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const faq = await FaqItemModel.findByIdAndDelete(req.params.id);
    if (!faq) throw new ApiError(404, "FAQ not found");
    res.status(204).send();
  })
);

const policySchema = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
});

router.put(
  "/policies/:slug",
  requireAdmin,
  validateBody(policySchema),
  asyncHandler(async (req, res) => {
    const policy = await PolicyPageModel.findOneAndUpdate(
      { slug: req.params.slug },
      { ...req.body, slug: req.params.slug },
      { new: true, upsert: true }
    );
    res.json({ policy });
  })
);

const testimonialSchema = z.object({
  quote: z.string().min(5),
  author: z.string().min(2),
  context: z.string().min(2),
  order: z.number().optional(),
});

router.post(
  "/testimonials",
  requireAdmin,
  validateBody(testimonialSchema),
  asyncHandler(async (req, res) => {
    const testimonial = await TestimonialModel.create(req.body);
    res.status(201).json({ testimonial });
  })
);

router.put(
  "/testimonials/:id",
  requireAdmin,
  validateBody(testimonialSchema.partial()),
  asyncHandler(async (req, res) => {
    const testimonial = await TestimonialModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    res.json({ testimonial });
  })
);

router.delete(
  "/testimonials/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const testimonial = await TestimonialModel.findByIdAndDelete(req.params.id);
    if (!testimonial) throw new ApiError(404, "Testimonial not found");
    res.status(204).send();
  })
);

export default router;
