import { AnnouncementModel } from "../../modules/announcements/schema";

export async function isFeaturedAnnouncements() {
  console.log("   -> Starting direct database cleanup...");

  const cleanupResult = await AnnouncementModel.updateMany(
    { isFeatured: { $exists: false } },
    { $set: { isFeatured: false } },
    { strict: false }
  );

  console.log(`   └─ Done! Successfully set 'isFeatured' to false for ${cleanupResult.modifiedCount} announcements documents.`);
}