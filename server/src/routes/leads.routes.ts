import { Router } from "express";
import { z } from "zod";
import { LeadModel } from "../models/Lead";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";

const router = Router();

const leadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

router.post(
  "/",
  validateBody(leadSchema),
  asyncHandler(async (req, res) => {
    const lead = await LeadModel.create(req.body);
    res.status(201).json({ lead });
  })
);

router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    const leads = await LeadModel.find(filter).sort({ createdAt: -1 });
    res.json({ leads });
  })
);

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

router.patch(
  "/:id/status",
  requireAdmin,
  validateBody(statusSchema),
  asyncHandler(async (req, res) => {
    const lead = await LeadModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!lead) throw new ApiError(404, "Lead not found");
    res.json({ lead });
  })
);

export default router;
