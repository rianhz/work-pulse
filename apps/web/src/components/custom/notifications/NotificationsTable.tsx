"use client";
import { useMemo, useState } from "react";
import { BaseTable } from "@/components/custom/table/BaseTable";
import { useMarkAllNotificationsAsRead, useMarkNotificationAsRead, useNotification } from "@/features/notification/hooks";
import { ColumnDef, RowSelectionState, VisibilityState } from "@tanstack/react-table";
import { INotification } from "@/features/notification/notification";
import { Bell, Check } from "lucide-react";
import { getNotificationLink, getNotificationTitle } from "@/helpers/notification-helper";
import { baseDateFormat } from "@/lib/date-format";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function NotificationsTable() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const router = useRouter();
    const { data, isLoading } = useNotification({ page, limit: 10 });
    const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = useMarkNotificationAsRead();
    const { mutateAsync: markAllAsRead, isPending: isMarkingAllAsRead } = useMarkAllNotificationsAsRead();
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const notifications = useMemo(() => data?.data || [], [data]);
    const pagination = useMemo(() => data?.pagination || { totalPages: 0, totalItems: 0, page: 1, limit: 10 }, [data]);

    const handleRowClicked = (row: INotification) => {
        router.push(getNotificationLink(row.entityType, row.entityId as string));
    };

    const handleMarkAsRead = (selectedRows: INotification[]) => {
        markAsRead(selectedRows.map(row => row._id), {
            onSuccess: () => {
                toast.success("Notifications marked as read");
                queryClient.invalidateQueries({ queryKey: ["notifications", { page, limit: 10 }] });
                queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
                setRowSelection({});
            }
        });
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead().then(() => {
            toast.success("Notifications marked as read");
            queryClient.invalidateQueries({ queryKey: ["notifications", { page, limit: 10 }] });
            queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
            setRowSelection({});
        });
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
            externalActions={[
                {
                    label: "Mark all as read",
                    icon: Check,
                    onClick: handleMarkAllAsRead,
                    loading: isMarkingAllAsRead,
                    disabled: isLoading,
                    variant: "outline",
                },
            ]}
            bulkActions={[
              {
                label: "Mark as Read",
                icon: Check,
                onClick: (selectedRows) => {
                    handleMarkAsRead(selectedRows);
                },
                loading: isMarkingAsRead,
                disabled: isLoading,
                variant: "secondary",
              },
            ]}
            // bulkActionsTriggerVariant="secondary"
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