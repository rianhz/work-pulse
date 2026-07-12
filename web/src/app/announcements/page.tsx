"use client";
import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { BaseTable } from "@/components/custom/table/BaseTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IAnnouncement } from "@/features/announcements/announcements";
import { useCreateAnnouncement, useDeleteAnnouncement, useGetAnnouncements } from "@/features/announcements/hooks";
import { ANNOUNCEMENT_TYPE_OFFICE } from "@/helpers/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { formatToLocalDate, formatToLocalTime } from "@/lib/timezone-formatter";
import { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Bell, EllipsisVertical, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function AnnouncementsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useAppSelector((state: RootState) => state.currentUser.user);
  const currentTenant = useSelector((state: RootState) => state.currentTenant.tenant);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 1000);

  const { mutate: createAnnouncement, isPending } = useCreateAnnouncement();
  const { data: announcementsResponse, isLoading, isError, error: errorAnnouncements } = useGetAnnouncements({ search: debouncedSearch, page, limit: 10 });
  const { mutate: deleteAnnouncement, isPending: isDeletingAnnouncement } = useDeleteAnnouncement();

  const pagination = useMemo(() => announcementsResponse?.pagination, [announcementsResponse]);
  const announcements = useMemo(() => announcementsResponse?.data || [], [announcementsResponse]);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);
  
  const handleCreateAnnouncement = () => {
    const payload = {
      title: "Announcement title",
      type: ANNOUNCEMENT_TYPE_OFFICE,
      status: "draft" as const,
      thumbnail: "",
      cover: "",
      content: "",
    }
    createAnnouncement(payload, {
      onSuccess: (response) => {
        router.push(`/announcements/${response.data.id}?mode=edit`);
      },
    });
  }

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRowClicked = (row: IAnnouncement) => {
    router.push(`/announcements/${row._id}?mode=edit`);
  }

  const handleDeleteAnnouncement = (row: IAnnouncement) => {
    setSelectedAnnouncement(row);
    setDeleteDialogOpen(true);
  }

  const handleDeleteConfirmed = () => {
    if (selectedAnnouncement) {
      deleteAnnouncement(selectedAnnouncement._id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setSelectedAnnouncement(null);
          queryClient.invalidateQueries({ queryKey: ["announcements"] });
        },
      });
    }
  }

  const columnDisplayLabels = {
    title: "Title",
    type: "Status",
    createdAt: "Created At",
    updatedAt: "Updated At",
  };
  const columns = useMemo<ColumnDef<IAnnouncement>[]>(() => [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Title</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <div 
            className="truncate max-w-[300px] block"
          >
            {row.original.title}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Status</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status === "published" ? "default" : "outline"}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Created At</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{formatToLocalDate(row.original.createdAt, currentUser?.timezone || currentTenant?.timezone)}</span>
            </TooltipTrigger>
            <TooltipContent onClick={(e) => e.stopPropagation()}>
              <p>Created on <strong>{formatToLocalTime(row.original.createdAt, currentUser?.timezone || currentTenant?.timezone)}</strong> by <strong>{row.original.createdBy.nickName ?? row.original.createdBy.fullName}</strong></p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Updated At</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-pointer">{formatToLocalDate(row.original.updatedAt, currentUser?.timezone || currentTenant?.timezone)}</span>
            </TooltipTrigger>
            <TooltipContent onClick={(e) => e.stopPropagation()}>
              <p>Updated on <strong>{formatToLocalTime(row.original.updatedAt, currentUser?.timezone || currentTenant?.timezone)}</strong> by <strong>{row.original.lastUpdatedBy.nickName ?? row.original.lastUpdatedBy.fullName}</strong></p>
            </TooltipContent>
          </Tooltip>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon">
                <EllipsisVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer" onClick={(e) => { e.stopPropagation(); }}>
                <Link href={`/announcements/${row.original._id}?mode=edit`}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); handleDeleteAnnouncement(row.original); }}>
                <Trash className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [announcements, currentUser, currentTenant]);

  if (isError) {
    return <ErrorMessage title={(errorAnnouncements as any)?.response?.data?.message || (errorAnnouncements as Error).message || "Failed to get announcements"} />;
  }
  return (
    <>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this announcement?
          </DialogDescription>
          <div className="flex items-center justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" className="min-w-[70px]" onClick={handleDeleteConfirmed} disabled={isDeletingAnnouncement}>{isDeletingAnnouncement ? <Spinner className="size-4" /> : "Delete"}</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Card className="border-none pt-0 ring-0 shadow-none">
        <CardHeader className="flex justify-between items-end flex-row px-0">
          <div>
            <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
            <CardDescription>A comprehensive view of all announcements.</CardDescription>
          </div>
          <Button onClick={handleCreateAnnouncement} disabled={isPending || isLoading}>
           {isPending ? <Spinner /> : "Create"}
          </Button>
        </CardHeader>
        <CardContent className="px-0">
          <BaseTable
            onRowClicked={handleRowClicked}
            columns={columns}
            data={announcements}
            columnLabels={columnDisplayLabels}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            showSearchField={!isError}
            searchValue={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search by title..."
            currentPage={page}
            onPageChange={(newPage) => setPage(newPage)}
            totalPages={pagination?.totalPages}
            isLoading={isLoading}
            isEmptyData={announcements && announcements?.length === 0}
            emptyDataDescription="No announcements found"
            emptyDataIcon={<Bell className="size-10 text-muted-foreground" />}
          />
        </CardContent>
      </Card>
    </>
  );
}