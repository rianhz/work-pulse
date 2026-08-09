"use client";
import BaseAvatar from "@/components/custom/images/BaseAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useApproveLeaveRequest, useLeaveRequestById, useRejectLeaveRequest } from "@/features/leave/hooks";
import { leaveTypesOptions, STATUS_APPROVED, STATUS_REJECTED, statusOptions } from "@/helpers/constants";
import { baseDateDaysDiff, baseDateFormat } from "@/lib/date-format";
import { CalendarCheck, CalendarDays, Check, Clock, X } from "lucide-react";
import { useParams } from "next/navigation";
import { Activity, useMemo, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { IUser } from "@/features/users/users";
import { useAppSelector } from "@/store/hooks/hooks";
import BackButton from "@/components/custom/button/BackButton";

export default function LeaveApprovalsPage() {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: leaveRequest, isLoading: isLoadingLeaveRequest } = useLeaveRequestById(id as string);
  const { mutate: rejectLeaveRequest, isPending: isRejectingLeaveRequest } = useRejectLeaveRequest();
  const { mutate: approveLeaveRequest, isPending: isApprovingLeaveRequest } = useApproveLeaveRequest();
  const [rejectionReason, setRejectionReason] = useState("");
  const [dialogOpen, setDialogOpen] = useState({
    reject: false,
    approve: false,
  });

  const currentUser = useAppSelector((state) => state.currentUser.user);
  const isApprover = useMemo(() => {
    return leaveRequest?.data?.user?.leader === currentUser?._id;
  }, [leaveRequest?.data?.reviewer, currentUser]);


  const getLeave = (leaveType: string) => {
    return leaveTypesOptions.find((option) => option.value === leaveType)?.label || "-";
  }
  const getStatus = (status: string) => {
    return statusOptions.find((option) => option.value === status)?.label || "-";
  }

  const handleRejectLeaveRequest = () => {
    rejectLeaveRequest({ id: id as string, rejectionReason: rejectionReason as string }, {
      onSuccess: () => {
        toast.success("Leave request rejected successfully");
        setDialogOpen({ ...dialogOpen, reject: false });
        queryClient.invalidateQueries({ queryKey: ["leave-request-by-id", id as string] });
      },
    });
  }
  const handleApproveLeaveRequest = () => {
    approveLeaveRequest({ id: id as string }, {
      onSuccess: () => {
        toast.success("Leave request approved successfully");
        setDialogOpen({ ...dialogOpen, approve: false });
        queryClient.invalidateQueries({ queryKey: ["leave-request-by-id", id as string] });
      },
    });
  }
  return (
    <>
      <Dialog open={dialogOpen.reject && isApprover} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, reject: open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this leave request?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col justify-start align-start gap-2">
            <Label htmlFor="reason" className="self-start">Reason <span className="text-muted-foreground text-xs">(optional)</span></Label>
            <Textarea
              id="reason"
              className="resize-none min-h-[100px]"
              rows={4}
              autoFocus={false}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen({ ...dialogOpen, reject: false })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectLeaveRequest} disabled={isRejectingLeaveRequest}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen.approve && isApprover} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, approve: open })}>
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
            <Button onClick={handleApproveLeaveRequest} disabled={isApprovingLeaveRequest}>
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        <BackButton />
        <Card className="p-4">
          <div>
            <h2 className="text-2xl font-bold">Request Details</h2>
          </div>
          <CardContent className="p-0">
            <Activity mode={isLoadingLeaveRequest ? "visible" : "hidden"}>
              <div className="flex flex-col gap-4 flex-1">
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
              <div className="flex flex-col gap-4 flex-1">
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
                          <div className="rounded-full h-1 w-1 bg-muted-foreground"/>
                        </Activity>
                        <Activity mode={leaveRequest?.data?.user?.department?.name ? "visible" : "hidden"}>
                        <p className="text-sm text-muted-foreground">{leaveRequest?.data?.user?.department?.name}</p>
                        </Activity>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end gap-2">
                    <Badge variant={leaveRequest?.data?.status === "awaiting_approval" ? "awaitingApproval" : leaveRequest?.data?.status === "approved" ? "published" : leaveRequest?.data?.status === "rejected" ? "destructive" : leaveRequest?.data?.status === "cancelled" ? "cancelled" : "pending"}>
                      {getStatus(leaveRequest?.data?.status || "")}
                    </Badge>
                    <Activity mode={leaveRequest?.data?.status === STATUS_APPROVED || leaveRequest?.data?.status === STATUS_REJECTED ? "visible" : "hidden"}>
                      <span className="text-sm text-muted-foreground"> Reviewed by {leaveRequest?.data?.reviewer?.fullName}</span>
                    </Activity>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Type</p>
                    <div className="flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium">{getLeave(leaveRequest?.data?.leaveType || "")}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Date(s)</p>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4 text-primary" />
                      <p>{baseDateFormat(leaveRequest?.data?.startDate)} - {baseDateFormat(leaveRequest?.data?.endDate)}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end gap-2">
                    <p className="text-sm text-muted-foreground">Duration</p>
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
                <Activity mode={leaveRequest?.data?.status === "rejected" && leaveRequest?.data?.rejectionReason ? "visible" : "hidden"}>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">Reviewer's Note</p>
                    <div className="flex items-center gap-1 bg-destructive/10 p-4 rounded-md">
                      <p className="text-sm font-medium italic">"{leaveRequest?.data?.rejectionReason}"</p>
                    </div>
                  </div>
                </Activity>
              </div>
              <Activity mode={!isLoadingLeaveRequest && isApprover && leaveRequest?.data?.status === "awaiting_approval" ? "visible" : "hidden"}>
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