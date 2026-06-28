"use client";

import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteUser, useGetUsers, useSearchUsers, useUpdateUser } from "@/features/users/hooks";
import { ChevronDownIcon, MoreHorizontalIcon, Users, ArrowUpDown } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useInviteUsers } from "@/features/invitations/hooks";
import { EmptyData } from "@/components/custom/errors-and-empty/EmptyData";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetDepartments } from "@/features/departments/hooks";
import { IUser } from "@/features/users/users";
import { BaseDatePicker } from "@/components/custom/date-picker/BaseDatePicker";
import { useQueryClient } from "@tanstack/react-query";
import { EditUserFormValues, editUserSchema } from "@/features/users/validator";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { ColumnDef, VisibilityState } from "@tanstack/react-table";
import { BaseTable } from "@/components/custom/table/BaseTable";

export default function TeamPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [leaderSearch, setLeaderSearch] = useState("");
  const [selectedLeaderName, setSelectedLeaderName] = useState("");
  const [leaderDropdownOpen, setLeaderDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;

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

  const [open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const isAdminOrOwner = currentUser?.role === "admin" || currentUser?.role === "owner";

  const { control: controlInvite, handleSubmit: handleSubmitInvite, formState: { errors: errorsInvite, isValid: isValidInvite }, reset: resetInvite } = useForm<{ email: string, role: "admin" | "manager" | "employee" }>({
    resolver: zodResolver(z.object({
      email: z.string().email("Invalid email address"),
      role: z.enum(["admin", "manager", "employee"]),
    })),
    defaultValues: {
      email: "",
      role: "employee",
    },
  });

  const { handleSubmit: handleSubmitSelectedUser, getValues: getValuesSelectedUser, control: controlSelectedUser, formState: { errors: errorsSelectedUser, isDirty: isDirtySelectedUser, dirtyFields: dirtyFieldsSelectedUser }, reset: resetSelectedUser } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      _id: "",
      fullName: "",
      role: "employee",
      department: null,
      position: "",
      birthDate: null,
      leader: null,
    },
  });

  const onSubmit = (data: { email: string, role: "admin" | "manager" | "employee" }) => {
    inviteUsers({ 
      emails: [data.email], 
      role: data.role
    }, {
      onSuccess: () => {
        setOpen(false);
        resetInvite({
          email: "",
          role: "employee",
        });
      },
    });
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    resetInvite({
      email: "",
      role: "employee",
    });
  };

  const handleSelectedUser = (user: IUser, method: 'edit' | 'delete') => {
    if (method === 'edit') {
      setIsEditOpen(true);
    } else {
      setIsDeleteOpen(true);
    }

    const leaderId = user.leader && typeof user.leader === "object" ? user.leader._id : (user.leader || null);
    const leaderName = user.leader && typeof user.leader === "object" ? user.leader.fullName : "";

    resetSelectedUser({
      _id: user._id,
      fullName: user.fullName,
      role: user.role as "admin" | "manager" | "employee",
      department: user.department?._id || null,
      position: user.position || "",
      birthDate: user.birthDate ? moment(user.birthDate).format("YYYY-MM-DD") : null,
      leader: leaderId,
    });

    setSelectedLeaderName(leaderName);
    setLeaderSearch("");
  };

  const onSubmitEdit = (data: EditUserFormValues) => {
    const partialPayload: Record<string, any> = {};

    Object.keys(dirtyFieldsSelectedUser).forEach((key) => {
      if (key !== "_id") {
        partialPayload[key] = data[key as keyof typeof data];
      }
    });

    updateUserMutation({
      userId: data._id,
      payload: partialPayload,
    }, {
      onSuccess: () => {
        setIsEditOpen(false);
        resetSelectedUser({
          _id: "",
          fullName: "",
          role: "employee",
          department: null,
          position: "",
          birthDate: null,
          leader: null,
        });
        setSelectedLeaderName("");
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  };

  const onSubmitDelete = (data: EditUserFormValues) => {
    deleteUserMutation({
      userId: data._id,
    }, {
      onSuccess: () => {
        setIsDeleteOpen(false);
        resetSelectedUser({
          _id: "",
          fullName: "",
          role: "employee",
          department: null,
          position: "",
          birthDate: null,
          leader: null,
        });
        queryClient.invalidateQueries({ queryKey: ['users'] });
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
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          <span>Name</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          <span>Email</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      id: "leader",
      accessorFn: (row) => row.leader?.fullName || "",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          <span>Leader</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          <span>Role</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const role = row.original.role;
        return role.charAt(0).toUpperCase() + role.slice(1);
      },
    },
    {
      id: "department",
      accessorFn: (row) => row.department?.name || "",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          <span>Department</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "position",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="-ml-4 h-8">
          <span>Position</span>
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
              <button className="p-1 hover:bg-muted rounded-md transition-colors">
                <MoreHorizontalIcon className="cursor-pointer" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelectedUser(user, 'edit')}>Edit</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" onClick={() => handleSelectedUser(user, 'delete')} variant="destructive">Delete</DropdownMenuItem>
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
    return <ErrorMessage title={(errorUsers as any)?.response?.data?.message || (errorUsers as Error).message || 'Failed to get users'} />;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitInvite(onSubmit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Controller
                control={controlInvite}
                name="email"
                render={({ field }) => (
                  <Input placeholder="Email" {...field} />
                )}
              />
              {errorsInvite.email && <p className="text-sm text-red-500">{errorsInvite.email.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={controlInvite}
                name="role"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
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
              {errorsInvite.role && <p className="text-sm text-red-500">{errorsInvite.role.message}</p>}
            </div>
            <Button type="submit" disabled={isInvitingUsers || !isValidInvite}>{isInvitingUsers ? <Spinner /> : "Invite"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitSelectedUser(onSubmitEdit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="fullName">FullName</Label>
              <Controller
                control={controlSelectedUser}
                name="fullName"
                render={({ field }) => (
                  <Input placeholder="FullName" {...field} />
                )}
              />
              {errorsSelectedUser.fullName && <p className="text-sm text-red-500">{errorsSelectedUser.fullName.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Controller
                control={controlSelectedUser}
                name="role"
                defaultValue="employee"
                render={({ field }) => (
                  <Select
                    value={String(field.value ?? "employee")}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
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
              {errorsSelectedUser.role && <p className="text-sm text-red-500">{errorsSelectedUser.role.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="department">Department</Label>
              <Controller
                control={controlSelectedUser}
                name="department"
                render={({ field }) => {
                  const rawValue = field.value && typeof field.value === "object"
                    ? (field.value as any)._id
                    : field.value;

                  return (
                    <Select 
                      value={String(rawValue ?? "")}
                      onValueChange={(value) => field.onChange(value || null)}
                    >
                      <SelectTrigger className="w-full">
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
              {errorsSelectedUser.department && <p className="text-sm text-red-500">{errorsSelectedUser.department.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="position">Position</Label>
              <Controller
                control={controlSelectedUser}
                name="position"
                render={({ field }) => {
                  const rawValue = field.value ?? "";

                  return (
                    <Input placeholder="Position" value={rawValue} onChange={(e) => field.onChange(e.target.value)} />
                  );
                }}
              />
              {errorsSelectedUser.position && <p className="text-sm text-red-500">{errorsSelectedUser.position.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="leader">Leader</Label>
              <Controller
                control={controlSelectedUser}
                name="leader"
                render={({ field }) => {
                  const currentLeaderId = typeof field.value === "string" ? field.value : "";
                  const selectedLeaderUser = leaders?.find((u) => u._id === currentLeaderId);
                  const displayLabel = selectedLeaderUser?.fullName || selectedLeaderName || "Select a leader...";

                  return (
                    <DropdownMenu open={leaderDropdownOpen} onOpenChange={setLeaderDropdownOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between font-normal group"
                        >
                          {displayLabel}
                          <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </Button>
                      </DropdownMenuTrigger>
                      
                      <DropdownMenuContent className="p-0 w-[var(--radix-dropdown-menu-trigger-width)]" align="start">
                        <Command className="w-full p-0!" shouldFilter={false}>
                          <CommandInput
                            placeholder="Search users..."
                            value={leaderSearch}
                            onValueChange={handleLeaderSearchChange}
                          />
                          <CommandList className="max-h-[100px] overflow-y-auto mt-2">
                            {isLoadingLeaders && (
                              <div className="flex justify-center items-center py-4">
                                <Spinner className="size-4" />
                              </div>
                            )}

                            {!isLoadingLeaders && !isErrorLeaders && (
                              <>
                                {leaders && leaders.length === 0 && (
                                  <CommandItem disabled className="justify-center py-2 text-sm text-muted-foreground">
                                    No users found.
                                  </CommandItem>
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

                            {isErrorLeaders && (
                              <CommandItem disabled className="text-center text-red-500">
                                Failed to load users.
                              </CommandItem>
                            )}
                          </CommandList>
                        </Command>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  );
                }}
              />
              {errorsSelectedUser.leader && <p className="text-sm text-red-500">{errorsSelectedUser.leader.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Controller
                control={controlSelectedUser}
                name="birthDate"
                render={({ field }) => (
                  <BaseDatePicker
                    value={field.value}
                    onChange={(date) => {
                      field.onChange(date ? moment(date).format("YYYY-MM-DD") : null);
                    }}
                    placeholder="Select date"
                  />
                )}
              />
              {errorsSelectedUser.birthDate && <p className="text-sm text-red-500">{errorsSelectedUser.birthDate.message}</p>}
            </div>
            <Button type="submit" disabled={isPendingUpdateUser || !isDirtySelectedUser}>{isPendingUpdateUser ? <Spinner /> : "Update"}</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={isPendingDeleteUser} onClick={() => onSubmitDelete(getValuesSelectedUser())}>
              {isPendingDeleteUser ? <Spinner /> : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    
      <>
        <Card>
          <CardHeader className="flex justify-between items-end flex-row">
            <div>
              <CardTitle className="text-2xl font-bold">Team</CardTitle>
              <CardDescription>A comprehensive view of your reporting tree, leadership structure, and team members.</CardDescription>
            </div>
            {isAdminOrOwner && (
              <Button onClick={() => setOpen(true)}>Invite</Button>
            )}
          </CardHeader>
          <CardContent>
            {isLoadingUsers && <div className="flex justify-center items-center min-h-[200px]"> <Spinner className="size-10" /> </div>}
            
            {!isLoadingUsers && users.length === 0 && 
              <EmptyData description="No users found in your team" icon={<Users className="size-10 text-muted-foreground" />} />
            }
            
            {!isLoadingUsers && users.length > 0 && (
              <BaseTable 
                columns={columns} 
                data={users} 
                columnLabels={columnDisplayLabels} 
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisibility}
                
                // Controlled Search Configurations
                showSearchField={!isErrorUsers}
                searchValue={search}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Searching..."

                // Pagination Configurations
                currentPage={page}
                totalPages={pagination?.totalPages}
                onPageChange={(newPage) => setPage(newPage)}

            
              />
            )}
          </CardContent>
        </Card>
      </>
    </>
  );
}