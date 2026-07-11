"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTimeOfDay, todayIsWeekDay } from "@/helpers/time-helper";
import { baseDateFormat } from "@/lib/date-format";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
 
  return (
    <>
      <Card className="border-none pt-0 ring-0 shadow-none">
        <CardHeader className="flex justify-between items-end flex-row px-0">
          <div>
            <CardTitle>
              <h1 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.nickName || user?.fullName}</h1>
            </CardTitle>
            <CardDescription>A comprehensive view of your reporting tree, leadership structure, and team members.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-0">
          
        </CardContent>
      </Card>
    </>
  );
}