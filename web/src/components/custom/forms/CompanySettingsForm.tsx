"use client";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyDescriptionFormValues, companyDescriptionSchema, CompanyNameFormValues, companyNameSchema, CompanySlugFormValues, companySlugSchema } from "@/features/tenants/validator";
import { Button } from "@/components/ui/button";
import { useGetTenantById, useUpdateTenant } from "@/features/tenants/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleCheck, CircleQuestionMark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { UniversalUploader } from "../uploader/ImageUploader";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupTextarea } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { useQueryClient } from "@tanstack/react-query";
import BaseAvatar from "../images/BaseImage";

export function CompanySettingsForm() {
  const tenantId = useSelector((state: RootState) => state.currentUser.user?.tenantId);
  const { mutate: updateTenant, isPending: isPendingUpdateTenant } = useUpdateTenant();
  const { data: tenant, isLoading } = useGetTenantById(tenantId);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const queryClient = useQueryClient();

  const [logo, setLogo] = useState('');
  const [isLogoDirty, setIsLogoDirty] = useState(false);
 
  const tenantInitials = useMemo(() => {
    return tenant?.name.split(' ').map((name) => name[0]).join('').slice(0, 2).toUpperCase() || '';
  }, [tenant]);

  const { register: registerName, handleSubmit: handleSubmitName, formState: { errors: errorsName, isDirty: isDirtyName, isSubmitting: isSubmittingName }, setValue: setValueName, reset: resetName } = useForm<CompanyNameFormValues>({
    resolver: zodResolver(companyNameSchema),
    defaultValues: {
      name: '',
    },
  });
  const { register: registerSlug, handleSubmit: handleSubmitSlug, formState: { errors: errorsSlug, isDirty: isDirtySlug, isSubmitting: isSubmittingSlug }, setValue: setValueSlug, reset: resetSlug } = useForm<CompanySlugFormValues>({
    resolver: zodResolver(companySlugSchema),
    defaultValues: {
      slug: '',
    },
  });
  const { register: registerDescription, handleSubmit: handleSubmitDescription, formState: { errors: errorsDescription, isDirty: isDirtyDescription, isSubmitting: isSubmittingDescription }, setValue: setValueDescription, reset: resetDescription } = useForm<CompanyDescriptionFormValues>({
    resolver: zodResolver(companyDescriptionSchema),
    defaultValues: {
      description: '',
    },
  });


  const onSubmitName = (values: CompanyNameFormValues) => {
    updateTenant({ id: tenantId || '', payload: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
        },
      }
    );
  };

  const onSubmitSlug = (values: CompanySlugFormValues) => {
    updateTenant({ id: tenantId || '', payload: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
        },
      }
    );
  };

  const onSubmitDescription = (values: CompanyDescriptionFormValues) => {
    updateTenant({ id: tenantId || '', payload: values },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] });
        },
      }
    );
  };

  const handleUploadSucess = (url: string) => {
    setLogo(url);
    setIsLogoDirty(true);
  };

  const handleLogoSave = () => {
    updateTenant({ id: tenantId || '', payload: { logo: logo } });
  };

  const handleLogoRemove = () => {
    setLogo('');
    setIsLogoDirty(true);
  };

  useEffect(() => {
    if (tenant) {
      resetName({
        name: tenant.name || '',
      });
      resetSlug({
        slug: tenant.slug || '',
      });
      resetDescription({
        description: tenant.description || '',
      });
      setLogo(tenant.logo ?? '');
    }
  }, [tenant, resetName, resetSlug, resetDescription, setLogo]);

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
      <Card className="w-full max-w-2xl py-0 rounded-md mt-2">
        
          <Table>
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} className="p-4">
                  <div className="flex flex-col items-center justify-center w-full gap-2">
                    <div 
                      className="group relative size-24 cursor-pointer overflow-hidden rounded-full border border-muted"
                      onClick={() => setIsUploaderOpen(true)}
                    >
                      <BaseAvatar
                        src={logo}
                        alt="Logo"
                        className="size-24 rounded-full"
                        fallbackInitials={tenantInitials}
                      />

                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <span className="text-[10px] font-medium text-white text-center leading-tight px-1 select-none">
                          Change<br />logo
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {logo && (
                        <Button type="button" variant="destructive" size='xs' className="min-w-[70px]" onClick={handleLogoRemove}>Remove</Button>
                      )}
                      {isLogoDirty && (
                        <Button type="button" variant='default' size='xs' className="min-w-[70px]" onClick={handleLogoSave} disabled={isPendingUpdateTenant}>{isPendingUpdateTenant ? <Spinner /> : 'Save'}</Button>
                      )}
                    </div>

                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <Label className="whitespace-nowrap">Name</Label>
                </TableCell>
                <TableCell>
                  <form onSubmit={handleSubmitName(onSubmitName)}>
                    <div className="flex flex-col">
                      <InputGroup>
                        <InputGroupInput type="text" id="name" placeholder="Name" {...registerName("name")} />
                        <InputGroupAddon align="inline-end" className="min-w-16 flex items-center justify-end">
                          {isDirtyName && <Button type="submit" variant='default' size='xs' disabled={isSubmittingName || isPendingUpdateTenant}>{isPendingUpdateTenant ? <Spinner /> : 'Save'}</Button>}
                        </InputGroupAddon>
                      </InputGroup>
                      {errorsName.name && isDirtyName && <p className="text-xs text-red-500">{errorsName.name.message}</p>}
                    </div>
                  </form>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <Label className="whitespace-nowrap">Slug</Label>
                </TableCell>
                <TableCell>
                  <form onSubmit={handleSubmitSlug(onSubmitSlug)}>
                    <div className="flex flex-col">
                      <InputGroup>
                        <InputGroupInput type="text" id="slug" placeholder="Slug" {...registerSlug("slug")} />
                        <InputGroupAddon align="inline-end" className="min-w-16 flex items-center justify-end">
                          {isDirtySlug && <Button type="submit" variant='default' size='xs' disabled={isSubmittingSlug || isPendingUpdateTenant}>Save</Button>}
                          {isSubmittingSlug && <Spinner />}
                        </InputGroupAddon>
                      </InputGroup>
                      {errorsSlug.slug && isDirtySlug && <p className="text-xs text-red-500">{errorsSlug.slug.message}</p>}
                    </div>
                  </form>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top">
                  <Label className="whitespace-nowrap">Description</Label>
                </TableCell>
                <TableCell>
                  <form onSubmit={handleSubmitDescription(onSubmitDescription)}>
                    <div className="flex flex-col gap-2 h-full justify-start align-start">
                      <InputGroup className="relative">
                        <InputGroupTextarea
                          id="description"
                          placeholder="Tell us about your company"
                          {...registerDescription("description")}
                        />
                        <div className="flex items-center justify-end gap-2 w-full absolute bottom-2 right-2">
                          {isDirtyDescription && <Button type="submit" variant='default' size='xs' disabled={isSubmittingDescription || isPendingUpdateTenant}>Save</Button>}
                          {isSubmittingDescription && <Spinner />}
                        </div>
                      </InputGroup>
                    </div>
                    {errorsDescription.description && isDirtyDescription && <p className="text-xs text-red-500">{errorsDescription.description.message}</p>}
                  </form>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">Status</Label>
                </TableCell>
                <TableCell>
                  <Label className="capitalize">{tenant?.status} <CircleCheck className="size-4 text-green-500 bg-green-500/10" /></Label>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <Label className="whitespace-nowrap">Plan</Label>
                </TableCell>
                <TableCell className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Label className="capitalize">{tenant?.plan}</Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                          <CircleQuestionMark className="size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        This is the plan that currently your tenant is on.
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Button variant="secondary" size="sm">Change</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
      </Card>
    </>
  )
}