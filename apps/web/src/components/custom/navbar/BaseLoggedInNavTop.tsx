"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DarkModeSwitcher } from "../switcher/DarkModeSwitcher";
import { ProfileDropdown } from "../dropdown/ProfileDropdown";
import { NotificationDropdown } from "../dropdown/NotificationDropdown";


export default function BaseLoggedInNavTop() {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="w-full border-b border-sidebar-border z-50">
      <header className="flex py-2 items-center justify-between px-4">
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

        </div>

        
        <div className="flex items-center gap-2">
          <NotificationDropdown />
          <DarkModeSwitcher />
          <ProfileDropdown />
        </div>
        
      </header>
    </nav>
  );
}