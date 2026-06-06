// components/ProfileDropdown.tsx
"use client";

import { useLogout } from "@/features/auth/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileDropdown = () => {
  const { mutate: logout } = useLogout();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer outline-none focus:outline-none rounded-full">
        <Avatar>
          <AvatarImage alt="John Doe" src="https://img.heroui.chat/image/avatar?w=400&h=400&u=3" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="p-1">
        <DropdownMenuItem className="cursor-pointer rounded-lg font-medium">
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={() => logout()}
          className="cursor-pointer rounded-lg font-semibold mt-1 text-destructive focus:text-destructive focus:bg-destructive/10 transition-colors"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};