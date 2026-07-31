import { Button } from "@/components/ui/button";
import { EmptyContent } from "@/components/ui/empty";

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ArrowLeftIcon, LockIcon } from "lucide-react";
import Link from "next/link";

export function NotAuthorised() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><LockIcon className="size-10" /></EmptyMedia>
        <EmptyTitle>Not Authorised</EmptyTitle>
        <EmptyDescription>You are not authorised to access this page</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button asChild>
          <Link href="/home"><ArrowLeftIcon className="size-4" /> Go to Home</Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}