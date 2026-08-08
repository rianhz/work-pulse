import mongoose, { AnyBulkWriteOperation } from "mongoose";
import { LeaveBalanceModel } from "../../modules/leave/leave-balance/schema";
import { UserModel } from "../../modules/users/schema";
import { ILeaveBalance } from "../../modules/leave/leave-balance/interfaces";

const DEFAULT_BALANCE = 12;

export async function bulkLeaveBalanceMigration() {
  const users = await UserModel.find(
    { status: { $ne: "deleted" } },
    "_id tenantId"
  ).lean();

  if (!users.length) {
    console.log("No users found for migration.");
    return;
  }

  // Explicitly type the bulkOps array to AnyBulkWriteOperation<ILeaveBalance>[]
  const bulkOps: AnyBulkWriteOperation<ILeaveBalance>[] = users.map((user) => ({
    updateOne: {
      filter: { userId: user._id as any },
      update: {
        $setOnInsert: {
          userId: user._id as any,
          tenantId: user.tenantId as any,
          balance: DEFAULT_BALANCE,
        },
      },
      upsert: true,
    },
  }));

  const result = await LeaveBalanceModel.bulkWrite(bulkOps);

  console.log(`Migration Complete:`);
  console.log(`- Inserted (New Balances): ${result.upsertedCount}`);
  console.log(`- Matched (Already Exists): ${result.matchedCount}`);
}