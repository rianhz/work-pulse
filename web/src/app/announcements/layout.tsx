import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function AnnouncementsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      {children}
    </BaseLoggedInLayout>
  );
}