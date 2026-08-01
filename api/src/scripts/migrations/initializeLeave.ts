import { LeaveBalanceModel } from "../../modules/leave/leave-balance/schema";
import { UserModel } from "../../modules/users/schema";

const TARGET_USER_ID = "6a3fa01bbff627dd45129f44";
const DEFAULT_BALANCE = 12;

export async function leaveBalanceMigration() {
  const user = await UserModel.findById(TARGET_USER_ID, "_id tenantId").lean();

  if (!user) {
    throw new Error(`User with ID ${TARGET_USER_ID} not found.`);
  }

  const result = await LeaveBalanceModel.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      tenantId: user.tenantId,
      balance: DEFAULT_BALANCE,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  console.log(`   Updated LeaveBalance for user ${TARGET_USER_ID}: balance = ${result.balance}`);
}