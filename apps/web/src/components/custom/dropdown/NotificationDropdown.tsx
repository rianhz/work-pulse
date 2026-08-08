"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNotification, useUnreadNotificationsCount } from "@/features/notification/hooks";
import { baseDateFormatFromNow } from "@/lib/date-format";
import { getNotificationLink, getNotificationMessage, getNotificationTitle } from "@/helpers/notification-helper";
import { Bell } from "lucide-react";
import Link from "next/link";
import { Activity, useMemo } from "react";

export const NotificationDropdown = () => {
  const { data, isLoading } = useNotification({ page: 1, limit: 10 });
  const { data: unreadNotificationsCount, isLoading: isUnreadNotificationsCountLoading } = useUnreadNotificationsCount();

  const notifications = useMemo(() => {
    return data?.data?.map((notification) => {
      return {
        _id: notification._id,
        actor: notification.actorId?.fullName || notification.actorId?.nickName,
        type: notification.type,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
      };
    });
  }, [data?.data]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" icon={Bell} aria-label="Notifications" className="relative" loading={isLoading || isUnreadNotificationsCountLoading}>
          <Activity mode={data && data?.data?.length > 0 && !isLoading ? 'visible' : 'hidden'}>
            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive p-1 text-xs text-white">
              {unreadNotificationsCount?.unread}
            </span>
          </Activity>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className={notifications?.length === 0 && !isLoading ? 'min-w-[150px]' : 'min-w-[430px]'}>
        <Activity mode={notifications?.length === 0 && !isLoading ? 'visible' : 'hidden'}>
          <div className="flex items-center justify-center">
            <p className="text-xs text-muted-foreground text-center whitespace-nowrap">No notifications found</p>
          </div>
        </Activity>
        <Activity mode={notifications && notifications?.length && notifications?.length > 0 && !isLoading ? 'visible' : 'hidden'}>
          {notifications?.map((notification) => (
            <DropdownMenuItem key={notification._id} asChild>
              <Link href={getNotificationLink(notification.type, notification._id)} className="flex items-end justify-between">
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{getNotificationTitle(notification.type)}</p>
                  <p className="text-xs text-muted-foreground">{getNotificationMessage(notification.type, notification.actor || "")}</p>
                </div>
                <div className="flex flex-col items-end justify-between gap-1">
                  <Activity mode={notification.isRead ? 'hidden' : 'visible'}>
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </Activity>
                  <p className="text-xs text-muted-foreground">{baseDateFormatFromNow(new Date(notification.createdAt))}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          ))}
        </Activity>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}