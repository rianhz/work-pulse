import BaseLoggedInLayout from "@/components/layouts/BaseLoggedInLayout";

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return (
    <BaseLoggedInLayout>
      {children}
    </BaseLoggedInLayout>
  );
}