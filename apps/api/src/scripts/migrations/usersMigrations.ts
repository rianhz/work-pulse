import { UserModel } from "../../modules/users/schema";

export async function usersMigrations() {
  const users = await UserModel.find({}, "email fullName role").lean();

    if (users.length === 0) {
      console.log("No users found in the database.");
    } else {
      console.log("--- REGISTERED USERS ---");
      console.table(
        users.map((u) => ({
          Email: u.email
        }))
      );
    }

  console.log(`   └─ Done! Successfully showing users documents.`);
}