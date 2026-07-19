import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { OwnerUserModel } from "../models/OwnerUser";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";

const router = Router();

router.use(requireAdmin);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const owners = await OwnerUserModel.find().populate("properties", "title slug").sort({ createdAt: -1 });
    res.json({ owners });
  })
);

const createSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().min(7).optional().or(z.literal("")),
    password: z.string().min(8),
    propertyIds: z.array(z.string()).default([]),
  })
  .refine((d) => d.email || d.phone, {
    message: "Provide at least an email or a phone number",
  });

router.post(
  "/",
  validateBody(createSchema),
  asyncHandler(async (req, res) => {
    const { name, email, phone, password, propertyIds } = req.body;

    // Duplicate check
    const orFilter = [];
    if (email) orFilter.push({ email });
    if (phone) orFilter.push({ phone });
    if (orFilter.length) {
      const exists = await OwnerUserModel.findOne({ $or: orFilter });
      if (exists) throw new ApiError(409, "An owner with this email or phone already exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const owner = await OwnerUserModel.create({
      name,
      email: email || undefined,
      phone: phone || undefined,
      passwordHash,
      properties: propertyIds,
    });

    res.status(201).json({
      owner: { _id: owner._id, name: owner.name, email: owner.email, phone: owner.phone, properties: owner.properties },
    });
  })
);

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).optional().or(z.literal("")),
  propertyIds: z.array(z.string()).optional(),
  password: z.string().min(8).optional(),
});

router.patch(
  "/:id",
  validateBody(updateSchema),
  asyncHandler(async (req, res) => {
    const { name, email, phone, propertyIds, password } = req.body;

    // Duplicate check (exclude self)
    const orFilter = [];
    if (email) orFilter.push({ email });
    if (phone) orFilter.push({ phone });
    if (orFilter.length) {
      const conflict = await OwnerUserModel.findOne({
        $or: orFilter,
        _id: { $ne: req.params.id },
      });
      if (conflict) throw new ApiError(409, "Another owner already uses that email or phone");
    }

    const update: Record<string, unknown> = {};
    if (name) update.name = name;
    if (email !== undefined) update.email = email || undefined;
    if (phone !== undefined) update.phone = phone || undefined;
    if (propertyIds) update.properties = propertyIds;
    if (password) update.passwordHash = await bcrypt.hash(password, 10);

    const owner = await OwnerUserModel.findByIdAndUpdate(req.params.id, update, { new: true }).populate("properties", "title slug");
    if (!owner) throw new ApiError(404, "Owner not found");
    res.json({ owner });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const owner = await OwnerUserModel.findByIdAndDelete(req.params.id);
    if (!owner) throw new ApiError(404, "Owner not found");
    res.status(204).send();
  })
);

export default router;
