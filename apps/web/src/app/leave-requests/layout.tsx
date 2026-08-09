import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function RequestLeaveLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      {children}
    </BaseLoggedInLayout>
  )
}