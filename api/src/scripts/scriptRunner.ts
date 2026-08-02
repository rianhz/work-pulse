
import mongoose from "mongoose";
import dotenv from "dotenv";
// import { usersMigrations } from "./migrations/usersMigrations";
import { connectDatabase } from "../config/database";
import { thumbnailMigrations } from "./migrations/thumbnailAnnouncements";
import { isFeaturedAnnouncements } from "./migrations/isFeaturedAnnouncements";
import { datePublishedAnnouncements } from "./migrations/datePublishedAnnouncements";
import { bulkLeaveBalanceMigration } from "./migrations/initializeLeave";
import { leaveRequestsPendingUpdate } from "./migrations/leaveRequestsPendingUpdate";
import { renameLeaveRequestFields } from "./migrations/renameLeaveRequest";

dotenv.config();

const migrations = [
  // { name: "usersMigrations", execute: usersMigrations },
  { name: "renameLeaveRequestFields", execute: renameLeaveRequestFields },
];

async function runMigrations() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    await connectDatabase();
    console.log("🔗 Connected. Starting migrations sequence...\n");

    for (const migration of migrations) {
      console.log(`⏳ Executing: ${migration.name}...`);
      await migration.execute();
      console.log(`✅ Completed: ${migration.name}\n`);
    }

    console.log("🎉 All migrations finished successfully.");
  } catch (error) {
    console.error("❌ Migration pipeline failed:", error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database connection closed.");
    process.exit(0);
  }
}

runMigrations();