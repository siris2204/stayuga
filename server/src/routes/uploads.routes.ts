import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { upload, saveUploadedFile } from "../services/storage";
import { ApiError } from "../middleware/errors";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.post(
  "/",
  requireAdmin,
  upload.single("image"),
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      next(new ApiError(400, "No image file uploaded"));
      return;
    }
    const url = await saveUploadedFile(req.file);
    res.status(201).json({ url });
  })
);

export default router;
