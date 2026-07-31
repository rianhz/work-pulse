"use client";
import HomepageAnnouncements from "./HomepageAnnouncements";
import HomepageFeatured from "./HomepageFeatured";

export default function HomepageMainContent() {
  return (
    <div className="space-y-6 flex-1">
      <HomepageFeatured />
      <HomepageAnnouncements />
    </div>
  );
}