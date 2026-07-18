import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardRightContent() {
  return (
    <Card className="mt-4 p-2 flex-1 max-w-[12rem]">
      <CardHeader className="p-0">
        <CardTitle>
          <h1>Dashboard Right Content</h1>
        </CardTitle>
      </CardHeader>
    </Card>
  )
}