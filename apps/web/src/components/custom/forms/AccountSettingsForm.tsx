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
import { editUserSchema } from "@/features/users/validator";
import { Card } from "@/components/ui/card";
import { useUpdateUser } from "@/features/users/hooks";
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
import { Activity } from "react";
import z from "zod";

export function AccountSettingsForm({ user, isLoading }: { user: IUserWithProviders, isLoading: boolean }) {
  const queryClient = useQueryClient();
  const { mutate: updateUserMutation, isPending: isPendingUpdateUser } = useUpdateUser();
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const accountSettingsSchema = useMemo(() => {
    return editUserSchema.pick({
      fullName: true,
      avatar: true,
      nickName: true,
      birthDate: true,
      timezone: true,
    });
  }, []);

  type AccountSettingsFormValues = z.infer<typeof accountSettingsSchema>;

  const defaultFormValues: AccountSettingsFormValues = useMemo(() => {
    return {
      fullName: user?.fullName ?? "",
      avatar: user?.avatar ?? "",
      nickName: user?.nickName ?? "",
      birthDate: user?.birthDate ? moment(user.birthDate).format("YYYY-MM-DD") : null,
      timezone: user?.timezone ?? "",
    };
  }, [user]);

  const {
    control,
    register: registerAccountSettings,
    handleSubmit: handleSubmitAccountSettings,
    setValue: setValueAccountSettings,
    watch: watchAccountSettings,
    formState: { errors: errorsAccountSettings, isDirty: isAccountSettingsDirty, dirtyFields: dirtyFieldsAccountSettings },
    reset: resetAccountSettings,
  } = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: defaultFormValues,
  });

  const avatar = watchAccountSettings("avatar");
  const initials = useMemo(() => {
    return user?.fullName?.charAt(0).toUpperCase();
  }, [user?.fullName]);
  
  const handleUploadSuccess = (url: string) => {
    setValueAccountSettings("avatar", url, { shouldDirty: true });
  };
  
  const handleAvatarRemove = () => {
    setValueAccountSettings("avatar", "", { shouldDirty: true });
  };
  
  const onSubmitAccountSettings = (data: AccountSettingsFormValues) => {
    const partialPayload: Record<string, any> = {};
    
    Object.keys(dirtyFieldsAccountSettings).forEach((key) => {
      partialPayload[key] = data[key as keyof AccountSettingsFormValues];
    });
    
    updateUserMutation({
      userId: user._id,
      payload: partialPayload,
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["me"] });
      },
    });
  };

  const handleResetForm = () => {
    const cleanValues: AccountSettingsFormValues = {
      fullName: user?.fullName ?? "",
      avatar: user?.avatar ?? "",
      nickName: user?.nickName ?? "",
      birthDate: user?.birthDate ? moment(user.birthDate).format("YYYY-MM-DD") : null,
      timezone: user?.timezone ?? "",
    };

    resetAccountSettings(cleanValues, {
      keepDefaultValues: false,
      keepValues: false,
      keepDirty: false,
      keepErrors: false,
      keepTouched: false,
      keepIsValid: false,
    });
  };

  useEffect(() => {
    if (user && !isAccountSettingsDirty) {
      handleResetForm();
    }
  }, [user]);
  
  useEffect(() => {
    if (user) {
      resetAccountSettings(defaultFormValues);
    }
  }, [user, resetAccountSettings, defaultFormValues]);

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
      <Card className="w-full max-w-3xl rounded-md py-4">
        <form onSubmit={handleSubmitAccountSettings(onSubmitAccountSettings)}>
          <Table>
            <TableBody>
              {/* Editable Field: Full Name */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4">
                  <Label className="whitespace-nowrap">Full Name</Label>
                </TableCell>
                <TableCell className="px-4">
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

              {/* Editable Field: Nickname */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4">
                  <Label className="whitespace-nowrap">Nickname</Label>
                </TableCell>
                <TableCell className="px-4">
                  <InputGroup>
                    <InputGroupInput 
                      placeholder="What do you want to be called?" 
                      type="text" 
                      {...registerAccountSettings("nickName")} 
                    />
                  </InputGroup>
                  <Activity mode={errorsAccountSettings.nickName ? "visible" : "hidden"}>
                    <p className="text-xs text-red-500">
                      {errorsAccountSettings.nickName?.message}
                    </p>
                  </Activity>
                </TableCell>
              </TableRow>

              {/* Editable Field: Birth Date */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4">
                  <Label className="whitespace-nowrap">Birth Date</Label>
                </TableCell>
                <TableCell className="px-4">
                  <Controller
                    control={control}
                    name="birthDate"
                    render={({ field }) => (
                      <BaseDatePicker
                        id="birthDate"
                        value={field.value ?? null}
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

              {/* Read-only Field: Email */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4">
                  <Label className="whitespace-nowrap">Email</Label>
                </TableCell>
                <TableCell className="px-4">
                  <InputGroup>
                    <InputGroupInput type="email" disabled value={user?.email ?? ""} />
                  </InputGroup>
                </TableCell>
              </TableRow>

              {/* Read-only Field: Role */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4">
                  <Label className="whitespace-nowrap">Role</Label>
                </TableCell>
                <TableCell className="px-4">
                  <InputGroup>
                    <InputGroupInput 
                      type="text" 
                      disabled 
                      value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : ""} 
                    />
                  </InputGroup>
                </TableCell>
              </TableRow>

              {/* Read-only Field: Department */}
              <Activity mode={user?.department ? "visible" : "hidden"}>
                <TableRow className="group hover:bg-popover border-0">
                  <TableCell className="px-4">
                    <Label className="whitespace-nowrap">Department</Label>
                  </TableCell>
                  <TableCell className="px-4">
                    <InputGroup>
                      <InputGroupInput type="text" disabled value={user?.department?.name ?? ""} />
                    </InputGroup>
                  </TableCell>
                </TableRow>
              </Activity> 

              {/* Read-only Field: Position */}
              <Activity mode={user?.position ? "visible" : "hidden"}>
                <TableRow className="group hover:bg-popover border-0">
                  <TableCell className="px-4">
                    <Label className="whitespace-nowrap">Position</Label>
                  </TableCell>
                  <TableCell className="px-4">
                    <InputGroup>
                      <InputGroupInput type="text" disabled value={user?.position ?? ""} />
                    </InputGroup>
                  </TableCell>
                </TableRow>
              </Activity>

              {/* Editable Field: Timezone */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4">
                  <Label className="whitespace-nowrap font-medium flex items-center gap-1">
                    Timezone
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <InfoIcon className="w-4 h-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Overrides the default company timezone. This ensures your check-in logs match your local time perfectly.</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                </TableCell>
                <TableCell className="px-4">
                  <Controller
                    control={control}
                    name="timezone"
                    render={({ field }) => (
                      <TimezoneDropdown value={field.value ?? ""} onChange={field.onChange} />
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-popover border-0">
                <TableCell colSpan={2} className="px-4">
                    <div className="flex justify-end items-center gap-2 h-8">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={!isAccountSettingsDirty}
                        onClick={handleResetForm}
                        className="min-w-[75px]"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        size="sm"
                        loading={isPendingUpdateUser} 
                        disabled={!isAccountSettingsDirty || isPendingUpdateUser}
                        className="min-w-[75px]"
                      >
                        Save
                      </Button>
                    </div>
                </TableCell>
              </TableRow>
            </TableBody>    
          </Table>
        </form>
      </Card>
    </>
  );
}