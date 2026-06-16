"use client";

import { useGetTenantById } from "@/features/tenants/hooks";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
  const { data: tenant } = useGetTenantById(user?.tenantId);
  console.log(tenant);
  return (
    <main className="flex flex-1 flex-col gap-4 p-4">
        <h1>Dashboard</h1>
        <p>Your tenant is <span className="text-3xl font-bold">{tenant?.name}</span></p>
    </main>
  );
}