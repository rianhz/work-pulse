"use client";
import { useMemo, useState } from "react";
import { BaseTable } from "@/components/custom/table/BaseTable";
import { useNotification } from "@/features/notification/hooks";
import { ColumnDef, RowSelectionState, VisibilityState } from "@tanstack/react-table";
import { INotification } from "@/features/notification/notification";
import { Bell, Check } from "lucide-react";
import { getNotificationLink, getNotificationTitle } from "@/helpers/notification-helper";
import { baseDateFormat } from "@/lib/date-format";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotificationsTable() {
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { data, isLoading } = useNotification({ page, limit: 10 });
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const notifications = useMemo(() => data?.data || [], [data]);
    const pagination = useMemo(() => data?.pagination || { totalPages: 0, totalItems: 0, page: 1, limit: 10 }, [data]);

    const handleRowClicked = (row: INotification) => {
        router.push(getNotificationLink(row.entityType, row.entityId as string));
    };

    const columnDisplayLabels = {
        entityType: "Type",
        title: "Description",
        createdAt: "Date",
    };
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const columns = useMemo<ColumnDef<INotification, any>[]>(() => [
        {
            accessorKey: "entityType",
            header: "Type",
            cell: ({ row }) => {
                return <span>{getNotificationTitle(row.original.entityType)}</span>;
            },
        },
        {
            accessorKey: "message",
            header: "Description",
            cell: ({ row }) => {
                return <span>{row.original.message}</span>;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Date",
            cell: ({ row }) => {
                return <span>{baseDateFormat(new Date(row.original.createdAt))}</span>;
            },
        },
    ], [notifications]);

    const handleMarkAsRead = (selectedRows: INotification[]) => {
        console.log(selectedRows);
    };
    return (
        <BaseTable
            columns={columns}
            data={notifications}
            columnLabels={columnDisplayLabels}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            bulkActions={[
              {
                label: "Mark as Read",
                icon: Check,
                onClick: (selectedRows) => handleMarkAsRead(selectedRows),
                variant: "secondary",
              },
            ]}
            // Pagination Configurations
            currentPage={page}
            totalPages={pagination?.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoading}
            isEmptyData={notifications && notifications?.length === 0}
            emptyDataDescription="No notifications found"
            emptyDataIcon={<Bell className="size-10 text-muted-foreground" />}
            onRowClicked={handleRowClicked}
        />
    );
}