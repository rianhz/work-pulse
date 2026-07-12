import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ITenant } from "@/features/tenants/tenant";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DepartmentSchema, departmentSchema } from "@/features/departments/validator";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDepartment, useDeleteDepartment, useDisableDepartment, useEnableDepartment, useGetDepartments, useUpdateDepartment } from "@/features/departments/hooks";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Info, MoreHorizontalIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

export function DepartmentSettingsForm({ tenantId, tenant, isLoading }: { tenantId: string, tenant: ITenant, isLoading: boolean }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEnableDisableOpen, setIsEnableDisableOpen] = useState({
    method: "disabled",
    openDialog: false
  });

  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | null>(null);

  const { data: departments, isLoading: isLoadingDepartments, isError: isErrorDepartments } = useGetDepartments();
  const { mutate: createDepartment, isPending: isPendingCreateDepartment, error: errorCreateDepartment, isError: isErrorCreateDepartment } = useCreateDepartment();
  const { mutate: updateDepartment, isPending: isPendingUpdateDepartment, error: errorUpdateDepartment, isError: isErrorUpdateDepartment } = useUpdateDepartment();
  const { mutate: deleteDepartment, isPending: isPendingDeleteDepartment, error: errorDeleteDepartment, isError: isErrorDeleteDepartment } = useDeleteDepartment();
  const { mutate: disableDepartment, isPending: isPendingDisableDepartment, error: errorDisableDepartment, isError: isErrorDisableDepartment } = useDisableDepartment();
  const { mutate: enableDepartment, isPending: isPendingEnableDepartment, error: errorEnableDepartment, isError: isErrorEnableDepartment } = useEnableDepartment();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit } = useForm<DepartmentSchema>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      _id: "",
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: DepartmentSchema) => {
    createDepartment(data, {
      onSuccess: () => {
        reset({
          name: "",
          description: "",
        });
        setIsOpen(false);
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      },
    });
  };

  const onEditSubmit = (data: DepartmentSchema) => {
    updateDepartment({
      id: data._id || '',
      data: data,
    }, {
      onSuccess: () => {
        resetEdit({
          name: "",
          description: "",
          _id: "",
        });
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      },
    });
  };

  const handleDeleteSubmit = () => {
    deleteDepartment(selectedDepartmentId || '', {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedDepartmentId(null);
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      },
    });
  };

  const handleDisableSubmit = () => {
    disableDepartment(selectedDepartmentId || '', {
      onSuccess: () => {
        setIsEnableDisableOpen((prev) => ({...prev, openDialog: false}));
        setSelectedDepartmentId(null);
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      },
    });
  };

  const handleEnableSubmit = () => {
    enableDepartment(selectedDepartmentId || '', {
      onSuccess: () => {
        setIsEnableDisableOpen((prev) => ({...prev, openDialog: false}));
        setSelectedDepartmentId(null);
        queryClient.invalidateQueries({ queryKey: ['departments'] });
      },
    });
  };

  const handleDropdownClicked = (method: 'edit' | 'delete' | 'disable', data: DepartmentSchema) => {
    if (method === 'edit') {
      setIsEditOpen(true);
      resetEdit({
        _id: data._id,
        name: data.name || '',
        description: data.description || '',
      });
    } else if (method === 'delete') {
      setIsDeleteOpen(true);
      setSelectedDepartmentId(data._id || '');
    } else if (method === 'disable') {
      setIsEnableDisableOpen((prev) => ({...prev, openDialog: true, method: "disabled"}));
      setSelectedDepartmentId(data._id || '');
    } else if (method === 'enable') {
      setIsEnableDisableOpen((prev) => ({...prev, openDialog: true, method: "enabled"}));
      setSelectedDepartmentId(data._id || '');
    } else {
      setSelectedDepartmentId(null);
      resetEdit({
        _id: "",
        name: "",
        description: "",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-end gap-4 w-full">
            <div className="flex w-full flex-col gap-2">
              <Label className="whitespace-nowrap" required>Name</Label>
              <Input type="text" {...register("name")} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label className="whitespace-nowrap" optional>Description</Label>
              <Textarea rows={3} className="max-h-[150px]" {...register("description")} />
              {errors.description && <p className="text-red-500">{errors.description.message}</p>}
            </div>
            <Button type="submit" loading={isPendingCreateDepartment} disabled={isPendingCreateDepartment}>Add</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="flex flex-col items-end gap-4 w-full">
            <div className="flex w-full flex-col gap-2">
              <Label className="whitespace-nowrap" required>Name</Label>
              <Input type="text" {...registerEdit("name")} />
              {errorsEdit.name && <p className="text-red-500">{errorsEdit.name.message}</p>}
            </div>
            <div className="flex w-full flex-col gap-2">
              <Label className="whitespace-nowrap" optional>Description</Label>
              <Textarea rows={3} className="max-h-[150px]" {...registerEdit("description")} />
              {errorsEdit.description && <p className="text-red-500">{errorsEdit.description.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" loading={isPendingUpdateDepartment} disabled={isPendingUpdateDepartment}>Update</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this department? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" loading={isPendingDeleteDepartment} disabled={isPendingDeleteDepartment} onClick={handleDeleteSubmit}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEnableDisableOpen.openDialog} onOpenChange={(open) => setIsEnableDisableOpen((prev) => ({...prev, openDialog: open}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEnableDisableOpen.method === "disabled" ? "Disable Department" : "Enable Department"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to {isEnableDisableOpen.method === "disabled" ? "disable" : "enable"} this department?
          </DialogDescription>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsEnableDisableOpen((prev) => ({...prev, openDialog: false}))}>Cancel</Button>
            {isEnableDisableOpen.method === "disabled" ? (
              <Button type="submit" variant="destructive" loading={isPendingDisableDepartment} disabled={isPendingDisableDepartment} onClick={handleDisableSubmit}>
                Disable
                </Button>
            ) : (
              <Button type="submit" variant="destructive" loading={isPendingEnableDepartment} disabled={isPendingEnableDepartment} onClick={handleEnableSubmit}>Enable</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-full max-w-2xl rounded-md pt-2 pb-0 flex flex-col justify-start items-end gap-2">
        <Button className="mb-0 mr-0 md:mr-2 md:mb-2" onClick={() => setIsOpen(true)}>Add Department</Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments?.map((department) => (
              <TableRow key={department._id}>
                <TableCell className="flex items-center gap-2">
                  <span className="text-sm font-medium">{department.name}</span>
                  {department.description && (
                    <HoverCard openDelay={10} closeDelay={100}>
                      <HoverCardTrigger asChild>
                        <Info size={16} />
                      </HoverCardTrigger>
                      <HoverCardContent className="flex w-64 flex-col gap-0.5">
                        <div>{department.description}</div>
                      </HoverCardContent>
                    </HoverCard>
                  )}

                </TableCell>
                <TableCell>
                  <Badge className={`${department.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : department.status === "disabled" ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                    {department.status.charAt(0).toUpperCase() + department.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell align="right"> 
                  <DropdownMenu> 
                    <DropdownMenuTrigger asChild> 
                        <MoreHorizontalIcon className="cursor-pointer" />
                    </DropdownMenuTrigger> 
                    <DropdownMenuContent align="end"> 
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleDropdownClicked('edit', department)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleDropdownClicked('disable', department)}> Disable </DropdownMenuItem> 
                      <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={() => handleDropdownClicked('delete', department)}> Delete </DropdownMenuItem> 
                    </DropdownMenuContent> 
                  </DropdownMenu> 
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
}