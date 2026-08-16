import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import authRouter from "./routes/auth.routes";
import adminNoteRouter from "./routes/adminNote.routes";
import adminUserRouter from "./routes/adminUser.routes";
import noteRouter from "./routes/note.routes";
import departmentRouter from "./routes/department.routes";
import healthRouter from "./routes/health.routes";
import rootRouter from "./routes";
import { errorHandler } from "./middleware/error.middleware";

const app: Application = express();

// Trust first hop reverse proxy (Render / Cloudflare) for accurate X-Forwarded-For IP resolution
app.set("trust proxy", 1);

// Security Middlewares
app.use(helmet());
const allowedOrigins = env.corsOrigin.includes(",")
  ? env.corsOrigin.split(",").map((o) => o.trim())
  : env.corsOrigin;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Global Rate Limiter to prevent free-tier resource exhaustion (60 requests/minute per IP)
const globalRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalRateLimiter);

// Cookie & Body Parsing Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dedicated Strict Rate Limiter for Auth Endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Health check endpoints for cold start pinging & Render health monitoring
app.use("/api/health", healthRouter);
app.use("/health", healthRouter);

// Auth Routes under /api/auth
app.use("/api/auth", authRateLimiter, authRouter);

// Note, User & Department Routes under /api
app.use("/api/admin/notes", adminNoteRouter);
app.use("/api/admin/users", adminUserRouter);
app.use("/api/notes", noteRouter);
app.use("/api/departments", departmentRouter);

// API v1 sub-routers (/users, /departments, /notes)
app.use("/api/v1", rootRouter);

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;
