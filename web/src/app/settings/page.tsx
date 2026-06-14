"use client";
import { AccountSettingsForm } from "@/components/custom/forms/AccountSettingsForm";
import { CompanySettingsForm } from "@/components/custom/forms/CompanySettingsForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetMe } from "@/features/users/hooks";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "account";  

  return (
    <Tabs defaultValue={tab} className="w-full max-w-3xl">
      <TabsList>
        <TabsTrigger onClick={() => router.push("/settings?tab=account")} value="account">Account</TabsTrigger>
        <TabsTrigger onClick={() => router.push("/settings?tab=company")} value="company">Company</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <AccountSettingsForm />
      </TabsContent>
      <TabsContent value="company">
        <CompanySettingsForm />
      </TabsContent>
    </Tabs>

    
    
  );
}