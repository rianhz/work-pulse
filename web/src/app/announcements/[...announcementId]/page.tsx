"use client";
import { useParams } from "next/navigation";

export default function AnnouncementPage() {
  const { announcementId } = useParams();
  return (
    <>
      <h1>Announcement {announcementId}</h1>
    </>
  );
}