import { Router } from "express";
import { z } from "zod";
import { ContentBlockModel, FaqItemModel, PolicyPageModel } from "../models/ContentBlock";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";

const router = Router();

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const [blocks, faqs, policies] = await Promise.all([
      ContentBlockModel.find(),
      FaqItemModel.find().sort({ order: 1 }),
      PolicyPageModel.find(),
    ]);
    const blockMap = Object.fromEntries(blocks.map((b) => [b.key, b.value]));
    res.json({ blocks: blockMap, faqs, policies });
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

export default router;
