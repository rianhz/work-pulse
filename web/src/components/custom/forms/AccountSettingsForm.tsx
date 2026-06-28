"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditUserFormValues,
  editUserSchema,
} from "@/features/users/validator";
import { Card } from "@/components/ui/card";
import { useUpdateUser } from "@/features/users/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import BaseAvatar from "../images/BaseImage";
import { useQueryClient } from "@tanstack/react-query";
import { IUserWithProviders } from "@/app/settings/page";
import moment from "moment";
import { BaseDatePicker } from "../date-picker/BaseDatePicker";


export function AccountSettingsForm({ user, isLoading }: { user: IUserWithProviders, isLoading: boolean }) {
  const queryClient = useQueryClient();
  const { mutate: updateUserMutation, isPending: isPendingUpdateUser } = useUpdateUser();

  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  
  const {
    control,
    register: registerAccountSettings,
    handleSubmit: handleSubmitAccountSettings,
    setValue: setValueAccountSettings,
    getValues: getValuesAccountSettings,
    watch: watchAccountSettings,
    formState: { errors: errorsAccountSettings, isDirty: isAccountSettingsDirty, isSubmitting: isSubmittingAccountSettings },
    reset: resetAccountSettings,
    formState: { dirtyFields: dirtyFieldsAccountSettings },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: "",
      avatar: "",
      nickName: "",
      birthDate: null,
    },
  });

  const initials = useMemo(() => {
    return user?.fullName
      ?.split(" ")
      .map((n: string) => n[0]).slice(0, 2)
      .join("")
      .toUpperCase() ?? "";
  }, [user]);

  const avatar = watchAccountSettings("avatar");

  const handleUploadSuccess = (url: string) => {
    setValueAccountSettings("avatar", url, { shouldDirty: true });
  };

  const handleAvatarRemove = () => {
    setValueAccountSettings("avatar", "", { shouldDirty: true });
  };

  const onSubmitAccountSettings = (data: EditUserFormValues) => {
    const partialPayload: Record<string, any> = {};

    Object.keys(dirtyFieldsAccountSettings).forEach((key) => {
      if (key !== "_id") {
        partialPayload[key] = data[key as keyof typeof data];
      }
    });
    updateUserMutation({
      userId: user._id,
      payload: partialPayload,
    }, {
      onSuccess: () => {
        resetAccountSettings({
          fullName: data.fullName,
          avatar: data.avatar,
          nickName: data.nickName,
          birthDate: data.birthDate ? data.birthDate : null,
        });
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    });
  };

  useEffect(() => {
    if (!user) return;

    resetAccountSettings({
      fullName: user.fullName ?? "",
      avatar: user.avatar ?? "",
      nickName: user.nickName ?? "",
      birthDate: user.birthDate ? user.birthDate : null,
    });

  }, [user, resetAccountSettings]);


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
      <UniversalUploader variant="popup" isOpen={isUploaderOpen} onClose={() => setIsUploaderOpen(false)} onUploadSuccess={handleUploadSuccess}/>
      <Card className="w-full max-w-3xl rounded-md py-0">
        <form onSubmit={handleSubmitAccountSettings(onSubmitAccountSettings)}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <div
                          onClick={() => setIsUploaderOpen(true)}
                          className="group relative w-[100px] h-[100px] overflow-hidden rounded-full border border-muted"
                        >
                        
                          <BaseAvatar src={avatar ?? ""} alt="Avatar" className="w-[100px] h-[100px] rounded-full" imageLoading="eager" />
                          <div className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <span className="select-none px-1 text-center text-[10px] font-medium leading-tight text-white">
                              Change
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">Recommended size 100x100</p>
                        {avatar && (
                          <Button type="button" variant="destructive" size='xs' className="min-w-[70px] mt-2" onClick={handleAvatarRemove}>Remove</Button>
                        )}
                      </div>
                    </div>
                    {isAccountSettingsDirty && (
                      <div className="flex flex-col gap-2">
                        <Button type="submit" disabled={isPendingUpdateUser} onClick={() => onSubmitAccountSettings(getValuesAccountSettings())}>
                          {isPendingUpdateUser ? <Spinner /> : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => resetAccountSettings({
                          fullName: user?.fullName ?? "",
                          avatar: user?.avatar ?? "",
                          nickName: user?.nickName ?? "",
                          birthDate: user?.birthDate ?? null,
                          department: user?.department?.name ?? null,
                          position: user?.position ?? "",
                        })}>Cancel</Button>
                      </div>
                    )}
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
                    <InputGroup>
                      <InputGroupInput type="text" {...registerAccountSettings("fullName")} />
                    </InputGroup>
                    {errorsAccountSettings.fullName && (
                      <p className="text-xs text-red-500">
                        {errorsAccountSettings.fullName.message}
                      </p>
                    )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">
                    Nickname
                  </Label>
                </TableCell>
                <TableCell>
                    <InputGroup>
                      <InputGroupInput placeholder="What do you want to be called?" type="text" {...registerAccountSettings("nickName")} />
                    </InputGroup>
                    {errorsAccountSettings.nickName && (
                      <p className="text-xs text-red-500">
                        {errorsAccountSettings.nickName.message}
                      </p>
                    )}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">
                    Birth Date
                  </Label>
                </TableCell>
                <TableCell>
                    <Controller
                      control={control}
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
                    {errorsAccountSettings.birthDate && (
                      <p className="text-xs text-red-500">
                        {errorsAccountSettings.birthDate.message}
                      </p>
                    )}
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
                <TableCell>
                  <Label className="whitespace-nowrap">
                    Role
                  </Label>
                </TableCell>
                
                <TableCell>
                    <InputGroup>
                      <InputGroupInput type="text" disabled value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1).toLowerCase() || ""} />
                    </InputGroup>
                </TableCell>
              </TableRow>

              {user.department &&
                <TableRow>
                  <TableCell>
                    <Label className="whitespace-nowrap">
                      Department
                    </Label>
                  </TableCell>
                  <TableCell>
                      <InputGroup>
                        <InputGroupInput type="text" disabled value={user?.department?.name ?? ""} />
                      </InputGroup>
                  </TableCell>
                </TableRow>
              } 

              {user.position &&
                <TableRow>
                  <TableCell>
                    <Label className="whitespace-nowrap">
                      Position
                    </Label>
                  </TableCell>
                  <TableCell>
                      <InputGroup>
                        <InputGroupInput type="text" {...registerAccountSettings("position")} disabled />
                      </InputGroup>
                      {errorsAccountSettings.position && (
                        <p className="text-xs text-red-500">
                          {errorsAccountSettings.position.message}
                        </p>
                      )}
                  </TableCell>
                </TableRow>
              }
            </TableBody>    
          </Table>
        </form>
      </Card>
    </>
  );
}