import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { AdminUserModel } from "../models/AdminUser";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { ApiError } from "../middleware/errors";
import { env } from "../config/env";

const router = Router();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const admin = await AdminUserModel.findOne({ email });
    if (!admin) throw new ApiError(401, "Invalid email or password");

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid email or password");

    const token = jwt.sign({ id: admin._id.toString(), email: admin.email }, env.jwtSecret, {
      expiresIn: "7d",
    });

    res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  })
);

export default router;
