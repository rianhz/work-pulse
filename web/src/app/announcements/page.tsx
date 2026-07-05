import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnnouncementsPage() {
  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-end flex-row">
          <div>
            <CardTitle className="text-2xl font-bold">Announcements</CardTitle>
            <CardDescription>A comprehensive view of all announcements.</CardDescription>
          </div>
          <Button>Create</Button>
        </CardHeader>
      </Card>
    </>
  );
}