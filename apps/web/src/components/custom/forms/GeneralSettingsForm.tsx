"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity } from 'react';
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import BaseAvatar from "../images/BaseAvatar";
import { UniversalUploader } from "../uploader/ImageUploader";
import { TimezoneDropdown } from "../dropdown/TimezoneDropdown";

const generalSettingsSchema = z.object({
  branding: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
  }),
  timezone: z.string().min(1, 'Please select a timezone'),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

interface GeneralSettingsFormProps {
  initialData?: {
    branding?: {
      name?: string;
      description?: string | null;
      logo?: string | null;
    };
    timezone?: string;
  };
  onSubmit?: (data: GeneralSettingsFormValues) => void;
  isLoading?: boolean;
}

export function GeneralSettingsForm({ initialData, onSubmit, isLoading }: GeneralSettingsFormProps) {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);

  const tenantInitials = useMemo(() => {
    return initialData?.branding?.name?.charAt(0).toUpperCase() || '';
  }, [initialData?.branding?.name]);

  const {
    control,
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      branding: {
        name: initialData?.branding?.name || '',
        description: initialData?.branding?.description || '',
        logo: initialData?.branding?.logo || '',
      },
      timezone: initialData?.timezone || '',
    },
  });

  const logo = watch('branding.logo');

  const handleUploadSuccess = (url: string) => {
    setValue('branding.logo', url, { shouldDirty: true });
  };

  const handleLogoRemove = () => {
    setValue('branding.logo', '', { shouldDirty: true });
  };

  const handleFormSubmit = (data: GeneralSettingsFormValues) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  useEffect(() => {
    if (!initialData) return;
    reset({
      branding: {
        name: initialData?.branding?.name || '',
        description: initialData?.branding?.description || '',
        logo: initialData?.branding?.logo || '',
      },
      timezone: initialData?.timezone || '',
    });
  }, [initialData, reset]);

  return (
    <>
      <UniversalUploader
        variant="popup"
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
      <Card className="w-full max-w-3xl py-4 rounded-md">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Table>
            <TableBody>
              <TableRow className="hover:bg-popover border-0">
                <TableCell colSpan={2} className="px-4">
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col justify-center items-center gap-2">
                        <BaseAvatar
                          src={logo ?? ''}
                          alt="Logo"
                          fallbackInitials={tenantInitials}
                          imageLoading="eager"
                          isEditable={true}
                          onUploadSuccess={handleUploadSuccess}
                          className="w-[100px] h-[100px] rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Logo</p>
                        <p className="text-xs text-muted-foreground">Recommended size 100x100</p>
                        <Activity mode={logo ? 'visible' : 'hidden'}>
                          <Button
                            type="button"
                            variant="destructive"
                            size="xs"
                            className="min-w-[70px] mt-2"
                            onClick={handleLogoRemove}
                          >
                            Remove
                          </Button>
                        </Activity>
                      </div>
                    </div>
                  </div>
                </TableCell>
              </TableRow>

              {/* Name Row */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4 group-hover:bg-popover">
                  <Label className="whitespace-nowrap">Organization Name</Label>
                </TableCell>
                <TableCell className="w-full px-4 group-hover:bg-popover">
                  <div className="flex flex-col">
                    <InputGroup>
                      <InputGroupInput
                        type="text"
                        id="branding.name"
                        placeholder="Organization Name"
                        {...register('branding.name')}
                      />
                    </InputGroup>
                    <Activity mode={errors.branding?.name && isDirty ? 'visible' : 'hidden'}>
                      <p className="text-xs text-red-500 mt-1">{errors.branding?.name?.message}</p>
                    </Activity>
                  </div>
                </TableCell>
              </TableRow>

              {/* Description Row */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="align-top px-4 group-hover:bg-popover">
                  <Label className="whitespace-nowrap">Description</Label>
                </TableCell>
                <TableCell className="w-full px-4 group-hover:bg-popover">
                  <div className="flex flex-col gap-2 h-full justify-start align-start">
                    <InputGroup className="relative">
                      <InputGroupTextarea
                        id="branding.description"
                        placeholder="Short description of your organization..."
                        {...register('branding.description')}
                      />
                    </InputGroup>
                  </div>
                  <Activity mode={errors.branding?.description && isDirty ? 'visible' : 'hidden'}>
                    <p className="text-xs text-red-500 mt-1">{errors.branding?.description?.message}</p>
                  </Activity>
                </TableCell>
              </TableRow>

              {/* Timezone Row */}
              <TableRow className="group hover:bg-popover border-0">
                <TableCell className="px-4 group-hover:bg-popover">
                  <Label className="whitespace-nowrap">Timezone</Label>
                </TableCell>
                <TableCell className="w-full px-4 group-hover:bg-popover">
                  <Controller
                    control={control}
                    name="timezone"
                    render={({ field }) => (
                      <TimezoneDropdown value={field.value ?? ''} onChange={field.onChange} />
                    )}
                  />
                  <Activity mode={errors.timezone && isDirty ? 'visible' : 'hidden'}>
                    <p className="text-xs text-red-500 mt-1">{errors.timezone?.message}</p>
                  </Activity>
                </TableCell>
              </TableRow>

              <TableRow className="hover:bg-popover border-0">
                <TableCell colSpan={2} className="px-4">
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!isDirty}
                      onClick={() =>
                        reset({
                          branding: {
                            name: initialData?.branding?.name || '',
                            description: initialData?.branding?.description || '',
                            logo: initialData?.branding?.logo || '',
                          },
                          timezone: initialData?.timezone || '',
                        })
                      }
                      className="min-w-[75px]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      loading={isSubmitting || isLoading}
                      disabled={!isDirty || isSubmitting || isLoading}
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