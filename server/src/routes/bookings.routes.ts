import { Router } from "express";
import { z } from "zod";
import { BookingModel } from "../models/Booking";
import { PropertyModel } from "../models/Property";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireAdmin } from "../middleware/auth";
import { ApiError } from "../middleware/errors";
import { sendEmail } from "../services/notify";

const router = Router();

const bookingSchema = z.object({
  property: z.string().min(1),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().positive(),
  message: z.string().optional(),
});

router.post(
  "/",
  validateBody(bookingSchema),
  asyncHandler(async (req, res) => {
    const property = await PropertyModel.findById(req.body.property);
    if (!property) throw new ApiError(404, "Property not found");
    if (req.body.checkOut <= req.body.checkIn) {
      throw new ApiError(400, "Check-out date must be after check-in date");
    }

    const booking = await BookingModel.create(req.body);

    await sendEmail({
      to: req.body.email,
      subject: `We received your enquiry for ${property.title}`,
      body: `Hi ${req.body.name}, thanks for your enquiry about ${property.title}. Our team will reach out shortly.`,
    });

    res.status(201).json({ booking });
  })
);

router.get(
  "/",
  requireAdmin,
  asyncHandler(async (req, res) => {
    const filter: Record<string, unknown> = {};
    if (req.query.status) filter.status = req.query.status;
    const bookings = await BookingModel.find(filter)
      .populate("property", "title slug")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  })
);

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "declined"]),
});

router.patch(
  "/:id/status",
  requireAdmin,
  validateBody(statusSchema),
  asyncHandler(async (req, res) => {
    const booking = await BookingModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate("property", "title slug");
    if (!booking) throw new ApiError(404, "Booking not found");
    res.json({ booking });
  })
);

export default router;
