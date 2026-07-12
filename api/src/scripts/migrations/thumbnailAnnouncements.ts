import { AnnouncementModel } from "../../modules/announcements/schema";

export async function thumbnailMigrations() {
  console.log("   -> Starting direct database cleanup...");

  const cleanupResult = await AnnouncementModel.updateMany(
    { thumbnail: { $exists: true } },
    { $unset: { thumbnail: "" } },
    { strict: false }
  );

  console.log(`   └─ Done! Successfully deleted 'thumbnail' from ${cleanupResult.modifiedCount} announcements documents.`);
}