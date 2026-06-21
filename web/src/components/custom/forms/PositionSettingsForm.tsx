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
import { Spinner } from "@/components/ui/spinner";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MoreHorizontalIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { useCreatePosition, useUpdatePosition, useDeletePosition, useDisablePosition, useEnablePosition, useGetPositions } from "@/features/positions/hooks";
import { positionSchema, PositionSchema } from "@/features/positions/validator";

export function PositionSettingsForm({ tenantId, tenant, isLoading }: { tenantId: string, tenant: ITenant, isLoading: boolean }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEnableDisableOpen, setIsEnableDisableOpen] = useState({
    method: "disabled",
    openDialog: false
  });

  const [selectedPositionId, setSelectedPositionId] = useState<string | null>(null);

  const { data: positions, isLoading: isLoadingPositions, isError: isErrorPositions } = useGetPositions(tenantId);
  const { mutate: createPosition, isPending: isPendingCreatePosition, error: errorCreatePosition, isError: isErrorCreatePosition } = useCreatePosition();
  const { mutate: updatePosition, isPending: isPendingUpdatePosition, error: errorUpdatePosition, isError: isErrorUpdatePosition } = useUpdatePosition();
  const { mutate: deletePosition, isPending: isPendingDeletePosition, error: errorDeletePosition, isError: isErrorDeletePosition } = useDeletePosition();
  const { mutate: disablePosition, isPending: isPendingDisablePosition, error: errorDisablePosition, isError: isErrorDisablePosition } = useDisablePosition();
  const { mutate: enablePosition, isPending: isPendingEnablePosition, error: errorEnablePosition, isError: isErrorEnablePosition } = useEnablePosition();


  const { register, handleSubmit, formState: { errors }, reset } = useForm<{name: string}>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: "",
    },
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, formState: { errors: errorsEdit }, reset: resetEdit } = useForm<PositionSchema>({
    resolver: zodResolver(positionSchema),
    defaultValues: {
      name: "",
      status: 'active',
      _id: "",
    },
  });

  const onSubmit = (data: PositionSchema) => {
    createPosition({
      name: data.name,
    }, {
      onSuccess: () => {
        reset({
          name: "",
        });
        setIsOpen(false);
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const onEditSubmit = (data: PositionSchema) => {
    updatePosition({
      id: selectedPositionId || '',
      payload: {
        name: data.name,
        status: data.status || 'active',
      },
    }, {
      onSuccess: () => {
        resetEdit({
          name: "",
          status: 'active',
          _id: "",
        });
        setIsEditOpen(false);
        setIsDeleteOpen(false);
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const handleDeleteSubmit = () => {
    deletePosition(selectedPositionId || '', {
      onSuccess: () => {
        setIsDeleteOpen(false);
        setSelectedPositionId(null);
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const handleDisableSubmit = () => {
    disablePosition(selectedPositionId || '', {
      onSuccess: () => {
        setIsEnableDisableOpen((prev) => ({...prev, openDialog: false}));
        setSelectedPositionId(null);
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const handleEnableSubmit = () => {
    enablePosition(selectedPositionId || '', {
      onSuccess: () => {
        setIsEnableDisableOpen((prev) => ({...prev, openDialog: false}));
        setSelectedPositionId(null);
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const handleDropdownClicked = (method: 'edit' | 'delete' | 'disable', data: PositionSchema) => {
    if (method === 'edit') {
      setIsEditOpen(true);
      setSelectedPositionId(data._id || '');
      resetEdit({
        _id: data._id,
        name: data.name,
        status: data.status,
      });
    } else if (method === 'delete') {
      setIsDeleteOpen(true);
      setSelectedPositionId(data._id || '');
    } else if (method === 'disable') {
      setIsEnableDisableOpen((prev) => ({...prev, openDialog: true, method: "disabled"}));
      setSelectedPositionId(data._id || '');
    } else if (method === 'enable') {
      setIsEnableDisableOpen((prev) => ({...prev, openDialog: true, method: "enabled"}));
      setSelectedPositionId(data._id || '');
    } else {
      setSelectedPositionId(null);
      resetEdit({
        _id: "",
        name: "",
        status: 'active',
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Position</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-end gap-4 w-full">
            <div className="flex w-full flex-col gap-2">
              <Label className="whitespace-nowrap" required>Name</Label>
              <Input type="text" {...register("name")} />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>
            <Button type="submit" disabled={isPendingCreatePosition}>{isPendingCreatePosition ? <Spinner /> : 'Add'}</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitEdit(onEditSubmit)} className="flex flex-col items-end gap-4 w-full">
            <div className="flex w-full flex-col gap-2">
              <Label className="whitespace-nowrap" required>Name</Label>
              <Input type="text" {...registerEdit("name")} />
              {errorsEdit.name && <p className="text-red-500">{errorsEdit.name.message}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsEditOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isPendingUpdatePosition}>{isPendingUpdatePosition ? <Spinner /> : 'Update'}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Position</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to delete this position? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button type="submit" variant="destructive" disabled={isPendingDeletePosition} onClick={handleDeleteSubmit}>
              {isPendingDeletePosition ? <Spinner /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEnableDisableOpen.openDialog} onOpenChange={(open) => setIsEnableDisableOpen((prev) => ({...prev, openDialog: open}))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEnableDisableOpen.method === "disabled" ? "Disable Position" : "Enable Position"}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to {isEnableDisableOpen.method === "disabled" ? "disable" : "enable"} this position?
          </DialogDescription>
          <DialogFooter>
            <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => setIsEnableDisableOpen((prev) => ({...prev, openDialog: false}))}>Cancel</Button>
            {isEnableDisableOpen.method === "disabled" ? (
              <Button type="submit" variant="destructive" disabled={isPendingDisablePosition} onClick={handleDisableSubmit}>
                {isPendingDisablePosition ? <Spinner /> : 'Disable'}
                </Button>
            ) : (
              <Button type="submit" variant="destructive" disabled={isPendingEnablePosition} onClick={handleEnableSubmit}>{isPendingEnablePosition ? <Spinner /> : 'Enable'}</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-full max-w-2xl rounded-md pt-2 pb-0 flex flex-col justify-start items-end gap-2">
        <Button className="mb-0 mr-0 md:mr-2 md:mb-2" onClick={() => setIsOpen(true)}>Add Position</Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positions?.data?.map((position) => (
              <TableRow key={position._id}>
                <TableCell>{position.name}</TableCell>
                <TableCell>
                  <Badge className={`${position.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : position.status === "disabled" ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
                    {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell align="right"> 
                  <DropdownMenu> 
                    <DropdownMenuTrigger asChild> 
                        <MoreHorizontalIcon className="cursor-pointer" />
                    </DropdownMenuTrigger> 
                    <DropdownMenuContent align="end"> 
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleDropdownClicked('edit', position)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => handleDropdownClicked('disable', position)}> Disable </DropdownMenuItem> 
                      <DropdownMenuItem className="cursor-pointer" variant="destructive" onClick={() => handleDropdownClicked('delete', position)}> Delete </DropdownMenuItem> 
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