import { Router } from "express";
import { PropertyModel } from "../models/Property";
import { BookingModel } from "../models/Booking";
import { LeadModel } from "../models/Lead";
import { requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
  "/summary",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [totalProperties, pendingBookings, newLeads, recentBookings] = await Promise.all([
      PropertyModel.countDocuments(),
      BookingModel.countDocuments({ status: "pending" }),
      LeadModel.countDocuments({ status: "new" }),
      BookingModel.find().populate("property", "title").sort({ createdAt: -1 }).limit(5),
    ]);
    res.json({ totalProperties, pendingBookings, newLeads, recentBookings });
  })
);

export default router;
