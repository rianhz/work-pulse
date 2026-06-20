import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { AlertCircle } from "lucide-react"


export function ErrorMessage({ title, children }: { title: string, children?: React.ReactNode }) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <AlertCircle className="size-4 text-destructive" />
        </EmptyMedia>
        <EmptyTitle>
          {title}
        </EmptyTitle>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
       {children}
      </EmptyContent>
    </Empty>
  )
}
