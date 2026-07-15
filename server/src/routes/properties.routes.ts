import { Router } from "express";
import { z } from "zod";
import { PropertyModel } from "../models/Property";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin, optionalAdmin, AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errors";
import { slugify } from "../services/slugify";

const router = Router();

const propertySchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).optional(),
  type: z.enum(["villa", "farmhouse"]),
  tagline: z.string().optional(),
  description: z.string().min(10),
  images: z.array(z.string()).default([]),
  amenities: z.array(z.string()).default([]),
  location: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    mapEmbedUrl: z.string().optional(),
  }),
  pricing: z.object({
    basePrice: z.number().positive(),
    weekendPrice: z.number().positive().optional(),
    currency: z.string().default("INR"),
  }),
  capacity: z.object({
    maxGuests: z.number().int().positive(),
    bedrooms: z.number().int().positive(),
    bathrooms: z.number().int().positive(),
  }),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

router.get(
  "/",
  optionalAdmin,
  asyncHandler(async (req: AuthedRequest, res) => {
    const { type, city, minGuests, featured, status } = req.query;
    const filter: Record<string, unknown> = {};

    if (type) filter.type = type;
    if (city) filter["location.city"] = new RegExp(String(city), "i");
    if (minGuests) filter["capacity.maxGuests"] = { $gte: Number(minGuests) };
    if (featured) filter.featured = featured === "true";

    if (!req.admin) {
      // Anonymous requests only ever see published listings, regardless of `status`.
      filter.status = "published";
    } else if (status && status !== "all") {
      filter.status = status;
    }

    const properties = await PropertyModel.find(filter).sort({ createdAt: -1 });
    res.json({ properties });
  })
);

router.get(
  "/id/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const property = await PropertyModel.findById(req.params.id);
    if (!property) throw new ApiError(404, "Property not found");
    res.json({ property });
  })
);

router.get(
  "/:slug",
  optionalAdmin,
  asyncHandler(async (req: AuthedRequest, res) => {
    const property = await PropertyModel.findOne({ slug: req.params.slug });
    if (!property || (property.status !== "published" && !req.admin)) {
      throw new ApiError(404, "Property not found");
    }
    res.json({ property });
  })
);

router.post(
  "/",
  requireAdmin,
  validateBody(propertySchema),
  asyncHandler(async (req, res) => {
    const slug = req.body.slug ? slugify(req.body.slug) : slugify(req.body.title);
    const property = await PropertyModel.create({ ...req.body, slug });
    res.status(201).json({ property });
  })
);

router.put(
  "/:id",
  requireAdmin,
  validateBody(propertySchema.partial()),
  asyncHandler(async (req, res) => {
    const update = { ...req.body };
    if (update.slug) update.slug = slugify(update.slug);
    const property = await PropertyModel.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    if (!property) throw new ApiError(404, "Property not found");
    res.json({ property });
  })
);

router.delete(
  "/:id",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const property = await PropertyModel.findByIdAndDelete(req.params.id);
    if (!property) throw new ApiError(404, "Property not found");
    res.status(204).send();
  })
);

export default router;
