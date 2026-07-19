"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimeOfDay } from "@/helpers/time-helper";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import DashboardMainContent from "@/components/custom/dashboard/DashboardMainContent";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
 
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="py-2">
          <h1 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.nickName || user?.fullName}</h1>
          <p className="text-sm text-muted-foreground">A comprehensive view of your reporting tree, leadership structure, and team members.</p>
      </div>
      <div>
        <h3 className="text-lg font-bold">Announcements</h3>
        <div className="mt-4">
          <DashboardMainContent />
        </div>
      </div>
    </div>
  );
}