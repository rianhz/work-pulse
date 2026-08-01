"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectPayloadFormValues, projectPayloadSchema } from "@/features/projects/validator";
import { Textarea } from "@/components/ui/textarea";
import { useSearchUsers } from "@/features/users/hooks";
import { GenericMultiSelect } from "@/components/custom/select/GenericMultiSelect";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreateProject, useDeleteProject, useGetProjects, useUpdateProject } from "@/features/projects/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, Briefcase, InfoIcon, MoreHorizontal, Pencil, Trash, UsersIcon } from "lucide-react";
import { BaseTable } from "@/components/custom/table/BaseTable";
import { Column, ColumnDef, VisibilityState } from "@tanstack/react-table";
import { IProject } from "@/features/projects/project";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { baseDateFormat, baseDateFormatFromNow, baseDateTimeFormat } from "@/lib/date-format";
import { NotAuthorised } from "@/components/custom/errors-and-empty/NotAuthorised";
import { formatToLocalDate, formatToLocalDateTime, formatToLocalTime } from "@/lib/timezone-formatter";

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const isAdminOrOwner = currentUser?.role === "admin" || currentUser?.role === "owner" || currentUser?.role === "manager";

  const [participantsSearch, setParticipantsSearch] = useState("");
  const debouncedParticipantsSearch = useDebounce(participantsSearch, 1000);
  const { data: participantsResponse, isLoading: isLoadingParticipants, isError: isErrorParticipants, isFetched: isFetchedParticipants } = useSearchUsers(debouncedParticipantsSearch);
  const participants = useMemo(() => participantsResponse?.data || [], [participantsResponse]);

  const { mutate: createProjectMutation, isPending: isLoadingCreateProject } = useCreateProject();
  const { mutate: updateProjectMutation, isPending: isLoadingUpdateProject } = useUpdateProject();
  const { mutate: deleteProjectMutation, isPending: isLoadingDeleteProject } = useDeleteProject();

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 1000);
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: projectsResponse, isLoading: isLoadingProjects, isError: isErrorProjects } = useGetProjects({ search: debouncedSearch, page, limit });

  const defaultValues: ProjectPayloadFormValues = {
    name: "",
    description: "",
    entity: "",
    participants: [],
    status: "active",
  };

  const { 
    handleSubmit, 
    register, 
    formState: { isSubmitting, errors: errorsCreateProject }, 
    reset, 
    control,
  } = useForm<ProjectPayloadFormValues>({
    resolver: zodResolver(projectPayloadSchema),
    defaultValues,
  });

  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);

  const [isProjectDialogOpen, setProjectDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const openCreateDialog = () => {
    setDialogMode("create");
    setSelectedProject(null);
    reset(defaultValues);
    setProjectDialogOpen(true);
  };

  const openEditDialog = (project: IProject) => {
    setDialogMode("edit");
    setSelectedProject(project);

    reset({
      name: project.name,
      description: project.description,
      entity: project.entity,
      participants: project.participants,
      status: project.status,
    });

    setProjectDialogOpen(true);
  };

  const openDeleteDialog = (project: IProject) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };


  const onSubmit = (data: ProjectPayloadFormValues) => {
    if (dialogMode === "create") {
      const payload = {
        status: data.status, 
        name: data.name,
        description: data.description,
        entity: data.entity,
        participants: data.participants,
      };
      createProjectMutation(payload, {
        onSuccess: () => {
          setProjectDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
      });

      return;
    }

    if (!selectedProject) return;

    const payload = {
      status: data.status,
      name: data.name,
      description: data.description,
      entity: data.entity,
      participants: data.participants,
    };

    updateProjectMutation(
      {
        projectId: selectedProject._id,
        payload,
      },
      {
        onSuccess: () => {
          setProjectDialogOpen(false);
          queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
      }
    );
  };

  const handleDeleteConfirmed = () => {
    if (!selectedProject) return;
    deleteProjectMutation(selectedProject._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
    });
  };

  const tenant = useSelector((state: RootState) => state.currentTenant.tenant);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const columns = useMemo<ColumnDef<IProject, any>[]>(() => [
    {
      accessorKey: "name",
      header: ({ column }: { column: Column<IProject, any> }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Name</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),  
    },
    {
      accessorKey: "entity",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Entity</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "participants",
      header: "Participants",
      cell: ({ row }) => {
        const rowParticipants = row.original.participants || [];
        if (rowParticipants.length === 0) return <span className="text-muted-foreground text-xs">-</span>;
        return (
          <div className="flex items-center justify-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="flex items-center justify-start gap-0.5">
                  {rowParticipants.length}
                  <UsersIcon className="size-3.5" /></p>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col justify-start items-start gap-1">
                <span className="text-md font-bold">Participants:</span>
                <ul className="list-disc list-inside">
                  {rowParticipants.map((p: any, index: number) => (
                    <li key={index} className="text-xs">{p.fullName}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      }
    },
    {
      accessorKey: "status",
      header: ({ column }: { column: Column<IProject, any> }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Status</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge className={cn(row.original.status === "active" ? "bg-green-500 text-white hover:bg-green-600" : "bg-red-500 text-white hover:bg-red-600")}>
          {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
        </Badge>
      )
    },
    {
      accessorKey: "createdAt",
      header: ({ column }: { column: Column<IProject, any> }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Date Created</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{formatToLocalDate(row.original.createdAt, currentUser?.timezone || tenant?.timezone)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Created on <strong>{formatToLocalTime(row.original.createdAt, currentUser?.timezone || tenant?.timezone)}</strong> by <strong>{row.original.createdBy.nickName ?? row.original.createdBy.fullName}</strong></p>
            </TooltipContent>
          </Tooltip>
        )
      }
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }: { column: Column<IProject, any> }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent">
          <span>Last Updated</span>
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <span>{formatToLocalDate(row.original.updatedAt, currentUser?.timezone || tenant?.timezone)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Last updated on <strong>{formatToLocalTime(row.original.updatedAt, currentUser?.timezone || tenant?.timezone)}</strong> by <strong>{row.original.lastUpdatedBy?.nickName ?? row.original.lastUpdatedBy?.fullName}</strong></p>
            </TooltipContent>
          </Tooltip>
        )
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        if (!isAdminOrOwner) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-muted rounded-md transition-colors">
                <MoreHorizontal className="cursor-pointer" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => openEditDialog(row.original)}
              >
                <Pencil className="size-4" /> Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => openDeleteDialog(row.original)}
                variant="destructive"
              >
                <Trash className="size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    },
  ], [isAdminOrOwner]);

  const columnDisplayLabels = {
    name: "Name",
    entity: "Entity",
    participants: "Participants",
    status: "Status",
    createdAt: "Created On",
    updatedAt: "Updated On",
    actions: "Actions",
  };

  const pagination = useMemo(() => projectsResponse?.data.pagination, [projectsResponse]);
  const projects = useMemo(() => projectsResponse?.data.data || [], [projectsResponse]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (!isAdminOrOwner) return <NotAuthorised />;

  return (
    <>
      <Dialog open={isProjectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogMode === "create" ? "Create" : "Edit"} Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="name" required>Name</Label>
              <Input type="text" id="name" {...register("name")} />
              {errorsCreateProject.name && <p className="text-red-500 text-xs">{errorsCreateProject.name.message}</p>}
            </div>
            
            <div className="grid gap-2 w-full">
              <Label htmlFor="description" optional>Description</Label>
              <Textarea rows={3} id="description" {...register("description")} />
              {errorsCreateProject.description && <p className="text-red-500 text-xs">{errorsCreateProject.description.message}</p>}
            </div>
            
            <div className="grid gap-2 w-full">
              <Label htmlFor="entity" optional>Entity</Label>
              <Input type="text" id="entity" {...register("entity")} />
              {errorsCreateProject.entity && <p className="text-red-500 text-xs">{errorsCreateProject.entity.message}</p>}
            </div>
            
            <div className="grid gap-2 w-full">
              <Label htmlFor="participants" optional>Participants</Label>
              
              <Controller
                control={control}
                name="participants"
                render={({ field }) => (
                  <GenericMultiSelect
                    id="participants"
                    selectedItems={field.value || []}
                    onChange={field.onChange}
                    searchQuery={participantsSearch}
                    onSearchChange={setParticipantsSearch}
                    itemsList={participants} 
                    displayKey="fullName" 
                    placeholder="Select participants..."
                    searchPlaceholder="Search users..."
                    isLoading={isLoadingParticipants}
                    isError={isErrorParticipants}
                    isFetched={isFetchedParticipants}
                  />
                )}
              />
              {errorsCreateProject.participants && <p className="text-red-500 text-xs">{errorsCreateProject.participants.message}</p>}
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 w-full">
              <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setProjectDialogOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isSubmitting || isLoadingCreateProject || isLoadingUpdateProject} disabled={isSubmitting || isLoadingCreateProject || isLoadingUpdateProject}>{dialogMode === "create" ? "Create" : "Save"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this project?
          </DialogDescription>
          <div className="flex items-center justify-end gap-2 mt-4 w-full">
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button type="button" variant="destructive" className="min-w-[70px]" onClick={handleDeleteConfirmed} loading={isLoadingDeleteProject} disabled={isLoadingDeleteProject}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-none pt-0 ring-0 shadow-none">
        <CardHeader className="flex justify-between items-end flex-row px-0">
          <div>
            <CardTitle className="text-2xl font-bold">Projects</CardTitle>
            <CardDescription>Track, organize, and manage your workspace initiatives, project roles, and delivery lifecycles.</CardDescription>
          </div>
          {isAdminOrOwner && (
            <Button onClick={openCreateDialog} disabled={isLoadingProjects}>Create Project</Button>
          )}
        </CardHeader>
        <CardContent className="px-0">
            <BaseTable
              columns={columns}
              data={projects}
              columnLabels={columnDisplayLabels}
              columnVisibility={columnVisibility}
              onColumnVisibilityChange={setColumnVisibility}
              // Controlled Search Configurations
              showSearchField={!isErrorProjects}
              searchValue={search}
              onSearchChange={handleSearchChange}
              searchPlaceholder="Searching..."
              // Pagination Configurations
              currentPage={page}
              totalPages={pagination?.totalPages}
              onPageChange={(newPage) => setPage(newPage)}

              isLoading={isLoadingProjects}
              isEmptyData={projects && projects?.length === 0}
              emptyDataDescription="No projects found"
              emptyDataIcon={<Briefcase className="size-10 text-muted-foreground" />}
            />
        </CardContent>
      </Card>
    </>
  );
}