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

      <div className="flex h-screen flex-1 flex-col overflow-auto scrollbar-thin scrollbar-thumb-default-200 scrollbar-track-default-100">
        <BaseLoggedInNavTop />

        <main className="flex-1 p-4 w-full">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}