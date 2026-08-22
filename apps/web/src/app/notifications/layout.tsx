import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function NotificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      {children}
    </BaseLoggedInLayout>
  );
}