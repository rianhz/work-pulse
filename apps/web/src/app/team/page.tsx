"use client";

import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser, useGetUsers, useSearchUsers, useUpdateUser } from "@/features/users/hooks";
import { ChevronDownIcon, MoreHorizontalIcon, Users, ArrowUpDown, Pencil, Trash, Trash2, Download, UserCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInviteUsers } from "@/features/invitations/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetDepartments } from "@/features/departments/hooks";
import { IUser } from "@/features/users/users";
import { BaseDatePicker } from "@/components/custom/date-picker/BaseDatePicker";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { ColumnDef, RowSelectionState, VisibilityState } from "@tanstack/react-table";
import { BaseTable } from "@/components/custom/table/BaseTable";
import { EditUserFormValues, editUserSchema } from "@/features/users/validator";

const defaultFormValues: EditUserFormValues = {
  _id: "",
  email: "",
  fullName: "",
  role: "employee",
  department: null,
  position: "",
  birthDate: null,
  leader: null,
};

const inviteUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "manager", "employee"]),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export default function TeamPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [leaderSearch, setLeaderSearch] = useState("");
  const [selectedLeaderName, setSelectedLeaderName] = useState("");
  const [leaderDropdownOpen, setLeaderDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const debouncedSearch = useDebounce(search, 1000);
  const debouncedLeaderSearch = useDebounce(leaderSearch, 1000);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleLeaderSearchChange = (value: string) => {
    setLeaderSearch(value);
  };

  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const { data: usersResponse, isLoading: isLoadingUsers, error: errorUsers, isError: isErrorUsers } = useGetUsers({ search: debouncedSearch, page, limit });
  const { data: leadersResponse, isLoading: isLoadingLeaders, isError: isErrorLeaders } = useSearchUsers(debouncedLeaderSearch);
  const { mutate: inviteUsers, isPending: isInvitingUsers } = useInviteUsers();
  const { mutate: updateUserMutation, isPending: isPendingUpdateUser } = useUpdateUser();
  const { mutate: deleteUserMutation, isPending: isPendingDeleteUser } = useDeleteUser();
  const { data: departments, isLoading: isLoadingDepartments } = useGetDepartments();

  const pagination = useMemo(() => usersResponse?.pagination, [usersResponse]);
  const users = useMemo(() => usersResponse?.data || [], [usersResponse]);
  const leaders = useMemo(() => leadersResponse?.data, [leadersResponse]);

  // Combined dialog state handler
  const [dialogType, setDialogType] = useState<"invite" | "edit" | "delete" | null>(null);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const isAdminOrOwner = currentUser?.role === "admin" || currentUser?.role === "owner";

  const { 
    control, 
    handleSubmit, 
    formState: { errors, isValid, isDirty, dirtyFields }, 
    reset, 
    getValues 
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: defaultFormValues,
  });

  const handleCloseDialog = () => {
    setDialogType(null);
    reset(defaultFormValues);
    setSelectedLeaderName("");
    setLeaderSearch("");
  };

  const handleSelectedUser = (user: IUser, method: "edit" | "delete") => {
    setDialogType(method);

    const leaderId = user.leader && typeof user.leader === "object" ? user.leader._id : (user.leader || null);
    const leaderName = user.leader && typeof user.leader === "object" ? user.leader.fullName : "";

    reset({
      _id: user._id,
      email: user.email || "",
      fullName: user.fullName || "",
      role: (user.role as "admin" | "manager" | "employee") || "employee",
      department: user.department?._id || null,
      position: user.position || "",
      birthDate: user.birthDate ? moment(user.birthDate).format("YYYY-MM-DD") : null,
      leader: leaderId,
    });

    setSelectedLeaderName(leaderName);
    setLeaderSearch("");
  };

  const onInviteSubmit = (data: InviteUserFormValues) => {
    if (!data.email) return;
    inviteUsers({ 
      emails: [data.email], 
      role: data.role
    }, {
      onSuccess: handleCloseDialog,
    });
  };

  const onEditSubmit = (data: EditUserFormValues) => {
    if (!data._id) return;
    const partialPayload: Record<string, any> = {};

    Object.keys(dirtyFields).forEach((key) => {
      if (key !== "_id" && key !== "email") {
        partialPayload[key] = data[key as keyof typeof data];
      }
    });

    updateUserMutation({
      userId: data._id,
      payload: partialPayload,
    }, {
      onSuccess: () => {
        handleCloseDialog();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  const onDeleteSubmit = () => {
    const values = getValues();
    if (!values._id) return;

    deleteUserMutation({
      userId: values._id,
    }, {
      onSuccess: () => {
        handleCloseDialog();
        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
    });
  };

  const columnDisplayLabels = {
    fullName: "Name",
    email: "Email",
    leader: "Leader",
    role: "Role",
    department: "Department",
    position: "Position"
  };

  const columns = useMemo<ColumnDef<IUser>[]>(() => [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="px-0 h-8 hover:bg-transparent" icon={ArrowUpDown} iconPosition="right">
          Name
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: () => (
        <span>Email</span>
      ),
    },
    {
      id: "leader",
      accessorFn: (row) => row.leader?.fullName || "",
      header: () => (
        <span>Leader</span>
      ),
    },
    {
      accessorKey: "role",
      header: () => (
        <span>Role</span>
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        return role.charAt(0).toUpperCase() + role.slice(1);
      },
    },
    {
      id: "department",
      accessorFn: (row) => row.department?.name || "",
      header: () => (
         <span>Department</span>
      ),
    },
    {
      accessorKey: "position",
      header: () => (
        <span>Position</span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;
        if (!isAdminOrOwner) return null;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'ghost'} className="p-1" icon={MoreHorizontalIcon} iconPosition="left">
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelectedUser(user, "edit")}> <Pencil className="size-4" /> Edit</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelectedUser(user, "delete")} variant="destructive"> <Trash className="size-4" /> Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [isAdminOrOwner]);

  if (isLoadingDepartments) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if (isErrorUsers) {
    return <ErrorMessage title={(errorUsers as any)?.response?.data?.message || (errorUsers as Error).message || "Failed to get users"} />;
  }

  return (
    <>
      <Dialog open={dialogType === "invite"} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onInviteSubmit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => <Input placeholder="Email" id="email" {...field} />}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>
            <Button type="submit" loading={isInvitingUsers} disabled={isInvitingUsers || !isValid}>Invite</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "edit"} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onEditSubmit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="fullName">FullName</Label>
              <Controller
                control={control}
                name="fullName"
                render={({ field }) => <Input placeholder="FullName" id="fullName" {...field} />}
              />
              {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={String(field.value ?? "employee")} onValueChange={field.onChange}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="department">Department</Label>
              <Controller
                control={control}
                name="department"
                render={({ field }) => {
                  const rawValue = field.value && typeof field.value === "object" ? (field.value as any)._id : field.value;
                  return (
                    <Select value={String(rawValue ?? "")} onValueChange={(value) => field.onChange(value || null)}>
                      <SelectTrigger id="department" className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments && departments.map((dept) => (
                          <SelectItem key={dept._id} value={dept._id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="position">Position</Label>
              <Controller
                control={control}
                name="position"
                render={({ field }) => <Input placeholder="Position" id="position" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />}
              />
              {errors.position && <p className="text-sm text-red-500">{errors.position.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="leader">Leader</Label>
              <Controller
                control={control}
                name="leader"
                render={({ field }) => {
                  const currentLeaderId = typeof field.value === "string" ? field.value : "";
                  const selectedLeaderUser = leaders?.find((u) => u._id === currentLeaderId);
                  const displayLabel = selectedLeaderUser?.fullName || selectedLeaderName || "Select a leader...";

                  return (
                    <DropdownMenu open={leaderDropdownOpen} onOpenChange={setLeaderDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button id="leader" variant="outline" role="combobox" className="w-full justify-between font-normal group" icon={ChevronDownIcon} iconClassName="pointer-events-none size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" iconPosition="right">
                          {displayLabel}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="p-0 w-[var(--radix-dropdown-menu-trigger-width)]" align="start">
                        <Command className="w-full p-0!" shouldFilter={false}>
                          <CommandInput placeholder="Search users..." value={leaderSearch} onValueChange={handleLeaderSearchChange} />
                          <CommandList className="max-h-[100px] overflow-y-auto mt-2">
                            {isLoadingLeaders && (
                              <div className="flex justify-center items-center py-4">
                                <Spinner className="size-4" />
                              </div>
                            )}
                            {!isLoadingLeaders && !isErrorLeaders && (
                              <>
                                {leaders && leaders.length === 0 && (
                                  <CommandItem disabled className="justify-center py-2 text-sm text-muted-foreground">No users found.</CommandItem>
                                )}
                                {leaders && leaders.map((user) => (
                                  <CommandItem
                                    key={user._id}
                                    value={user.fullName}
                                    onSelect={() => {
                                      field.onChange(user._id);
                                      setSelectedLeaderName(user.fullName);
                                      setLeaderSearch("");
                                      setLeaderDropdownOpen(false);
                                    }}
                                    className="cursor-pointer"
                                  >
                                    {user.fullName}
                                  </CommandItem>
                                ))}
                              </>
                            )}
                            {isErrorLeaders && <CommandItem disabled className="text-center text-red-500">Failed to load users.</CommandItem>}
                          </CommandList>
                        </Command>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }}
              />
              {errors.leader && <p className="text-sm text-red-500">{errors.leader.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => (
                  <BaseDatePicker
                    id="birthDate"
                    value={field.value}
                    onChange={(date) => field.onChange(date ? moment(date).format("YYYY-MM-DD") : null)}
                    placeholder="Select date"
                  />
                )}
              />
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
            </div>
            <Button type="submit" loading={isPendingUpdateUser} disabled={isPendingUpdateUser || !isDirty}>Update</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "delete"} onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={handleCloseDialog}>Cancel</Button>
            <Button type="button" variant="destructive" loading={isPendingDeleteUser} disabled={isPendingDeleteUser} onClick={onDeleteSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex justify-between items-end flex-row px-0 mb-4">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-sm text-muted-foreground">A comprehensive view of your reporting tree, leadership structure, and team members.</p>
        </div>
        {isAdminOrOwner && <Button onClick={() => setDialogType("invite")} disabled={isLoadingUsers}>Invite</Button>}
      </div>
      {/* <Card className="border-none ring-0 shadow-none">
        <CardContent className="px-0"> */}
          <BaseTable
            columns={columns}
            data={users}
            columnLabels={columnDisplayLabels}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            showSearchField={!isErrorUsers}
            searchValue={search}
            onSearchChange={handleSearchChange}
            searchPlaceholder="Search by name, email, or department..."
            currentPage={page}
            totalPages={pagination?.totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            isLoading={isLoadingUsers}
            isEmptyData={users && users?.length === 0}
            emptyDataDescription="No users found in your team"
            emptyDataIcon={<Users className="size-10 text-muted-foreground" />}
            enableRowSelection={true}
            rowSelection={rowSelection}
            onRowSelectionChange={setRowSelection}
            bulkActions={[
              {
                label: "Change Role",
                icon: UserCheck,
                onClick: (selected) => console.log(selected),
              },
              {
                label: "Export",
                icon: Download,
                onClick: (selected) => console.log(selected),
              },
              {
                label: "Delete",
                icon: Trash2,
                variant: "destructive",
                onClick: (selected) => console.log(selected),
              },
            ]}
          />
        {/* </CardContent>
      </Card> */}
    </>
  );
}