"use client";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySettingsFormValues, companySettingsSchema } from "@/features/tenants/validator";
import { Button } from "@/components/ui/button";
import { Activity, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import BaseAvatar from "../images/BaseAvatar";
import { ITenant } from "@/features/tenants/tenant";
import { useUpdateTenant } from "@/features/tenants/hooks";
import { TimezoneDropdown } from "../dropdown/TimezoneDropdown";

export function CompanySettingsForm({ tenantId, tenant, isLoading, onSaved }: { tenantId: string, tenant: ITenant, isLoading: boolean, onSaved: () => void }) {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const { mutate: updateTenant, isPending: isPendingUpdateTenant } = useUpdateTenant();
  const tenantInitials = useMemo(() => {
    return tenant?.name?.charAt(0).toUpperCase() || '';
  }, [tenant]);

  const { control: controlCompany, register: registerCompany, watch: watchCompany, setValue: setValueCompany, handleSubmit: handleSubmitCompany, formState: { errors: errorsCompany, isDirty: isDirtyCompany, isSubmitting: isSubmittingCompany }, reset: resetCompany } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: tenant?.name || '',
      slug: tenant?.slug || '',
      description: tenant?.description || '',
      logo: tenant?.logo || '',
      timezone: tenant?.timezone || '',
    },
  });

  const handleUploadSucess = (url: string) => {
    setValueCompany('logo', url, { shouldDirty: true });
  };

  const logo = watchCompany('logo');

  const handleLogoRemove = () => {
    setValueCompany('logo', '', { shouldDirty: true });
  };

  const onSubmitCompanySettings = (data: CompanySettingsFormValues) => {
    updateTenant({
      id: tenantId || '',
      payload: data,
    }, {
      onSuccess: () => {
        resetCompany({
          name: data.name,
          slug: data.slug,
          description: data.description,
          logo: data.logo,
          timezone: data.timezone,
        });
        onSaved();
      },
    });
  };

  useEffect(() => {
    if (!tenant) return;
      resetCompany({
        name: tenant?.name || '',
        slug: tenant?.slug || '',
        description: tenant?.description || '',
        logo: tenant?.logo || '',
        timezone: tenant?.timezone || '',
      });
  }, [tenant, resetCompany]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full gap-2 px-2">
        <div className="flex items-center gap-2">
          <Skeleton className="w-1/4 h-6" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />
        <Skeleton className="w-full h-6" />

        <Skeleton className="w-[20%] h-6 ml-auto" />
      </div>
    )
  }

  return (
    <>
      <UniversalUploader variant="popup" isOpen={isUploaderOpen} onClose={() => setIsUploaderOpen(false)} onUploadSuccess={handleUploadSucess} />
      <Card className="w-full max-w-3xl py-0 rounded-md">
        <form onSubmit={handleSubmitCompany(onSubmitCompanySettings)}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2}>
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col justify-center items-center gap-2">
                       <BaseAvatar 
                          src={logo ?? ""} 
                          alt="Logo" 
                          fallbackInitials={tenantInitials} 
                          imageLoading="eager"
                          isEditable={true}
                          onUploadSuccess={handleUploadSucess}
                          className="w-[100px] h-[100px] rounded-full"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Logo</p>
                        <p className="text-xs text-muted-foreground">Recommended size 100x100</p>
                        <Activity mode={logo ? "visible" : "hidden"}>
                          <Button type="button" variant="destructive" size='xs' className="min-w-[70px] mt-2" onClick={handleLogoRemove}>Remove</Button>
                        </Activity>
                      </div>
                    </div>
                    <Activity mode={isDirtyCompany ? "visible" : "hidden"}>
                      <div className="flex flex-col gap-2">
                        <Button type="submit" loading={isSubmittingCompany || isPendingUpdateTenant} disabled={isSubmittingCompany || isPendingUpdateTenant}>
                          Save Changes
                        </Button>
                        <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => resetCompany({
                          name: tenant?.name ?? "",
                          slug: tenant?.slug ?? "",
                          description: tenant?.description ?? "",
                          logo: tenant?.logo ?? "",
                        })}>Cancel</Button>
                      </div>
                    </Activity>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">Name</Label>
                </TableCell>
                <TableCell className="w-full">
                    <div className="flex flex-col">
                      <InputGroup>
                        <InputGroupInput type="text" id="name" placeholder="Name" {...registerCompany("name")} />
                      </InputGroup>
                      <Activity mode={errorsCompany.name && isDirtyCompany ? "visible" : "hidden"}>
                        <p className="text-xs text-red-500">{errorsCompany.name?.message}</p>
                      </Activity>
                    </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">Slug</Label>
                </TableCell>
                <TableCell className="w-full">
                    <div className="flex flex-col">
                      <InputGroup>
                        <InputGroupInput type="text" id="slug" placeholder="Slug" {...registerCompany("slug")} />
                      </InputGroup>
                      <Activity mode={errorsCompany.slug && isDirtyCompany ? "visible" : "hidden"}>
                        <p className="text-xs text-red-500">{errorsCompany.slug?.message}</p>
                      </Activity>
                    </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <Label className="whitespace-nowrap">Description</Label>
                </TableCell>
                <TableCell className="w-full">
                  <div className="flex flex-col gap-2 h-full justify-start align-start">
                    <InputGroup className="relative">
                      <InputGroupTextarea
                        id="description"
                        placeholder="Tell us about your company"
                        {...registerCompany("description")}
                      />
                    </InputGroup>
                  </div>
                  <Activity mode={errorsCompany.description && isDirtyCompany ? "visible" : "hidden"}>
                    <p className="text-xs text-red-500">{errorsCompany.description?.message}</p>
                  </Activity>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">Timezone</Label>
                </TableCell>
                <TableCell className="w-full">
                  <Controller
                    control={controlCompany}
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
  )
}