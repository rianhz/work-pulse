import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardRightContent() {
  const onlineUsers = 2;
  return (
    <div className="w-[16rem] sticky top-2">
      <Card className="p-2">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 justify-between">
            <h3 className="font-bold">Who's Online</h3>
            <span className="flex items-center gap-1 text-xs text-muted-foreground"><div className="w-2 h-2 bg-green-500 rounded-full"></div> 2 online</span>
          </CardTitle>
          <CardContent className="p-0">
            <div className="flex items-start gap-1 py-2">
              {Array.from({ length: onlineUsers }).map((_, index) => (
                <Avatar key={index}>
                  <AvatarImage src={`https://github.com/shadcn.png?${index}`} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              ))}
            </div>
            <Button asChild variant={"secondary"} className="mt-2">
              <Link href="/users-online" className="w-full">View all people</Link>
            </Button>
          </CardContent>
        </CardHeader>  
      </Card>
    </div>
  )
}