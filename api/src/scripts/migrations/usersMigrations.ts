import { UserModel } from "../../modules/users/schema";

export async function usersMigrations() {
  console.log("   -> Starting direct database cleanup...");

  const cleanupResult = await UserModel.updateMany(
    {}, 
    { $unset: { reportsTo: "" } },
    { strict: false }
  );

  console.log(`   └─ Done! Successfully deleted 'reportsTo' from ${cleanupResult.modifiedCount} user documents.`);
}