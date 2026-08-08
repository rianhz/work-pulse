"use client";
import { AccountSettingsForm } from "@/components/custom/forms/AccountSettingsForm";
import { CompanySettingsForm } from "@/components/custom/forms/CompanySettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetTenantById } from "@/features/tenants/hooks";
import { useDispatch, useSelector } from "react-redux";
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


  const { data: user, isLoading: isLoadingUser, error: errorUser, isError: isErrorUser } = useGetMe();
  if(isErrorUser) {
    return <ErrorMessage title={(errorUser as any)?.response?.data?.message || (errorUser as Error).message || 'Failed to get user'} />
  }

  const { data: providers, isLoading: isLoadingProviders, error: errorProviders, isError: isErrorProviders } = useGetMeProviders();
  if(isErrorProviders) {
    return <ErrorMessage title={(errorProviders as any)?.response?.data?.message || (errorProviders as Error).message || 'Failed to get providers'} />
  }

  const tenantId = useSelector((state: RootState) => (state as RootState).currentUser.user?.tenantId);
  const tenant = useSelector((state: RootState) => (state as RootState).currentTenant.tenant);
 
  const handleUpdatedTenant = () => {
    queryClient.invalidateQueries({ queryKey: ['me'] });
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
          <TabsList className="bg-transparent px-0! pt-0!">
            <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent p-2! min-w-[150px]" value="general">General</TabsTrigger>
            <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent p-2! min-w-[150px]" value="security">Security</TabsTrigger>
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
            <TabsList className="bg-transparent px-0! pt-0!">
              <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent p-2! min-w-[150px]" value="general">General</TabsTrigger>
              <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent p-2! min-w-[150px]" value="departments">Departments</TabsTrigger>
              <TabsTrigger className="rounded-sm data-active:bg-transparent hover:bg-sidebar-accent p-2! min-w-[150px]" value="billing">Billing & Plans</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <CompanySettingsForm tenantId={tenantId as string} tenant={tenant as ITenant} isLoading={isLoadingUser || isLoadingProviders} onSaved={handleUpdatedTenant} />
            </TabsContent>
            <TabsContent value="departments">
              <DepartmentSettingsForm tenantId={tenantId as string} tenant={tenant as ITenant} isLoading={isLoadingUser || isLoadingProviders} />
            </TabsContent>
            <TabsContent value="billing">
              <BillingPlansSettingsForm tenantId={tenantId as string} tenant={tenant as ITenant} isLoading={isLoadingUser || isLoadingProviders} />
            </TabsContent>
          </Tabs>
        </>
         )}
      </TabsContent>
    </Tabs>
  );
}