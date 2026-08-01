"use client";
import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { BaseTable } from "@/components/custom/table/BaseTable";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogDescription, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { IAnnouncement } from "@/features/announcements/announcements";
import { useCreateAnnouncement, useDeleteAnnouncement, useGetAnnouncements, useUpdateAnnouncement } from "@/features/announcements/hooks";
import { ANNOUNCEMENT_TYPE_OFFICE } from "@/helpers/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { formatToLocalDate, formatToLocalTime } from "@/lib/timezone-formatter";
import { RootState } from "@/store";
import { useAppSelector } from "@/store/hooks/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, Bell, EllipsisVertical, Eye, EyeOff, Pencil, Send, Star, StarOff, Trash } from "lucide-react";
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
  const { mutate: updateAnnouncement, isPending: isUpdatingAnnouncement } = useUpdateAnnouncement();

  const pagination = useMemo(() => announcementsResponse?.pagination, [announcementsResponse]);
  const announcements = useMemo(() => announcementsResponse?.data || [], [announcementsResponse]);

  const [selectedAnnouncement, setSelectedAnnouncement] = useState<IAnnouncement | null>(null);

  const [dialogOpen, setDialogOpen] = useState<"publish" | "featured" | "delete" | null>(null);

  const handleCreateAnnouncement = () => {
    const payload = {
      title: "Announcement title",
      type: ANNOUNCEMENT_TYPE_OFFICE,
      status: "draft" as const,
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

  const handleShowDialog = (dialog: "publish" | "featured" | "delete", row: IAnnouncement) => {
    setSelectedAnnouncement(row);
    setDialogOpen(dialog);
  }

  const handleTooglePublishAnnouncement = () => {
    if (selectedAnnouncement) {
      updateAnnouncement({ id: selectedAnnouncement._id, announcement: { status: selectedAnnouncement?.status === "published" ? "draft" as const : "published" as const } as IAnnouncement }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["announcements"] });
          setSelectedAnnouncement(null);
          setDialogOpen(null);
        },
      });
    }
  }

  const handleToogleFeaturedAnnouncement = () => {
    if (selectedAnnouncement) {
      updateAnnouncement({ id: selectedAnnouncement._id, announcement: { isFeatured: !selectedAnnouncement?.isFeatured } as IAnnouncement }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["announcements"] });
          setSelectedAnnouncement(null);
          setDialogOpen(null);
        },
      });
    }
  }

  const handleDeleteConfirmed = () => {
    if (selectedAnnouncement) {
      deleteAnnouncement(selectedAnnouncement._id, {
        onSuccess: () => {
          setDialogOpen(null);
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
            className="flex items-center gap-0.5"
          >
            <span className="truncate max-w-[300px] block">
              {row.original.title.replace(/<[^>]*>?/g, '')}
            </span> 
            {row.original.isFeatured && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Star fill="currentColor" className="size-4 text-yellow-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Featured</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
          <div className="flex items-center justify-center">
            <span>Status</span>
          </div>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return <Badge variant={status as BadgeVariant} className="w-full text-center">{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
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
              <DropdownMenuItem asChild className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleShowDialog("publish", row.original); }}>
                <Button variant="ghost" iconPosition="left" className="w-full justify-start" icon={row.original.status === "published" ? EyeOff : Eye}>
                  {row.original.status === "published" ? "Unpublish" : "Publish"}
                </Button>
              </DropdownMenuItem>
              {row.original.status === "published" && (
                <DropdownMenuItem asChild className="cursor-pointer" onClick={(e) => { e.stopPropagation(); handleShowDialog("featured", row.original); }}>
                  <Button variant="ghost" iconPosition="left" className="w-full justify-start" icon={row.original.isFeatured ? StarOff : Star}>
                    {row.original.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild className="cursor-pointer" onClick={(e) => { e.stopPropagation(); }}>
                <Link href={`/announcements/${row.original._id}?mode=edit`}>
                  <Pencil className="size-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={(e) => { e.stopPropagation(); handleShowDialog("delete", row.original); }}>
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
      <Dialog open={dialogOpen === "publish"} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.status === "published" ? "Unpublish" : "Publish"} Announcement</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to {selectedAnnouncement?.status === "published" ? "unpublish" : "publish"} this announcement?
          </DialogDescription>
          <div className="flex items-center justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setDialogOpen(null)}>Cancel</Button>
            <Button type="button" className="min-w-[70px]" onClick={handleTooglePublishAnnouncement} loading={isUpdatingAnnouncement} disabled={isUpdatingAnnouncement}>{selectedAnnouncement?.status === "published" ? "Unpublish" : "Publish"}</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen === "featured"} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAnnouncement?.isFeatured ? "Unfeature" : "Feature"} Announcement</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to {selectedAnnouncement?.isFeatured ? "unfeature" : "feature"} this announcement?
          </DialogDescription>
          <div className="flex items-center justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setDialogOpen(null)}>Cancel</Button>
            <Button type="button" className="min-w-[70px]" onClick={handleToogleFeaturedAnnouncement} loading={isUpdatingAnnouncement} disabled={isUpdatingAnnouncement}>{selectedAnnouncement?.isFeatured ? "Unfeature" : "Feature"}</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={dialogOpen === "delete"} onOpenChange={() => setDialogOpen(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this announcement?
          </DialogDescription>
          <div className="flex items-center justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setDialogOpen(null)}>Cancel</Button>
            <Button type="button" variant="destructive" className="min-w-[70px]" onClick={handleDeleteConfirmed} loading={isDeletingAnnouncement} disabled={isDeletingAnnouncement}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex justify-between items-end flex-row px-0 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground">A comprehensive view of all announcements.</p>
        </div>
        <Button onClick={handleCreateAnnouncement} loading={isPending} disabled={isPending || isLoading}>
          Create
        </Button>
      </div>
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
    </>
  );
}