import { UserModel } from "../../modules/users/schema";

export async function migrateExistingUsers() {
  try {
    console.log("🔄 Starting user schema synchronization...");

    const query = {
      $or: [
        { nickName: { $exists: false } },
        { birthDate: { $exists: false } },
        { department: { $exists: false } },
        { position: { $exists: false } },
      ]
    };

    const result = await UserModel.updateMany(
      query,
      {
        $set: {
          nickName: null,
          birthDate: null,
          department: null,
          position: null,
        },
      },
      { strict: false }
    );

    console.log(`✅ Migration complete! Matched ${result.matchedCount} documents and modified ${result.modifiedCount} old user records.`);
  } catch (error) {
    console.error("❌ Schema migration failed:", error);
  }
}