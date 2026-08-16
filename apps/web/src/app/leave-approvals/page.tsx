"use client";

import { BaseTable } from "@/components/custom/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLeaveApprovals } from "@/features/leave/hooks";
import { ILeaveRequest } from "@/features/leave/leave";
import { leaveTypesOptions, STATUS_APPROVED, STATUS_AWAITING_APPROVAL, STATUS_CANCELLED, STATUS_PENDING, STATUS_REJECTED, statusOptions } from "@/helpers/constants";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Calendar } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function LeaveApprovalsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading: isLoadingLeaveApprovals } = useLeaveApprovals({ page, limit: 10 });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const leaveRequests = useMemo(() => data?.data || [], [data]);
  const totalPages = useMemo(() => data?.pagination?.totalPages || 0, [data]);

  const getLeaveTypeLabel = (leaveType: string) => {
    return leaveTypesOptions.find((option) => option.value === leaveType)?.label;
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find((option) => option.value === status)?.label;
  }

  const handleRowClicked = (row: ILeaveRequest) => {
    router.push(`/leave-requests/${row._id}`);
  }

  const columnDisplayLabels = {
    leaveType: "Leave Type",
    startDate: "From",
    endDate: "To",
    userId: "Submitted By",
    status: "Status",
  };

  const columns = useMemo<ColumnDef<ILeaveRequest>[]>(() => [
    {
      accessorKey: "leaveType",
      header: ({ column }) => (
        <span>Leave Type</span>
      ),
      cell: ({ row }) => {
        return <span>{getLeaveTypeLabel(row.original.leaveType)}</span>
      },
    },
    {
      accessorKey: "startDate",
      header: () => <span>From</span>,
      enableSorting: true,
      cell: ({ row }) => {
        return <span>{moment(row.original.startDate).format("DD MMM YYYY")}</span>
      },
    },
    {
      accessorKey: "endDate",
      header: () => <span>To</span>,
      enableSorting: true,
      cell: ({ row }) => {
        return <span>{moment(row.original.endDate).format("DD MMM YYYY")}</span>
      },
    },
    {
      accessorKey: "userId",
      header: () => <span>Submitted By</span>,
      cell: ({ row }) => {
        return <span>{row.original.user?.fullName || "-"}</span>
      },
    },
    {
      accessorKey: "status",
      header: () => <span>Status</span>,
      cell: ({ row }) => {
        return <Badge variant={row.original.status.includes(STATUS_CANCELLED) ? "cancelled" : row.original.status.includes(STATUS_REJECTED) ? "destructive" : row.original.status.includes(STATUS_PENDING) ? "pending" : row.original.status.includes(STATUS_APPROVED) ? "approved" : row.original.status.includes(STATUS_AWAITING_APPROVAL) ? "awaitingApproval" : "secondary"}>
          {getStatusLabel(row.original.status)}
        </Badge>
      },
    },
  ], [leaveRequests]);


  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Leave Approvals</h2>
        <p className="text-sm text-muted-foreground">Review and manage leave requests submitted by your team.</p>
      </div>
          <BaseTable 
            onRowClicked={handleRowClicked}
            columns={columns}
            data={leaveRequests}
            isLoading={isLoadingLeaveApprovals}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            totalPages={totalPages}
            columnLabels={columnDisplayLabels}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isEmptyData={leaveRequests && leaveRequests?.length === 0}
            emptyDataDescription="No leave requests found"
            emptyDataIcon={<Calendar className="size-10 text-muted-foreground" />}
          />
      
    </div>
  )
}