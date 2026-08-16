"use client";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMarkNotificationAsRead, useNotification, useUnreadNotificationsCount } from "@/features/notification/hooks";
import { baseDateFormatFromNow } from "@/lib/date-format";
import { getNotificationLink, getNotificationMessage, getNotificationTitle } from "@/helpers/notification-helper";
import { Bell } from "lucide";
import Link from "next/link";
import { Activity, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { INotification } from "@/features/notification/notification";

const MAX_TODAY = 10;
const MAX_EARLIER = 10;

export const NotificationDropdown = () => {
  const queryClient = useQueryClient();
  const { data: notificationsData, isLoading } = useNotification({ page: 1, limit: 10 });
  const { data: unreadNotificationsCount, isLoading: isUnreadNotificationsCountLoading } = useUnreadNotificationsCount();
  const { mutate: markNotificationAsRead } = useMarkNotificationAsRead();

  const notifications = useMemo(() => {
    return notificationsData?.data?.map((notification) => {
      return {
        _id: notification._id,
        actor: notification.actorId?.fullName || notification.actorId?.nickName,
        entityType: notification.entityType,
        entityId: notification.entityId,
        createdAt: notification.createdAt,
        isRead: notification.isRead,
      };
    });
  }, [notificationsData?.data]);

  const handleMarkNotificationAsRead = (id: string, isUnread: boolean) => {
    if (!isUnread) {
      markNotificationAsRead(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          queryClient.invalidateQueries({ queryKey: ['unread-notifications-count'] });
        },
      });
    }
  };

  const { todayNotifications, earlierNotifications } = useMemo(() => {
    const notifications = notificationsData?.data || [];
    if (!notifications?.length) {
      return { todayNotifications: [], earlierNotifications: [] };
    }

    // 1. Ensure notifications are sorted by newest first
    const sorted = [...notifications].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayList: INotification[] = [];
    const earlierList: INotification[] = [];

    // 2. Separate into Today vs Earlier while respecting limits
    for (const item of sorted) {
      const isToday = new Date(item.createdAt) >= startOfToday;

      if (isToday) {
        if (todayList.length < MAX_TODAY) {
          todayList.push(item);
        }
      } else {
        if (earlierList.length < MAX_EARLIER) {
          earlierList.push(item);
        }
      }

      // Stop looping early if both slots are filled
      if (todayList.length === MAX_TODAY && earlierList.length === MAX_EARLIER) {
        break;
      }
    }

    return {
      todayNotifications: todayList,
      earlierNotifications: earlierList,
    };
  }, [notifications])

  const renderNotificationItems = (items: INotification[]) =>
    items.map((notification) => (
      <DropdownMenuItem
        key={notification._id}
        asChild
        onClick={() => handleMarkNotificationAsRead(notification._id, notification.isRead)}
      >
        <Link
          href={getNotificationLink(notification.entityType, notification.entityId || "")}
          className="flex items-end justify-between py-1.5"
        >
          <div className="flex flex-col">
            <p className="text-sm font-medium">{getNotificationTitle(notification.entityType)}</p>
            <p className="text-xs text-muted-foreground">
              {getNotificationMessage(notification.entityType, notification.actorId?.nickName || notification.actorId?.fullName || "")}
            </p>
          </div>
          <div className="flex flex-col items-end justify-between gap-1">
            <Activity mode={notification.isRead ? 'hidden' : 'visible'}>
              <div className="w-2 h-2 rounded-full bg-primary" />
            </Activity>
            <p className="text-xs text-muted-foreground">
              {baseDateFormatFromNow(new Date(notification.createdAt))}
            </p>
          </div>
        </Link>
      </DropdownMenuItem>
    ));


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" icon={Bell} aria-label="Notifications" className="relative" loading={isLoading || isUnreadNotificationsCountLoading}>
          <Activity mode={unreadNotificationsCount?.unread > 0 && !isLoading ? 'visible' : 'hidden'}>
            <span className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center rounded-full bg-destructive p-1 text-xs text-white">
              {unreadNotificationsCount?.unread}
            </span>
          </Activity>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn(notifications?.length === 0 && !isLoading ? 'min-w-[150px]' : 'min-w-[430px]', 'flex flex-col gap-2 mr-6')}>
        <Activity mode={notifications && notifications?.length === 0 && !isLoading ? 'visible' : 'hidden'}>
          <div className="flex items-center justify-center">
            <p className="text-xs text-muted-foreground text-center whitespace-nowrap">No notifications found</p>
          </div>
        </Activity>
        <Activity mode={notifications && notifications?.length > 0 && !isLoading ? 'visible' : 'hidden'}>
          <div className="flex flex-col max-h-[450px]">
            {/* Scrollable list area */}
            <div className="flex-1 overflow-y-auto p-2 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {/* Today Section */}
              {todayNotifications.length > 0 && (
                <div>
                  <DropdownMenuLabel className="px-2 font-bold">
                    Today
                  </DropdownMenuLabel>
                  <div className="space-y-1">
                    {renderNotificationItems(todayNotifications)}
                  </div>
                </div>
              )}

              {/* Separator between sections if both exist */}
              {todayNotifications.length > 0 && earlierNotifications.length > 0 && (
                <DropdownMenuSeparator />
              )}

              {/* Earlier Section */}
              {earlierNotifications.length > 0 && (
                <div>
                  <DropdownMenuLabel className="px-2 font-bold">
                    Earlier
                  </DropdownMenuLabel>
                  <div className="space-y-1">
                    {renderNotificationItems(earlierNotifications)}
                  </div>
                </div>
              )}
            </div>

            {/* Sticky/Fixed Bottom Section */}
            <div className="p-2 border-t bg-popover rounded-b-md">
              <Button variant="secondary" size="sm" className="w-full" asChild>
                <Link href="/notifications">View all</Link>
              </Button>
            </div>
          </div>
        </Activity>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}