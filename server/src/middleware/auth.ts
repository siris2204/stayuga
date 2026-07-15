import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "./errors";

export interface AuthedRequest extends Request {
  admin?: { id: string; email: string };
}

export function optionalAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (token) {
    try {
      req.admin = jwt.verify(token, env.jwtSecret) as { id: string; email: string };
    } catch {
      // ignore invalid/expired token — treated as anonymous
    }
  }
  next();
}

export function requireAdmin(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    next(new ApiError(401, "Missing authorization token"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { id: string; email: string };
    req.admin = payload;
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
}
