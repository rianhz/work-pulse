"use client";

import { getTimeOfDay, todayIsWeekDay } from "@/helpers/time-helper";
import { baseDateFormat } from "@/lib/date-format";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function DashboardPage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
 
  return (
    <main className="flex flex-1 flex-col">
        <h1 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.nickName || user?.fullName}</h1>
        <p className="text-sm text-muted-foreground">It's {baseDateFormat(new Date(), 'dddd, MMMM D, YYYY')}. {todayIsWeekDay() ? "Don't forget to fill your timesheet for today." : "Enjoy your time off."}</p>
    </main>
  );
}