import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function TimesheetLayout({ children }: { children: React.ReactNode }) {
  return <BaseLoggedInLayout>{children}</BaseLoggedInLayout>;
}