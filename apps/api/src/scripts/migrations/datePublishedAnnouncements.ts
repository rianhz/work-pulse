import { AnnouncementModel } from "../../modules/announcements/schema";

export async function datePublishedAnnouncements() {
  console.log("   -> Starting direct database cleanup...");

  const announcements = await AnnouncementModel.find({ publishedAt: { $exists: false } });

  console.log(`Found ${announcements.length} announcements to update.`);

  // 2. Loop through each announcement and update them individually
  for (const announcement of announcements) {
    // Generate a random number of days between 0 and 30
    const randomDaysAgo = Math.floor(Math.random() * 31); 
    
    // Calculate the target timestamp (H-30 range)
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - randomDaysAgo);
    
    // Randomize hours/minutes/seconds so they don't all look like they happened at the exact same minute
    randomDate.setHours(
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );

    // Update this specific document
    await AnnouncementModel.updateOne(
      { _id: announcement._id },
      { $set: { publishedAt: randomDate } },
      { strict: false }
    );
  }

  console.log(`   └─ Done! Successfully set 'publishedAt' for ${announcements.length} announcements documents.`);
}