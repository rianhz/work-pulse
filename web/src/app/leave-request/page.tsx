"use client";
import LeavePolicyReminder from "@/components/custom/card/LeavePolicyReminder";
import RecentLeaveCard from "@/components/custom/card/RecentLeaveCard";
import LeaveForm from "@/components/custom/forms/LeaveForm";
import { useMyLeaveBalance } from "@/features/leave/hooks";
import { Spinner } from "@/components/ui/spinner";
import { CalendarCheck } from "lucide-react";
import { Activity } from "react";

export default function RequestLeavePage() {
  const { data: leaveBalance, isLoading: isLoadingLeaveBalance } = useMyLeaveBalance();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end flex-row px-0">
        <div>
          <h2 className="text-2xl font-bold">Request Leave</h2>
          <p className="text-sm text-muted-foreground">Fill the form below to submit a new leave request for approval.</p>
        </div>
        <div className="p-4 bg-popover flex items-center gap-2 rounded-sm">
          <div className="bg-primary/10 rounded-sm p-2">
            <CalendarCheck size={30} className="text-primary" />
          </div>           
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground">Leave Balance</p>
            <Activity mode={isLoadingLeaveBalance ? 'visible' : 'hidden'}>
              <Spinner />
            </Activity>
            <Activity mode={!isLoadingLeaveBalance ? 'visible' : 'hidden'}>
              <p className="text-sm font-bold">{leaveBalance?.data.balance} Days</p>
            </Activity>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <LeaveForm />

        <div className="flex flex-col gap-4 w-[24rem]">
          <LeavePolicyReminder />
          <RecentLeaveCard />
        </div>
      </div>
      
    </div>
  )
}