import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      {children}
    </BaseLoggedInLayout>
  );
}