import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { UserModel } from "../models/User.model";
import mongoose from "mongoose";

async function createAdmin() {
  const args = process.argv.slice(2);
  const name = args[0] || "Admin User";
  const email = (args[1] || "admin@notes.io").toLowerCase().trim();
  const password = args[2] || "AdminPassword123!";
  const mobileNumber = args[3] || "9998887770";

  console.log("Connecting to database...");
  await connectDB();

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      if (existingUser.role === "admin") {
        console.log(`[Admin Creation] User with email "${email}" already exists with role "admin".`);
      } else {
        existingUser.role = "admin";
        existingUser.mobileNumber = mobileNumber;
        await existingUser.save();
        console.log(`[Admin Creation] Existing user "${email}" updated to role "admin".`);
      }
      await mongoose.disconnect();
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const adminUser = new UserModel({
      name,
      email,
      mobileNumber,
      passwordHash,
      role: "admin",
    });

    await adminUser.save();
    console.log("=========================================");
    console.log("ADMIN ACCOUNT CREATED SUCCESSFULLY!");
    console.log(`Name: ${adminUser.name}`);
    console.log(`Email: ${adminUser.email}`);
    console.log(`Mobile: ${adminUser.mobileNumber}`);
    console.log(`Role: ${adminUser.role}`);
    console.log(`ID: ${adminUser._id.toString()}`);
    console.log("=========================================");
  } catch (error) {
    console.error("[Admin Creation Error]", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
