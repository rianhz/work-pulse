"use client";
import BaseAvatar from "@/components/custom/images/BaseAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useLeaveRequestById } from "@/features/leave/hooks";
import { leaveTypesOptions, statusOptions } from "@/helpers/constants";
import { baseDateDaysDiff, baseDateFormat } from "@/lib/date-format";
import { CalendarCheck, CalendarDays, Check, Clock, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Activity, useState } from "react";

export default function LeaveApprovalsPage() {
  const { id } = useParams();
  const { data: leaveRequest, isLoading: isLoadingLeaveRequest } = useLeaveRequestById(id as string);

  const [dialogOpen, setDialogOpen] = useState({
    reject: false,
    approve: false,
  });

  const getLeave = (leaveType: string) => {
    return leaveTypesOptions.find((option) => option.value === leaveType)?.label || "-";
  }
  const getStatus = (status: string) => {
    return statusOptions.find((option) => option.value === status)?.label || "-";
  }

  const handleRejectLeaveRequest = () => {
    console.log("Reject leave request");
  }
  const handleApproveLeaveRequest = () => {
    console.log("Approve leave request");
  }
  return (
    <>
      <Dialog open={dialogOpen.reject} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, reject: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this leave request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen({ ...dialogOpen, reject: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectLeaveRequest}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen.approve} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, approve: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this leave request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen({ ...dialogOpen, approve: false })}>
              Cancel
            </Button>
            <Button onClick={handleApproveLeaveRequest}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Leave Request Details</h2>
          <p className="text-sm text-muted-foreground">Review request details and take action.</p>
        </div>
        <Card>
          <CardContent>
            <Activity mode={isLoadingLeaveRequest ? "visible" : "hidden"}>
              <div className="flex flex-col gap-4 flex-1 p-4">
                <div className="flex items-center gap-4 justify-between">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="w-24 h-6" />
                </div>
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>

            </Activity>
            <Activity mode={!isLoadingLeaveRequest && leaveRequest ? "visible" : "hidden"}>
              <div className="flex flex-col gap-4 flex-1 p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <BaseAvatar
                      src={leaveRequest?.data?.user?.avatar}
                      alt={leaveRequest?.data?.user?.fullName}
                      className="size-16 rounded-full"
                      fallbackInitials={leaveRequest?.data?.user?.fullName?.charAt(0)}
                    />
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium">{leaveRequest?.data?.user?.fullName}</p>
                      <div className="flex items-center gap-2">
                        <Activity mode={leaveRequest?.data?.user?.position ? "visible" : "hidden"}>
                          <p className="text-sm text-muted-foreground">{leaveRequest?.data?.user?.position}</p>
                        </Activity>
                        <Activity mode={leaveRequest?.data?.user?.position && leaveRequest?.data?.user?.department?.name ? "visible" : "hidden"}>
                          <div className="rounded-full h-2 w-2 bg-muted-foreground"/>
                        </Activity>
                        <Activity mode={leaveRequest?.data?.user?.department?.name ? "visible" : "hidden"}>
                        <p className="text-sm text-muted-foreground">{leaveRequest?.data?.user?.department?.name}</p>
                        </Activity>
                      </div>
                    </div>
                  </div>
                  <Badge variant={leaveRequest?.data?.status === "awaiting_approval" ? "awaitingApproval" : leaveRequest?.data?.status === "approved" ? "published" : leaveRequest?.data?.status === "rejected" ? "destructive" : leaveRequest?.data?.status === "cancelled" ? "cancelled" : "pending"}>
                    {getStatus(leaveRequest?.data?.status || "")}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Leave Type</p>
                    <div className="flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium">{getLeave(leaveRequest?.data?.leaveType || "")}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Leave Type</p>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <p>{baseDateFormat(leaveRequest?.data?.startDate)} - {baseDateFormat(leaveRequest?.data?.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Total Days</p>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium">{baseDateDaysDiff(leaveRequest?.data?.startDate, leaveRequest?.data?.endDate)} days</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <div className="flex flex-col gap-2 bg-primary/10 p-4 rounded-md">
                    <p className="text-sm font-medium italic">"{leaveRequest?.data?.notes}"</p>
                  </div>
                </div>
              </div>
              <Activity mode={!isLoadingLeaveRequest && leaveRequest?.data?.status === "awaiting_approval" ? "visible" : "hidden"}>
                <div className="flex gap-2 justify-end">
                  <Button variant="destructive" onClick={() => setDialogOpen({ ...dialogOpen, reject: true })}>
                    Reject
                  </Button>
                  <Button onClick={() => setDialogOpen({ ...dialogOpen, approve: true })}>
                    Approve
                  </Button>
                </div>
              </Activity>
            </Activity>

          </CardContent>
        </Card>
      </div>
    </>
  );
}