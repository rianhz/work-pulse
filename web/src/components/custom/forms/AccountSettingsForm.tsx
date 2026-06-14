"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateEmailFormValues,
  UpdateFullNameFormValues,
  updateFullNameSchema,
  UpdatePasswordFormValues,
  updatePasswordSchema,
  updateEmailSchema,
} from "@/features/users/validator";
import { Card } from "@/components/ui/card";
import { useGetMe } from "@/features/users/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

export function AccountSettingsForm() {
  const { data: user, isLoading } = useGetMe();
  const [avatar, setAvatar] = useState("");
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

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
    register: registerEmail,
    reset: resetEmail,
  } = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword, isDirty: isDirtyPassword, isSubmitting: isSubmittingPassword },
    reset: resetPassword,
  } = useForm<UpdatePasswordFormValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: "",
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

  const handleUploadSuccess = (url: string) => {
    setAvatar(url);
  };

  const onSubmitFullName = async (values: UpdateFullNameFormValues) => {
    console.log(values);

    // await updateProfile(values)
  };


  const onSubmitPassword = async (values: UpdatePasswordFormValues) => {
    console.log(values);

    // await updatePassword(values)
  };

  useEffect(() => {
    if (!user) return;

    resetFullName({
      fullName: user.fullName ?? "",
    });
    resetEmail({
      email: user.email ?? "",
    });
    resetPassword({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });

    setAvatar(user.avatar ?? "");
  }, [user, resetFullName, resetPassword, setAvatar]);

  if (isLoading) {
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
      <UniversalUploader
        variant="popup"
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <Card className="mt-2 w-full max-w-2xl rounded-md py-0">
        
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="p-4">
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setIsUploaderOpen(true)}
                      className="group relative size-24 overflow-hidden rounded-full border border-muted"
                    >
                      <Avatar className="size-24">
                        <AvatarImage src={avatar} />

                        <AvatarFallback className="text-4xl font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <span className="select-none px-1 text-center text-[10px] font-medium leading-tight text-white">
                          Change
                        </span>
                      </div>
                    </button>
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
                          {isDirtyFullName && <Button type="submit" variant='default' size='xs' disabled={isSubmittingFullName}>Save</Button>}
                          {isSubmittingFullName && <Spinner />}
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
                      <InputGroupInput type="email" disabled {...registerEmail("email")} />
                    </InputGroup>
            
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="align-top">
                  <Label className="whitespace-nowrap">
                    Password
                  </Label>
                </TableCell>

                <TableCell className="flex flex-col gap-2">
                  <div>
                    <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="flex flex-col gap-2">
                      <div className="flex flex-col">
                        <InputGroup>
                          <InputGroupInput type="password" placeholder="Old Password" autoComplete="new-password" {...registerPassword("oldPassword")} />
                        </InputGroup>
                        {errorsPassword.oldPassword && isDirtyPassword && (
                          <p className="text-xs text-red-500">
                            {errorsPassword.oldPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <InputGroup>
                          <InputGroupInput type="password" placeholder="New Password" autoComplete="new-password" {...registerPassword("newPassword")} />
                        </InputGroup>
                        {errorsPassword.newPassword && isDirtyPassword && (
                          <p className="text-xs text-red-500">
                            {errorsPassword.newPassword.message}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <InputGroup>
                          <InputGroupInput type="password" placeholder="Confirm New Password" autoComplete="new-password" {...registerPassword("confirmNewPassword")} />
                        </InputGroup>
                        {errorsPassword.confirmNewPassword && isDirtyPassword && (
                          <p className="text-xs text-red-500">
                            {errorsPassword.confirmNewPassword.message}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end gap-2 w-full">
                        {isDirtyPassword && <Button type="submit" variant='default' size='xs' disabled={isSubmittingPassword}>Save</Button>}
                        {isSubmittingPassword && <Spinner />}
                      </div>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>

            
          </Table>
      </Card>
    </>
  );
}