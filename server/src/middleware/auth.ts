import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./errors";

type AdminPayload = { id: string; email: string; role?: "admin" };
type OwnerPayload = { id: string; email: string; role: "owner" };

export interface AuthedRequest extends Request {
  admin?: AdminPayload;
  owner?: OwnerPayload;
}

function extractToken(req: Request): string | undefined {
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : undefined;
}

export function optionalAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (token) {
    try {
      const payload = jwt.verify(token, env.jwtSecret) as AdminPayload;
      if (!payload.role || payload.role === "admin") req.admin = payload;
    } catch {
      // ignore
    }
  }
  next();
}

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) { next(new ApiError(401, "Missing authorization token")); return; }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as AdminPayload;
    if (payload.role && payload.role !== "admin") {
      next(new ApiError(403, "Admin access required")); return;
    }
    req.admin = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}

export function requireOwner(req: AuthedRequest, _res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) { next(new ApiError(401, "Missing authorization token")); return; }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as OwnerPayload;
    if (payload.role !== "owner") {
      next(new ApiError(403, "Owner access required")); return;
    }
    req.owner = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
