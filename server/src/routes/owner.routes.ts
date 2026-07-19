import { Router } from "express";
import { z } from "zod";
import { OwnerUserModel } from "../models/OwnerUser";
import { PropertyModel } from "../models/Property";
import { BookingModel } from "../models/Booking";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireOwner, AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errors";

const router = Router();

router.use(requireOwner);

// ── helper: verify owner actually owns this property ─────────────────────────
async function assertOwns(ownerId: string, propertyId: string) {
  const owner = await OwnerUserModel.findById(ownerId);
  if (!owner) throw new ApiError(404, "Owner not found");
  const owns = owner.properties.some((p) => p.toString() === propertyId);
  if (!owns) throw new ApiError(403, "You do not own this property");
  return owner;
}

// ── GET /api/owner/properties ─────────────────────────────────────────────────
router.get(
  "/properties",
  asyncHandler(async (req: AuthedRequest, res) => {
    const owner = await OwnerUserModel.findById(req.owner!.id);
    if (!owner) throw new ApiError(404, "Owner not found");

    const properties = await PropertyModel.find({
      _id: { $in: owner.properties },
    }).select("title slug status type location.city pricing.basePrice pricing.currency blockedDates images");

    res.json({ properties });
  })
);

// ── GET /api/owner/properties/:id/calendar ────────────────────────────────────
router.get(
  "/properties/:id/calendar",
  asyncHandler(async (req: AuthedRequest, res) => {
    await assertOwns(req.owner!.id, req.params.id);

    const property = await PropertyModel.findById(req.params.id).select("title slug blockedDates");
    if (!property) throw new ApiError(404, "Property not found");

    const bookings = await BookingModel.find({ property: req.params.id })
      .select("name checkIn checkOut guests status")
      .sort({ checkIn: 1 });

    res.json({ property, bookings, blocks: property.blockedDates });
  })
);

// ── POST /api/owner/properties/:id/blocks — add a manual block ────────────────
const blockSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().max(120).optional(),
});

router.post(
  "/properties/:id/blocks",
  validateBody(blockSchema),
  asyncHandler(async (req: AuthedRequest, res) => {
    await assertOwns(req.owner!.id, req.params.id);

    if (req.body.endDate <= req.body.startDate) {
      throw new ApiError(400, "End date must be after start date");
    }

    const property = await PropertyModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          blockedDates: {
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            reason: req.body.reason ?? "External booking",
            source: "manual",
          },
        },
      },
      { new: true }
    ).select("blockedDates");

    if (!property) throw new ApiError(404, "Property not found");

    const added = property.blockedDates[property.blockedDates.length - 1];
    res.status(201).json({ block: added });
  })
);

// ── DELETE /api/owner/properties/:id/blocks/:blockId — remove a manual block ──
router.delete(
  "/properties/:id/blocks/:blockId",
  asyncHandler(async (req: AuthedRequest, res) => {
    await assertOwns(req.owner!.id, req.params.id);

    const property = await PropertyModel.findById(req.params.id);
    if (!property) throw new ApiError(404, "Property not found");

    const block = property.blockedDates.find(
      (b) => b._id?.toString() === req.params.blockId
    );
    if (!block) throw new ApiError(404, "Block not found");
    if ((block as any).source === "booking") {
      throw new ApiError(400, "Cannot manually remove a platform booking block. Update the booking status instead.");
    }

    await PropertyModel.findByIdAndUpdate(req.params.id, {
      $pull: { blockedDates: { _id: req.params.blockId } },
    });

    res.status(204).send();
  })
);

// ── GET /api/owner/bookings — all bookings for owner's properties ─────────────
router.get(
  "/bookings",
  asyncHandler(async (req: AuthedRequest, res) => {
    const owner = await OwnerUserModel.findById(req.owner!.id);
    if (!owner) throw new ApiError(404, "Owner not found");

    const bookings = await BookingModel.find({ property: { $in: owner.properties } })
      .populate("property", "title slug")
      .sort({ createdAt: -1 });

    res.json({ bookings });
  })
);

export default router;
