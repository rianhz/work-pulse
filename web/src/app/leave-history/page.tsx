"use client";

import { BaseTable } from "@/components/custom/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMyLeaveRequests } from "@/features/leave/hooks";
import { ILeaveRequest } from "@/features/leave/leave";
import { leaveTypesOptions, STATUS_APPROVED, STATUS_CANCELLED, STATUS_PENDING, STATUS_REJECTED, statusOptions } from "@/helpers/constants";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Calendar } from "lucide-react";
import moment from "moment";
import { useMemo, useState } from "react";

export default function LeaveHistoryPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const { data, isLoading: isLoadingLeaveRequests } = useMyLeaveRequests({ page, limit, search });
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const leaveRequests = useMemo(() => data?.data || [], [data?.data]);

  const getLeaveTypeLabel = (leaveType: string) => {
    return leaveTypesOptions.find((option) => option.value === leaveType)?.label;
  }

  const getStatusLabel = (status: string) => {
    return statusOptions.find((option) => option.value === status)?.label;
  }

  const columnDisplayLabels = {
    leaveType: "Leave Type",
    startDate: "From",
    endDate: "To",
    reviewedBy: "Reviewer",
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
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>From</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <span>{moment(row.original.startDate).format("DD MMM YYYY")}</span>
      },
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>To</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <span>{moment(row.original.endDate).format("DD MMM YYYY")}</span>
      },
    },
    {
      accessorKey: "reviewedBy",
      header: ({ column }) => (
          <span>Reviewer</span>
      ),
      cell: ({ row }) => {
        return <span>{row.original.reviewedBy?.fullName || "-"}</span>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
          <span>Status</span>
      ),
      cell: ({ row }) => {
        return <Badge variant={row.original.status.includes(STATUS_CANCELLED) ? "cancelled" : row.original.status.includes(STATUS_REJECTED) ? "destructive" : row.original.status.includes(STATUS_PENDING) ? "pending" : row.original.status.includes(STATUS_APPROVED) ? "active" : "secondary"}>
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
      
      <Card>
        <CardContent>
          <BaseTable 
            columns={columns}
            data={leaveRequests}
            isLoading={isLoadingLeaveRequests}
            columnLabels={columnDisplayLabels}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isEmptyData={leaveRequests && leaveRequests?.length === 0}
            emptyDataDescription="No leave requests found"
            emptyDataIcon={<Calendar className="size-10 text-muted-foreground" />}
          />

        </CardContent>
      </Card>
      
    </div>
  )
}