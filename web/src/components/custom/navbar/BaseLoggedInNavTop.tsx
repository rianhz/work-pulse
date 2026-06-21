"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { DarkModeSwitcher } from "../switcher/DarkModeSwitcher";
import { ProfileDropdown } from "../dropdown/ProfileDropdown";


export default function BaseLoggedInNavTop() {
  const { toggleSidebar } = useSidebar();

  return (
    <nav className="sticky top-0 right-0 w-full border-b border-sidebar-border z-50">
      <header className="flex py-2 items-center justify-between px-4 md:px-6">
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

        </div>

        
        <div className="flex items-center gap-4">
          <DarkModeSwitcher />
          <ProfileDropdown />
        </div>
        
      </header>
    </nav>
  );
}