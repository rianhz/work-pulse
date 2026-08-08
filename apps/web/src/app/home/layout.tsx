import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";
import HomepageRightContent from "@/components/custom/homepage/HomepageRightContent";

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      <div className="flex gap-4 w-full">
        <div className="flex gap-4 w-full max-w-[calc(100% - 16rem)]">
          {children}
        </div>
        <aside>
          <HomepageRightContent />
        </aside>
      </div>
    </BaseLoggedInLayout>
  );
}