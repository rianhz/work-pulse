"use client";

import { BaseTable } from "@/components/custom/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMyLeaveRequests } from "@/features/leave/hooks";
import { ILeaveRequest } from "@/features/leave/leave";
import { leaveTypesOptions, STATUS_APPROVED, STATUS_CANCELLED, STATUS_PENDING, STATUS_REJECTED, statusOptions } from "@/helpers/constants";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Calendar } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function LeaveHistoryPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data, isLoading: isLoadingLeaveRequests } = useMyLeaveRequests({ page, limit: 10 });
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
    reviewer: "Reviewer",
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
      accessorKey: "reviewer",
      header: () => <span>Reviewer</span>,
      cell: ({ row }) => {
        return <span>{row.original.reviewer?.fullName || "-"}</span>
      },
    },
    {
      accessorKey: "status",
      header: () => <span>Status</span>,
      cell: ({ row }) => {
        return <Badge variant={row.original.status === STATUS_PENDING ? 'pending' : row.original.status === STATUS_APPROVED ? 'approved' : row.original.status === STATUS_REJECTED ? 'rejected' : 'awaitingApproval'} className="min-w-[123px] text-center">
          {getStatusLabel(row.original.status)}
        </Badge>
      },
    },
  ], [leaveRequests]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Leave History</h2>
        <p className="text-sm text-muted-foreground">View your leave history and manage your leave requests.</p>
      </div>
      
  
          <BaseTable 
            columns={columns}
            data={leaveRequests}
            isLoading={isLoadingLeaveRequests}
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            totalPages={totalPages}
            columnLabels={columnDisplayLabels}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isEmptyData={leaveRequests && leaveRequests?.length === 0}
            emptyDataDescription="No leave requests found"
            emptyDataIcon={<Calendar className="size-10 text-muted-foreground" />}
            onRowClicked={handleRowClicked}
          />
      
    </div>
  )
}