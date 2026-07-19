import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { uploadsDir } from "./services/storage";
import { notFoundHandler, errorHandler } from "./middleware/errors";

import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/properties.routes";
import bookingRoutes from "./routes/bookings.routes";
import leadRoutes from "./routes/leads.routes";
import experienceRoutes from "./routes/experiences.routes";
import contentRoutes from "./routes/content.routes";
import uploadRoutes from "./routes/uploads.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import ownerAuthRoutes from "./routes/owner.auth.routes";
import ownerRoutes from "./routes/owner.routes";
import adminOwnersRoutes from "./routes/admin.owners.routes";

export const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadsDir));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/owner/auth", ownerAuthRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/admin/owners", adminOwnersRoutes);

app.use(notFoundHandler);
app.use(errorHandler);
