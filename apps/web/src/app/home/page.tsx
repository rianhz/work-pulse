"use client";

import HomepageMainContent from "@/components/custom/homepage/HomepageMainContent";
import { getTimeOfDay } from "@/helpers/time-helper";
import { RootState } from "@/store";
import { useSelector } from "react-redux";

export default function HomePage() {
  const user = useSelector((state: RootState) => state.currentUser.user);
 
  return (
    <div className="flex flex-col gap-4 flex-1">
      <div className="py-2">
          <h1 className="text-2xl font-bold">Good {getTimeOfDay()}, {user?.nickName || user?.fullName}</h1>
      </div>
      <div>
        <h3 className="text-lg font-bold">Announcements</h3>
        <div className="mt-4">
          <HomepageMainContent />
        </div>
      </div>
    </div>
  );
}