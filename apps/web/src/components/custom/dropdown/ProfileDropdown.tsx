"use client";

import { useLogout } from "@/features/auth/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import BaseAvatar from "../images/BaseAvatar";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

export const ProfileDropdown = () => {
  const router = useRouter();
  const { mutate: logout } = useLogout();
  const user = useSelector((state: RootState) => state.currentUser.user);
  const initials = useMemo(() => {
    return user?.fullName?.charAt(0).toUpperCase() || '';
  }, [user?.fullName]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer outline-none focus:outline-none rounded-full">
        <BaseAvatar src={user?.avatar} fallbackInitials={initials} className="w-[50px] h-[50px] rounded-full" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="p-1">
        <DropdownMenuItem 
          onClick={() => router.push('/settings?tab=account')}
          className="cursor-pointer rounded-lg"
        >
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