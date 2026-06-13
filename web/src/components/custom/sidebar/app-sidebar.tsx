"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";


import {
  Settings,
  Home,
  Calendar,
  MessageCircle,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const items = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Chats", url: "/chats", icon: MessageCircle },
    { title: "Timesheet", url: "/timesheet", icon: Calendar },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const { isMobile, open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible={!isMobile ? 'icon' : 'offcanvas'}>
      <SidebarHeader>
        <div className="flex justify-center items-center py-2">
          <h1 className={`font-bold ${open ? "text-2xl" : "text-xl"}`}>WP</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

    </Sidebar>
  );
}