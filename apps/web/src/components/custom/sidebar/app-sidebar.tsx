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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  Settings,
  Home,
  Calendar,
  MessageCircle,
  CircleQuestionMark,
  LogOut,
  Users,
  Briefcase,
  Megaphone,
  CalendarOff,
  ChevronRight,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks";
import { useAppSelector } from "@/store/hooks/hooks";
import { RootState } from "@/store";

export function AppSidebar() {
  const pathname = usePathname();
  const currentUserRole = useAppSelector(
    (state: RootState) => state.currentUser.user?.role
  );
  const { mutate: logout } = useLogout();

  const isModerator = currentUserRole === "admin" || currentUserRole === "owner";

  const allowedProjectAccess =
    currentUserRole === "admin" ||
    currentUserRole === "owner" ||
    currentUserRole === "manager";
  const allowedTimeSheetAccess = !isModerator;
  const allowedAnnouncementsAccess = isModerator;

  const mainSideNavItems = [
    { title: "Home", url: "/home", icon: Home },
    { title: "Chats", url: "/chats", icon: MessageCircle },
    ...(allowedTimeSheetAccess
      ? [{ title: "Timesheet", url: "/timesheet", icon: Calendar }]
      : []),
    { title: "Team", url: "/team", icon: Users },
    ...(allowedProjectAccess
      ? [{ title: "Projects", url: "/projects", icon: Briefcase }]
      : []),
    ...(allowedAnnouncementsAccess
      ? [{ title: "Announcements", url: "/announcements", icon: Megaphone }]
      : []),
    { title: "Settings", url: "/settings", icon: Settings },
    {
      title: "Leave",
      url: "#",
      icon: CalendarOff,
      children: [
        { title: "Request", url: "/request-leave" },
        { title: "History", url: "/leave-history" },
      ],
    },
  ];

  const footerSideNavItems = [
    { title: "Help Center", url: "/help-center", icon: CircleQuestionMark },
    { title: "Logout", icon: LogOut, action: () => logout() },
  ];

  const { isMobile, open } = useSidebar();

  return (
    <Sidebar variant="sidebar" collapsible={!isMobile ? "none" : "offcanvas"}>
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
                const isChildActive = item.children?.some(
                  (child) => pathname === child.url
                );

                // Render Collapsible for items with children
                if (item.children) {
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isChildActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="cursor-pointer">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                          <SidebarMenuSub>
                            {item.children.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === subItem.url}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // Render standard menu item
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
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
              {footerSideNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.url ? (
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton onClick={item.action}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}