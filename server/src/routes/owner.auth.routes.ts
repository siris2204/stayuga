import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { OwnerUserModel } from "../models/OwnerUser";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateBody } from "../middleware/validate";
import { requireOwner, AuthedRequest } from "../middleware/auth";
import { ApiError } from "../middleware/errors";
import { env } from "../config/env";

const router = Router();

const loginSchema = z.object({
  identifier: z.string().nonempty(), // email or phone number
  password: z.string().min(6),
});

router.post(
  "/login",
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    const owner = await OwnerUserModel.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phone: identifier }],
    });
    if (!owner) throw new ApiError(401, "Invalid credentials");

    const valid = await bcrypt.compare(password, owner.passwordHash);
    if (!valid) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign(
      { id: owner._id.toString(), email: owner.email ?? owner.phone, role: "owner" },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      owner: { id: owner._id, name: owner.name, email: owner.email, phone: owner.phone },
    });
  })
);

router.get(
  "/me",
  requireOwner,
  asyncHandler(async (req: AuthedRequest, res) => {
    const owner = await OwnerUserModel.findById(req.owner!.id).populate("properties", "title slug status");
    if (!owner) throw new ApiError(404, "Owner not found");
    res.json({ owner });
  })
);

export default router;
