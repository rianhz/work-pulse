"use client";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanySettingsFormValues, companySettingsSchema } from "@/features/tenants/validator";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import BaseAvatar from "../images/BaseImage";
import { ITenant } from "@/features/tenants/tenant";
import { useUpdateTenant } from "@/features/tenants/hooks";

export function CompanySettingsForm({ tenantId, tenant, isLoading }: { tenantId: string, tenant: ITenant, isLoading: boolean }) {
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: updateTenant, isPending: isPendingUpdateTenant } = useUpdateTenant();
 
  const tenantInitials = useMemo(() => {
    return tenant?.name.split(' ').map((name) => name[0]).join('').slice(0, 2).toUpperCase() || '';
  }, [tenant]);

  const { register: registerCompany, watch: watchCompany, setValue: setValueCompany, getValues: getValuesCompany, handleSubmit: handleSubmitCompany, formState: { errors: errorsCompany, isDirty: isDirtyCompany, isSubmitting: isSubmittingCompany }, reset: resetCompany } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(companySettingsSchema),
    defaultValues: {
      name: tenant?.name || '',
      slug: tenant?.slug || '',
      description: tenant?.description || '',
      logo: tenant?.logo || '',
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
        });
        queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
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
                        <div
                          onClick={() => setIsUploaderOpen(true)}
                          className="group relative w-[100px] h-[100px] overflow-hidden rounded-full border border-muted"
                        >
                        
                          <BaseAvatar src={logo ?? ""} alt="Logo" className="w-[100px] h-[100px] rounded-full" fallbackInitials={tenantInitials} imageLoading="eager" />
                          <div className="cursor-pointer absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <span className="select-none px-1 text-center text-[10px] font-medium leading-tight text-white">
                              Change
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Logo</p>
                        <p className="text-xs text-muted-foreground">Recommended size 100x100</p>
                        {logo && (
                          <Button type="button" variant="destructive" size='xs' className="min-w-[70px] mt-2" onClick={handleLogoRemove}>Remove</Button>
                        )}
                      </div>
                    </div>
                    {isDirtyCompany && (
                      <div className="flex flex-col gap-2">
                        <Button type="submit" disabled={isSubmittingCompany || isPendingUpdateTenant}>
                          {isSubmittingCompany || isPendingUpdateTenant ? <Spinner /> : 'Save Changes'}
                        </Button>
                        <Button type="button" variant="outline" className="min-w-[70px]" onClick={() => resetCompany({
                          name: tenant?.name ?? "",
                          slug: tenant?.slug ?? "",
                          description: tenant?.description ?? "",
                          logo: tenant?.logo ?? "",
                        })}>Cancel</Button>
                      </div>
                    )}
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
                      {errorsCompany.name && isDirtyCompany && <p className="text-xs text-red-500">{errorsCompany.name.message}</p>}
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
                      {errorsCompany.slug && isDirtyCompany && <p className="text-xs text-red-500">{errorsCompany.slug.message}</p>}
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
                  {errorsCompany.description && isDirtyCompany && <p className="text-xs text-red-500">{errorsCompany.description.message}</p>}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </form>
      </Card>
    </>
  )
}