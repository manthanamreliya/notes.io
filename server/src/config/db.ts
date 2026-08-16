import mongoose from "mongoose";
import dns from "dns";
import { env } from "./env";

// Ensure DNS resolution for mongodb+srv records works reliably on Windows environments
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if DNS server configuration is locked by system
}

export const connectDB = async (): Promise<void> => {
  try {
    if (!env.mongoUri) {
      throw new Error("MONGO_URI environment variable is not defined.");
    }
    // Limit maxPoolSize to 10 for resource efficiency on 512MB RAM free instances
    const conn = await mongoose.connect(env.mongoUri, {
      maxPoolSize: 10,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host} (maxPoolSize: 10)`);
  } catch (error) {
    console.error("[Database Error] Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};
