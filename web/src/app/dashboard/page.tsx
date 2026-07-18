"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimeOfDay } from "@/helpers/time-helper";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import DashboardMainContent from "@/components/custom/dashboard/DashboardMainContent";
import DashboardRightContent from "@/components/custom/dashboard/DasboardRightContent";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
 
  return (
    <>
      <div className="px-2">
          <h1 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.nickName || user?.fullName}</h1>
          <p className="text-sm text-muted-foreground">A comprehensive view of your reporting tree, leadership structure, and team members.</p>
      </div>
      <div className="flex gap-4">
        <DashboardMainContent />
        <DashboardRightContent />
      </div>
    </>
  );
}