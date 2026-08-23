"use client";
import { AccountSettingsForm } from "@/components/custom/forms/AccountSettingsForm";
import { CompanySettingsForm } from "@/components/custom/forms/CompanySettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { BillingPlansSettingsForm } from "@/components/custom/forms/BillingPlansSettingsForm";
import { ITenant } from "@/features/tenants/tenant";
import { ErrorMessage } from "@/components/custom/errors-and-empty/ErrorsMessage";
import { IUser } from "@/features/users/users";
import { useGetMe, useGetMeProviders } from "@/features/users/hooks";
import { SecurityUserSettingsForm } from "@/components/custom/forms/SecurityUserSettingsForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { DepartmentSettingsForm } from "@/components/custom/forms/DepartmentSettingsForm";
import { useAppSelector } from "@/store/hooks/hooks";
import { NotAuthorised } from "@/components/custom/errors-and-empty/NotAuthorised";
import { useQueryClient } from "@tanstack/react-query";
import { GeneralSettingsForm } from "@/components/custom/forms/GeneralSettingsForm";
import { BillingAndPlanSettingsForm } from "@/components/custom/forms/BillingAndPlanSettingsForm";
import { LeavePolicyForm } from "@/components/custom/forms/LeavePolicyForm";
import { useGetTenantSettings } from "@/features/tenants-settings/hooks";
import { isModerator } from "@/helpers/users-helper";
import { useMemo } from "react";

export interface IUserWithProviders extends IUser {
  providers: ('password' | 'google')[];
}

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const currentUserRole = useAppSelector((state: RootState) => state.currentUser.user?.role);
  const allowedCompanyTabAccess = currentUserRole === "admin" || currentUserRole === "owner";

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "account";

  const isMobile = useIsMobile();

  // 1. CALL ALL HOOKS UNCONDITIONALLY AT THE TOP
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: errorUser, 
    isError: isErrorUser 
  } = useGetMe();

  const { 
    data: providers, 
    isLoading: isLoadingProviders, 
    error: errorProviders, 
    isError: isErrorProviders 
  } = useGetMeProviders();

  const tenantId = useSelector((state: RootState) => state.currentUser.user?.tenantId);
  const tenant = useSelector((state: RootState) => state.currentTenant.tenant);

  const { data: tenantSettings, isLoading: isLoadingTenantSettings, error: errorTenantSettings, isError: isErrorTenantSettings } = useGetTenantSettings(tenantId, isModerator(currentUserRole as string));
  console.log(tenantSettings);
  const initialData = useMemo(() => {
    return {
      branding: tenantSettings?.branding,
      timezone: tenantSettings?.timezone,
      billing: tenantSettings?.billing,
    };
  }, [tenantSettings]);

  console.log(initialData);
  const handleUpdatedTenant = () => {
    queryClient.invalidateQueries({ queryKey: ['me'] });
  };

  if (isErrorUser) {
    return (
      <ErrorMessage 
        title={(errorUser as any)?.response?.data?.message || (errorUser as Error).message || 'Failed to get user'} 
      />
    );
  }

  if (isErrorProviders) {
    return (
      <ErrorMessage 
        title={(errorProviders as any)?.response?.data?.message || (errorProviders as Error).message || 'Failed to get providers'} 
      />
    );
  }

  return (
    <Tabs value={tab} className="w-full">
      <TabsList>
        <TabsTrigger onClick={() => router.push("/settings?tab=account")} value="account">Account</TabsTrigger>
        {allowedCompanyTabAccess && (
          <TabsTrigger onClick={() => router.push("/settings?tab=company")} value="company">Company</TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="account">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
        <Tabs defaultValue="general" orientation={isMobile ? "horizontal" : "vertical"} className="mt-4">
          <TabsList className="bg-transparent px-0! pt-0! gap-1">
            <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent hover:text-muted-foreground p-2! min-w-[150px] data-active:bg-sidebar-accent" value="general">General</TabsTrigger>
            <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent hover:text-muted-foreground p-2! min-w-[150px] data-active:bg-sidebar-accent" value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="general">
            <AccountSettingsForm user={{ ...user, providers }} isLoading={isLoadingUser || isLoadingProviders} />
          </TabsContent>
          <TabsContent value="security">
            <SecurityUserSettingsForm user={{ ...user, providers }} isLoading={isLoadingUser || isLoadingProviders} />
          </TabsContent>
        </Tabs>
      </TabsContent>
      <TabsContent value="company">
        {!allowedCompanyTabAccess && tab === "company" && (
          <NotAuthorised />
        )}
        {allowedCompanyTabAccess && tab === "company" && (
          <>
            <h1 className="text-2xl font-bold">Organization Settings</h1>
            <p className="text-sm text-muted-foreground">Manage your organization's identity, team permissions, and cloud integrations.</p>
            <Tabs defaultValue="general" orientation={isMobile ? "horizontal" : "vertical"} className="mt-4">
              <TabsList className="bg-transparent px-0! pt-0! gap-1">
                <TabsTrigger className="rounded-sm data-active:bg-sidebar-accent hover:bg-sidebar-accent hover:text-muted-foreground p-2! min-w-[150px]" value="general">General</TabsTrigger>
                <TabsTrigger className="rounded-sm data-active:bg-sidebar-accent hover:bg-sidebar-accent hover:text-muted-foreground p-2! min-w-[150px]" value="departments">Departments</TabsTrigger>
                <TabsTrigger className="rounded-sm data-active:bg-sidebar-accent hover:bg-sidebar-accent hover:text-muted-foreground p-2! min-w-[150px]" value="billing">Billing & Plans</TabsTrigger>
                <TabsTrigger className="rounded-sm data-active:bg-sidebar-accent hover:bg-sidebar-accent hover:text-muted-foreground p-2! min-w-[150px]" value="policies">Policies</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <GeneralSettingsForm initialData={initialData} />
              </TabsContent>
              <TabsContent value="departments">
                <DepartmentSettingsForm />
              </TabsContent>
              <TabsContent value="policies">
                <LeavePolicyForm />
              </TabsContent>
              <TabsContent value="billing">
                <BillingAndPlanSettingsForm initialData={initialData} />
              </TabsContent>
         
            </Tabs>
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}