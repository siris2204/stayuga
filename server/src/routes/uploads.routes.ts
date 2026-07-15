import { Router } from "express";
import { requireAdmin } from "../middleware/auth";
import { upload, publicUrlFor } from "../services/storage";
import { ApiError } from "../middleware/errors";

const router = Router();

router.post("/", requireAdmin, upload.single("image"), (req, res, next) => {
  if (!req.file) {
    next(new ApiError(400, "No image file uploaded"));
    return;
  }
  res.status(201).json({ url: publicUrlFor(req.file.filename) });
});

export default router;
