import app from "./app";
import { connectDB } from "./config/db";
import { env } from "./config/env";
import { checkCloudinaryConnection } from "./config/cloudinary";
import mongoose from "mongoose";

const startServer = async (): Promise<void> => {
  // Connect to MongoDB database
  await connectDB();

  // Perform Cloudinary startup self-check
  await checkCloudinaryConnection();

  // Start HTTP server listener
  const server = app.listen(env.port, () => {
    console.log(
      `[Server] Notes.io backend running in ${env.nodeEnv} mode on port ${env.port}`
    );
  });

  // Graceful shutdown handling for Render deployments (SIGTERM / SIGINT)
  const gracefulShutdown = async (signal: string) => {
    console.log(`[Server] ${signal} received. Initiating graceful shutdown...`);
    
    server.close(async () => {
      console.log("[Server] HTTP server closed.");
      try {
        await mongoose.connection.close();
        console.log("[Database] MongoDB connection closed cleanly.");
      } catch (err) {
        console.error("[Database Error] Failed to close MongoDB connection:", err);
      }
      process.exit(0);
    });

    // Force exit if shutdown hangs over 10s
    setTimeout(() => {
      console.error("[Server] Forced exit after shutdown timeout.");
      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
};

startServer();
