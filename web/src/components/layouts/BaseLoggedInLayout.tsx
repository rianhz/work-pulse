"use client";

import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../custom/sidebar/app-sidebar";
import BaseLoggedInNavTop from "../custom/navbar/BaseLoggedInNavTop";

export default function BaseLoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />

      <div className="flex min-h-screen flex-1 flex-col">
        <BaseLoggedInNavTop />

        <main className="flex-1 h-[calc(100vh-48px)] p-6 w-full overflow-auto scrollbar-thin scrollbar-thumb-default-200 scrollbar-track-default-100">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}