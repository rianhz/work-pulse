import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      {children}
    </BaseLoggedInLayout>
  );
}