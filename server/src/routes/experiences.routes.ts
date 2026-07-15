import { Router } from "express";
import { z } from "zod";
import { ExperienceModel } from "../models/Experience";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";
import { slugify } from "../services/slugify";

const router = Router();

const experienceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().optional(),
  type: z.enum(["event", "retreat"]),
  description: z.string().min(10),
  images: z.array(z.string()).default([]),
  location: z.string().optional(),
  scheduleNote: z.string().optional(),
  featured: z.boolean().optional(),
});

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    const experiences = await ExperienceModel.find(filter).sort({ createdAt: -1 });
    res.json({ experiences });
  })
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const experience = await ExperienceModel.findOne({ slug: req.params.slug });
    if (!experience) throw new ApiError(404, "Experience not found");
    res.json({ experience });
  })
);

router.post(
  "/",
  requireAdmin,
  validateBody(experienceSchema),
  asyncHandler(async (req, res) => {
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title);
    const experience = await ExperienceModel.create({ ...req.body, slug });
    res.status(201).json({ experience });
  })
);

router.put(
  "/:id",
  requireAdmin,
  validateBody(experienceSchema.partial()),
  asyncHandler(async (req, res) => {
    const update = { ...req.body };
    if (update.slug) update.slug = slugify(update.slug);
    const experience = await ExperienceModel.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!experience) throw new ApiError(404, "Experience not found");
    res.json({ experience });
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const experience = await ExperienceModel.findByIdAndDelete(req.params.id);
    if (!experience) throw new ApiError(404, "Experience not found");
    res.status(204).send();
  })
);

export default router;
