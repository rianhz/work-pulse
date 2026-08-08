import { LeaveRequestModel } from "../../modules/leave/leave-requests/schema";
import { STATUS_PENDING, STATUS_AWAITING_APPROVAL } from "../../utils/constant";

export const leaveRequestsPendingUpdate = async () => {
  try {
    const pendingCount = await LeaveRequestModel.countDocuments({ status: STATUS_PENDING });
    console.log(`Found ${pendingCount} leave request(s) with status '${STATUS_PENDING}'.`);

    if (pendingCount === 0) {
      console.log("No records to update. Exiting migration.");
      return;
    }

    const result = await LeaveRequestModel.updateMany({ status: STATUS_PENDING }, {
      $set: { status: STATUS_AWAITING_APPROVAL },
    });

    console.log(`Successfully updated ${result.modifiedCount} document(s) to '${STATUS_AWAITING_APPROVAL}'.`);
  } catch (error) {
    console.error("Migration failed:", error);
  }
};