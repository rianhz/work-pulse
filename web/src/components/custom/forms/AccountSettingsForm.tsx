"use client";

import { Activity, useEffect, useMemo, useState } from "react";
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
import { useGetMe, useUpdateUser } from "@/features/users/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import BaseAvatar from "../images/BaseAvatar";
import { useQueryClient } from "@tanstack/react-query";
import { IUserWithProviders } from "@/app/settings/page";
import moment from "moment";
import { BaseDatePicker } from "../date-picker/BaseDatePicker";
import { TimezoneDropdown } from "../dropdown/TimezoneDropdown";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";


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
    formState: { errors: errorsAccountSettings, isDirty: isAccountSettingsDirty },
    reset: resetAccountSettings,
    formState: { dirtyFields: dirtyFieldsAccountSettings },
  } = useForm<EditUserFormValues>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      fullName: "",
      avatar: "",
      nickName: "",
      birthDate: null,
      timezone: "",
    },
  });

  const avatar = watchAccountSettings("avatar");
  const initials = useMemo(() => {
    return user.fullName?.split(" ").map((name) => name[0]).join("");
  }, [user.fullName]);

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
          timezone: data.timezone ?? "",
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
      timezone: user.timezone ?? "",
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

                        <BaseAvatar 
                          src={avatar ?? ""} 
                          alt="Avatar" 
                          fallbackInitials={initials} 
                          imageLoading="eager"
                          isEditable={true}
                          onUploadSuccess={handleUploadSuccess}
                          className="w-[100px] h-[100px] rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">Recommended size 100x100</p>
                        <Activity mode={avatar ? "visible" : "hidden"}>
                          <Button type="button" variant="destructive" size='xs' className="min-w-[70px] mt-2" onClick={handleAvatarRemove}>Remove</Button>
                        </Activity>
                      </div>
                    </div>
                    <Activity mode={isAccountSettingsDirty ? "visible" : "hidden"}>
                      <div className="flex flex-col gap-2">
                        <Button type="submit" loading={isPendingUpdateUser} disabled={isPendingUpdateUser} onClick={() => onSubmitAccountSettings(getValuesAccountSettings())}>
                          Save Changes
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
                    </Activity>
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
                    <Activity mode={errorsAccountSettings.fullName ? "visible" : "hidden"}>
                      <p className="text-xs text-red-500">
                        {errorsAccountSettings.fullName?.message}
                      </p>
                    </Activity>
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
                    <Activity mode={errorsAccountSettings.nickName ? "visible" : "hidden"}>
                      <p className="text-xs text-red-500">
                        {errorsAccountSettings.nickName?.message}
                      </p>
                    </Activity>
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
                          id="birthDate"
                          value={field.value}
                          onChange={(date) => {
                            field.onChange(date ? moment(date).format("YYYY-MM-DD") : null);
                          }}
                          placeholder="Select date"
                        />
                      )}
                    />
                    <Activity mode={errorsAccountSettings.birthDate ? "visible" : "hidden"}>
                      <p className="text-xs text-red-500">
                        {errorsAccountSettings.birthDate?.message}
                      </p>
                    </Activity>
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

              <Activity mode={user.department ? "visible" : "hidden"}>
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
              </Activity> 

              <Activity mode={user.position ? "visible" : "hidden"}>
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
                      <Activity mode={errorsAccountSettings.position ? "visible" : "hidden"}>
                        <p className="text-xs text-red-500">
                          {errorsAccountSettings.position?.message}
                        </p>
                      </Activity>
                  </TableCell>
                </TableRow>
              </Activity>

              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">
                    Timezone
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Overrides the default company timezone. This ensures your check-in logs match your local time perfectly.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </TableCell>
                <TableCell>
                  <Controller
                    control={control}
                    name="timezone"
                    render={({ field }) => (
                      <TimezoneDropdown value={field.value ?? ""} onChange={field.onChange} />
                    )}
                  />
                </TableCell>
              </TableRow>
            </TableBody>    
          </Table>
        </form>
      </Card>
    </>
  );
}