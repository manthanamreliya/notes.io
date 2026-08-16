import { Router, Request, Response } from "express";
import mongoose from "mongoose";

const healthRouter = Router();

/**
 * GET /api/health
 * Health check endpoint verifying database connectivity and system status.
 * Returns HTTP 200 OK when healthy or HTTP 503 Service Unavailable when DB is disconnected.
 */
healthRouter.get("/", async (_req: Request, res: Response): Promise<void> => {
  const isDbConnected = mongoose.connection.readyState === 1;

  if (!isDbConnected) {
    res.status(503).json({
      status: "error",
      db: "disconnected",
      timestamp: new Date().toISOString(),
    });
    return;
  }

  try {
    // Ping MongoDB database
    await mongoose.connection.db?.admin().ping();

    res.status(200).json({
      status: "ok",
      db: "connected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      db: "unreachable",
      timestamp: new Date().toISOString(),
    });
  }
});

export default healthRouter;
