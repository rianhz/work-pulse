"use client";
import DashboardAnnouncements from "./DashboardAnnouncements";
import DashboardFeatured from "./DashboardFeatured";

export default function DashboardMainContent() {
  return (
    <div className="space-y-6 flex-1">
      <DashboardFeatured />
      <DashboardAnnouncements />
    </div>
  );
}