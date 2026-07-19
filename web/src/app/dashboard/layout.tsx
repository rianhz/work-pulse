import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";
import DashboardRightContent from "@/components/custom/dashboard/DasboardRightContent";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      <div className="flex gap-4 w-full">
        <div className="flex gap-4 w-calc(100% - 16rem)">
          {children}
        </div>
        <aside>
          <DashboardRightContent />
        </aside>
      </div>
    </BaseLoggedInLayout>
  );
}