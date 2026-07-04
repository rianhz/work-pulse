"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
  CircleQuestionMark,
  LogOut,
  Users,
  Briefcase,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks/hooks";
import { RootState } from "@/store";

export function AppSidebar() {
  const pathname = usePathname();
  const currentUserRole = useAppSelector((state: RootState) => state.currentUser.user?.role);
  const {mutate: logout} = useLogout();

  const allowedProjectAccess = currentUserRole === "admin" || currentUserRole === "owner" || currentUserRole === "manager";

  const mainSideNavItems = [
    { title: "Dashboard", url: "/dashboard", icon: Home },
    { title: "Chats", url: "/chats", icon: MessageCircle },
    { title: "Timesheet", url: "/timesheet", icon: Calendar },
    { title: "Team", url: "/team", icon: Users },
    ...(allowedProjectAccess ? [{ title: "Projects", url: "/projects", icon: Briefcase }] : []),
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  const footerSideNavItems = [
    {title: "Help Center", url: "help-center", icon: CircleQuestionMark},
    {title: "Logout", icon: LogOut}
  ]

  const { isMobile, open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible={!isMobile ? 'none' : 'offcanvas'}>
      <SidebarHeader>
        <div className="flex justify-center items-center py-2">
          <h1 className={`font-bold ${open ? "text-2xl" : "text-xl"}`}>WP</h1>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainSideNavItems.map((item) => {
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

      <SidebarFooter>
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu>
              {footerSideNavItems.map((item) => {
                return (
                  <SidebarMenuItem key={item.title}>
                    {item.url ? (
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" onClick={() => logout()} className="w-full justify-start">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Button>
                        </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}