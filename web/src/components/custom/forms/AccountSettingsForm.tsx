"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateFullNameFormValues,
  updateFullNameSchema,
  UpdatePasswordFormValues,
  updatePasswordSchema,
} from "@/features/users/validator";
import { Card } from "@/components/ui/card";
import { useGetMe, useGetMeProviders, useUpdateAvatar, useUpdateFullName } from "@/features/users/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { CircleCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChangePassword, useLogout, useRemoveGoogle, useRemovePassword } from "@/features/auth/hooks";
import { toast } from "sonner";
import BaseAvatar from "../images/BaseImage";
import { useQueryClient } from "@tanstack/react-query";

export function AccountSettingsForm() {
  const { data: user, isLoading } = useGetMe();
  const { data: providers, isLoading: isLoadingProviders } = useGetMeProviders();
  const { mutate: removePasswordMutation, isPending: isPendingRemovePassword } = useRemovePassword();
  const { mutate: removeGoogleMutation, isPending: isPendingRemoveGoogle } = useRemoveGoogle();
  const { mutate: logoutMutation, isPending: isPendingLogout } = useLogout();
  const { mutate: changePasswordMutation, isPending: isPendingChangePassword } = useChangePassword();
  const { mutate: updateAvatarMutation, isPending: isPendingUpdateAvatar } = useUpdateAvatar();
  const { mutate: updateFullNameMutation, isPending: isPendingUpdateFullName } = useUpdateFullName();
  const queryClient = useQueryClient();


  const [avatar, setAvatar] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isAvatarDirty, setIsAvatarDirty] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);
  const [disconnectProvider, setDisconnectProvider] = useState<string | null>(null);
  
  
  const {
    register: registerFullName,
    handleSubmit: handleSubmitFullName,
    formState: { errors: errorsFullName, isDirty: isDirtyFullName, isSubmitting: isSubmittingFullName },
    reset: resetFullName,
  } = useForm<UpdateFullNameFormValues>({
    resolver: zodResolver(updateFullNameSchema),
    defaultValues: {
      fullName: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const initials = useMemo(() => {
    return user?.fullName
      ?.split(" ")
      .map((n: string) => n[0]).slice(0, 2)
      .join("")
      .toUpperCase() ?? "";
  }, [user]);

  const onSubmitFullName = async (values: UpdateFullNameFormValues) => {
    updateFullNameMutation(values, {
      onSuccess: () => {
        resetFullName(values);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
      onError: (error) => {
        toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update full name');
      },
    });
  };

  const onSubmitPassword = async (values: UpdatePasswordFormValues) => {
    changePasswordMutation({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    },{
      onSuccess: () => {
        setIsChangePasswordDialogOpen(false);
      },
    });
  };

  const handleDisconnectClicked = (provider: string) => {
    setDisconnectProvider(provider);
    setIsDialogOpen(true);
  };

  const handleDisconnectConfirmed = async () => {
    try {
      if (disconnectProvider === 'google') {
        removeGoogleMutation();
        logoutMutation();
      } else if (disconnectProvider === 'password') {
        removePasswordMutation();
        logoutMutation();
      }
    } catch (error) {
      toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to disconnect provider');
    } finally {
      setIsDialogOpen(false);
    }
  };

  const handleChangePasswordClicked = () => {
    setIsChangePasswordDialogOpen(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setIsChangePasswordDialogOpen(false);
    resetPassword();
  };

  const handleChangePasswordDialogOpenChanged = (open: boolean) => {
    setIsChangePasswordDialogOpen(open);
    resetPassword();
  };

  const handleUploadSuccess = (url: string) => {
    setIsAvatarDirty(true);
    setAvatar(url);
  };

  const handleAvatarSave = () => {
    updateAvatarMutation({
      avatar: avatar,
    }, {
      onSuccess: () => {
        setIsAvatarDirty(false);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
      onError: (error) => {
        toast.error((error as any)?.response?.data?.message || (error as Error).message || 'Failed to update avatar');
      },
    });
  };

  const handleAvatarRemove = () => {
    setAvatar("");
    setIsAvatarDirty(true);
  };

  useEffect(() => {
    if (!user) return;

    resetFullName({
      fullName: user.fullName ?? "",
    });
    resetPassword({
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setAvatar(user.avatar ?? "");
  }, [user, resetFullName, resetPassword, setAvatar]);

  if (isLoading || isLoadingProviders) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>

        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />

        <Skeleton className="ml-auto h-6 w-[20%]" />
      </div>
    );
  }

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure?
            </DialogTitle>
            <DialogDescription>
              Once disconnected, you won't be able to use your {disconnectProvider === 'google' ? 'Google account' : 'password'} to access this account.
              <br />
              <strong>This action forces you to logout</strong>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisconnectConfirmed} disabled={isPendingRemovePassword || isPendingRemoveGoogle || isPendingLogout}>
              {isPendingRemovePassword || isPendingRemoveGoogle || isPendingLogout ? <Spinner /> : 'Disconnect'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isChangePasswordDialogOpen} onOpenChange={handleChangePasswordDialogOpenChanged}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Change Password
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input type="password" id="currentPassword" {...registerPassword("currentPassword")} />
            </div>
            {errorsPassword.currentPassword && (
              <p className="text-xs text-red-500">
                {errorsPassword.currentPassword.message}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input type="password" id="newPassword" {...registerPassword("newPassword")} />
            </div>
            {errorsPassword.newPassword && (
              <p className="text-xs text-red-500">
                {errorsPassword.newPassword.message}
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
              <Input type="password" id="confirmNewPassword" {...registerPassword("confirmNewPassword")} />
            </div>
            {errorsPassword.confirmNewPassword && (
              <p className="text-xs text-red-500">
                {errorsPassword.confirmNewPassword.message}
              </p>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" type="button" onClick={handleCloseChangePasswordDialog}>Cancel</Button>
              <Button type="submit" variant="default" disabled={isSubmittingPassword || isPendingChangePassword}>
                {isSubmittingPassword || isPendingChangePassword ? <Spinner /> : 'Save'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <UniversalUploader variant="popup" isOpen={isUploaderOpen} onClose={() => setIsUploaderOpen(false)} onUploadSuccess={handleUploadSuccess}/>
      <Card className="mt-2 w-full max-w-2xl rounded-md py-0">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="p-4">
                  <div className="flex justify-center gap-2">
                    <div className="flex flex-col justify-center items-center gap-2">
                      <div
                        onClick={() => setIsUploaderOpen(true)}
                        className="group relative size-24 overflow-hidden rounded-full border border-muted"
                      >
                      
                        <BaseAvatar
                          src={avatar}
                          alt="Avatar"
                          className="size-24 rounded-full"
                          fallbackInitials={initials}
                        />
                          

                        <div className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <span className="select-none px-1 text-center text-[10px] font-medium leading-tight text-white">
                            Change
                          </span>
                        </div>
                      </div>
                     
                        <div className="flex items-center justify-center">
                          {avatar && (
                            <Button type="button" variant="destructive" size='xs' className="min-w-[70px]" onClick={handleAvatarRemove}>Remove</Button>
                          )}
                          {isAvatarDirty && (
                            <Button type="button" variant="default" disabled={isPendingUpdateAvatar} size='xs' className="min-w-[70px]" onClick={handleAvatarSave}>
                              {isPendingUpdateAvatar ? <Spinner /> : 'Save'}
                            </Button>
                          )}
                        </div>
                  
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">
                    Full Name
                  </Label>
                </TableCell>

                <TableCell>
                  <form onSubmit={handleSubmitFullName(onSubmitFullName)}>
                    <InputGroup>
                      <InputGroupInput type="text" {...registerFullName("fullName")} />
                      <InputGroupAddon align="inline-end" className="min-w-16 flex items-center justify-end">
                        <div className="flex items-center justify-end gap-2 w-full">
                          {isDirtyFullName && <Button type="submit" variant='default' size='xs' disabled={isSubmittingFullName || isPendingUpdateFullName}>
                            {isSubmittingFullName || isPendingUpdateFullName ? <Spinner /> : 'Save'}
                          </Button>}
                        </div>
                      </InputGroupAddon>
                    </InputGroup>
                    {errorsFullName.fullName && (
                      <p className="text-xs text-red-500">
                        {errorsFullName.fullName.message}
                      </p>
                    )}
                  </form>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">
                    Email
                  </Label>
                </TableCell>
                
                <TableCell>
                    <InputGroup>
                      <InputGroupInput type="email" disabled value={user?.email ?? ""} />
                    </InputGroup>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="align-top">
                  <Label className="whitespace-nowrap mt-1.5">
                    Authentication
                  </Label>
                </TableCell>

                <TableCell className="flex flex-col gap-2">
                  {providers?.includes('google') && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        Google account <CircleCheck className="size-4 text-green-500" />
                      </span>
                      <Button type="button" variant="destructive" size='xs' onClick={() => handleDisconnectClicked('google')}>Disconnect</Button>
                    </div>
                  )}

                  {providers?.includes('password') && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        Password <CircleCheck className="size-4 text-green-500" />
                      </span>
                      <div className="flex items-center gap-2">
                        <Button type="button" variant="secondary" size='xs' onClick={handleChangePasswordClicked}>Change</Button>
                        <Button type="button" variant="destructive" size='xs' onClick={() => handleDisconnectClicked('password')}>Disconnect</Button>
                      </div>
                    </div>
                  )}

                </TableCell>
              </TableRow>
            </TableBody>    
          </Table>
      </Card>
    </>
  );
}