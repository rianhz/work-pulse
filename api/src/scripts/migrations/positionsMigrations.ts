import mongoose from "mongoose";
import { UserModel } from "../../modules/users/schema";
import { PositionModel } from "../../modules/positions/schema";


export async function migratePositions() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log("✅ Connected to MongoDB");

    const users = await UserModel.find({
      position: { $ne: null },
    });

    console.log(`Found ${users.length} users to migrate.`);

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      if (!user.position) {
        skipped++;
        continue;
      }

      const position = await PositionModel.findById(user.position);
      console.log("Position doc:", position);

      if (!position) {
        console.log(
          `⚠️ Position not found for user ${user._id} (${user.position})`
        );
        skipped++;
        continue;
      }

      await UserModel.updateOne(
        { _id: user._id },
        {
          $set: {
            position: position.name,
          },
        }
      );

      migrated++;

      console.log(
        `✅ ${user._id} -> "${position.name}"`
      );
    }

    console.log("--------------------------------");
    console.log(`Migrated : ${migrated}`);
    console.log(`Skipped  : ${skipped}`);
    console.log("🎉 Migration completed.");

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}