"use client";

import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetUsers, useUpdateUser } from "@/features/users/hooks";
import { MoreHorizontalIcon, Users } from "lucide-react";
import { useMemo, useState } from "react";
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
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { BasePagination } from "@/components/custom/pagination/BasePagination";
import { useGetDepartments } from "@/features/departments/hooks";
import { useGetPositions } from "@/features/positions/hooks";
import { IUser } from "@/features/users/users";
import { BaseDatePicker } from "@/components/custom/date-picker/BaseDatePicker";
import { useQueryClient } from "@tanstack/react-query";
import { EditUserFormValues, editUserSchema } from "@/features/users/validator";
import { Skeleton } from "@/components/ui/skeleton";
import moment from "moment";

export default function TeamPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const debouncedSearch = useDebounce(search, 1000);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const currentUser = useSelector((state: RootState) => state.currentUser.user);
  const { data: usersResponse, isLoading: isLoadingUsers, error: errorUsers, isError: isErrorUsers } = useGetUsers({ search: debouncedSearch, page, limit });
  const { mutate: inviteUsers, isPending: isInvitingUsers } = useInviteUsers();
  const { mutate: updateUserMutation, isPending: isPendingUpdateUser } = useUpdateUser();
  const { data: departments, isLoading: isLoadingDepartments } = useGetDepartments();
  const { data: positions, isLoading: isLoadingPositions } = useGetPositions();

  const pagination = useMemo(() => usersResponse?.pagination, [usersResponse]);
  const users = useMemo(() => usersResponse?.data, [usersResponse]);

  const [open, setOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { register: registerInvite, handleSubmit: handleSubmitInvite, formState: { errors: errorsInvite, isValid: isValidInvite }, reset: resetInvite, setValue: setValueInvite } = useForm<{ email: string, role: "admin" | "manager" | "team-leader" | "employee" }>({
    resolver: zodResolver(z.object({
      email: z.string().email("Invalid email address"),
      role: z.enum(["admin", "manager", "team-leader", "employee"]),
    })),
    defaultValues: {
      email: "",
      role: "employee",
    },
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, setValue: setValueEdit, getValues: getValuesEdit, control: controlEdit, formState: { errors: errorsEdit, isDirty: isDirtyEdit, dirtyFields: dirtyFieldsEdit }, reset: resetEdit } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      _id: "",
      fullName: "",
      role: "employee",
      department: null,
      position: null,
      birthDate: null,
    },
  });

  const onSubmit = (data: { email: string, role: "admin" | "manager" | "team-leader" | "employee" }) => {
    console.log(data);
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
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    resetInvite({
      email: "",
      role: "employee",
    });
  }

  const handleEditClicked = (user: IUser) => {
    setIsEditOpen(true);
    resetEdit({
      _id: user._id,
      fullName: user.fullName,
      role: user.role as "admin" | "manager" | "team-leader" | "employee",
      department: user.department as string,
      position: user.position as string,
      birthDate: user.birthDate ? moment(user.birthDate).format("YYYY-MM-DD") : null,
    });
  }
  const queryClient = useQueryClient();

  const onSubmitEdit = (data: EditUserFormValues) => {
    const partialPayload: Record<string, any> = {};

    Object.keys(dirtyFieldsEdit).forEach((key) => {
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
        resetEdit(data);
        
        queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    });
  }

  if (isLoadingDepartments || isLoadingPositions) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }

  if(isErrorUsers) {
    return <ErrorMessage title={(errorUsers as any)?.response?.data?.message || (errorUsers as Error).message || 'Failed to get users'} />
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
              <Input placeholder="Email" {...registerInvite("email")} />
              {errorsInvite.email && <p className="text-sm text-red-500">{errorsInvite.email.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValueInvite("role", value as "admin" | "manager" | "team-leader" | "employee")} defaultValue="employee" {...registerInvite("role")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team-leader">Team Leader</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
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
          <form onSubmit={handleSubmitEdit(onSubmitEdit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="email">FullName</Label>
              <Input placeholder="FullName" {...registerEdit("fullName")} />
              {errorsEdit.fullName && <p className="text-sm text-red-500">{errorsEdit.fullName.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Select value={getValuesEdit("role")} onValueChange={(value) => setValueEdit("role", value as "admin" | "manager" | "team-leader" | "employee")} defaultValue="employee" {...registerEdit("role")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="team-leader">Team Leader</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
              {errorsEdit.role && <p className="text-sm text-red-500">{errorsEdit.role.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="department">Department</Label>
              <Controller
                control={controlEdit}
                name="department"
                render={({ field }) => {
                  const rawValue = field.value && typeof field.value === "object"
                    ? (field.value as any)._id
                    : field.value;

                  return (
                    <Select 
                      value={rawValue || undefined} 
                      onValueChange={(value) => field.onChange(value)}
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
              {errorsEdit.department && <p className="text-sm text-red-500">{errorsEdit.department.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="position">Position</Label>
              <Controller
                control={controlEdit}
                name="position"
                render={({ field }) => {
                  const rawValue = field.value && typeof field.value === "object"
                    ? (field.value as any)._id
                    : field.value;

                  return (
                    <Select 
                      value={rawValue || undefined} 
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions?.data && positions.data.map((position) => (
                          <SelectItem key={position._id} value={position._id}>
                            {position.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errorsEdit.position && <p className="text-sm text-red-500">{errorsEdit.position.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Controller
                control={controlEdit}
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
              {errorsEdit.birthDate && <p className="text-sm text-red-500">{errorsEdit.birthDate.message}</p>}
            </div>
            <Button type="submit" disabled={isPendingUpdateUser || !isDirtyEdit}>{isPendingUpdateUser ? <Spinner /> : "Update"}</Button>
          </form>
        </DialogContent>
      </Dialog>
    
      <main className="flex flex-1 flex-col gap-4">
        <Card>
          <CardHeader className="flex justify-between items-end">
            <div>
              <CardTitle className="text-2xl font-bold">Team</CardTitle>
              <CardDescription>List of all users in your team</CardDescription>
            </div>
            {(currentUser?.role === "admin" || currentUser?.role === "owner") && (
              <Button onClick={() => setOpen(true)}>Invite</Button>
            )}
          </CardHeader>
          <CardContent>
            {!isErrorUsers && 
              <InputGroup>
                <InputGroupInput placeholder="Searching..." value={search} onChange={(e) => handleSearchChange(e.target.value)} />
              </InputGroup>
            }
            {isLoadingUsers && <div className="flex justify-center items-center min-h-[200px]"> <Spinner className="size-10" /> </div>}
            {!isLoadingUsers && users && users.length === 0 && 
              <EmptyData description="No users found in your team" icon={<Users className="size-10 text-muted-foreground" />} />
            }
            {!isLoadingUsers && users && users.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</TableCell>
                      <TableCell className="text-right"> 
                        <DropdownMenu> 
                          <DropdownMenuTrigger asChild> 
                              <MoreHorizontalIcon className="cursor-pointer" />
                          </DropdownMenuTrigger> 
                          <DropdownMenuContent align="end"> 
                            <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditClicked(user)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" variant="destructive"> Delete </DropdownMenuItem> 
                          </DropdownMenuContent> 
                        </DropdownMenu> 
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>


        {pagination && pagination.totalPages > 1 && (
          <BasePagination currentPage={page} totalPages={pagination.totalPages} onPageChange={(page) => setPage(page)} />
        )}

      </main>
    </>
  );
}