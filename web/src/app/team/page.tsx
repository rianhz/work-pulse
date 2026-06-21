"use client";

import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetUsers } from "@/features/users/hooks";
import { MoreHorizontalIcon, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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

  const pagination = useMemo(() => usersResponse?.pagination, [usersResponse]);
  const users = useMemo(() => usersResponse?.data, [usersResponse]);

  const [open, setOpen] = useState(false);

  const { register, handleSubmit, formState: { errors, isValid }, reset, setValue } = useForm<{ email: string, role: "admin" | "manager" | "team-leader" | "employee" }>({
    resolver: zodResolver(z.object({
      email: z.string().email("Invalid email address"),
      role: z.enum(["admin", "manager", "team-leader", "employee"]),
    })),
    defaultValues: {
      email: "",
      role: "employee",
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
        reset({
          email: "",
          role: "employee",
        });
      },
    });
  }

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    reset({
      email: "",
      role: "employee",
    });
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
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between items-end gap-4 w-full">
            <div className="grid gap-2 w-full">
              <Label htmlFor="email">Email</Label>
              <Input placeholder="Email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="grid gap-2 w-full">
              <Label htmlFor="role">Role</Label>
              <Select onValueChange={(value) => setValue("role", value as "admin" | "manager" | "team-leader" | "employee")} defaultValue="employee" {...register("role")}>
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
              {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}
            </div>
            <Button type="submit" disabled={isInvitingUsers || !isValid}>{isInvitingUsers ? <Spinner /> : "Invite"}</Button>
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
                            <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
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