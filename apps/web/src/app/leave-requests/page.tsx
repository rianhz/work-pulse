"use client";
import LeavePolicyReminder from "@/components/custom/card/LeavePolicyReminder";
import RecentLeaveCard from "@/components/custom/card/RecentLeaveCard";
import LeaveForm from "@/components/custom/forms/LeaveForm";

export default function RequestLeavePage() {  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end flex-row px-0">
        <div>
          <h2 className="text-2xl font-bold">Request Leave</h2>
          <p className="text-sm text-muted-foreground">Fill the form below to submit a new leave request for approval.</p>
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