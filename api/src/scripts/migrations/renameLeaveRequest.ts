import { LeaveRequestModel } from "../../modules/leave/leave-requests/schema";

export async function renameLeaveRequestFields() {
  const result = await LeaveRequestModel.collection.updateMany(
    {},
    {
      $rename: {
        userId: 'user',
        tenantId: 'tenant',
        reviewedBy: 'reviewer',
      },
    }
  );

  console.log(`Migration successful: Modified ${result.modifiedCount} documents.`);
  return result;
}
