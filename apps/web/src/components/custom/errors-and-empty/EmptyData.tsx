
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Activity } from "react"

export function EmptyData({ title, description, children, icon }: { title?: string, description?: string, children?: React.ReactNode, icon?: React.ReactNode }) {
  return (
    <Empty>
      <EmptyHeader>
        <Activity mode={icon ? "visible" : "hidden"}>
          <EmptyMedia variant="icon">{icon}</EmptyMedia>
        </Activity>
        <Activity mode={title ? "visible" : "hidden"}>
          <EmptyTitle>{title}</EmptyTitle>
        </Activity>
        <Activity mode={description ? "visible" : "hidden"}>
          <EmptyDescription>{description}</EmptyDescription>
        </Activity>
      </EmptyHeader>
      <Activity mode={children ? "visible" : "hidden"}>
        <EmptyContent className="flex-row justify-center gap-2">
          {children}
        </EmptyContent>
      </Activity>
    </Empty>
  )
}
