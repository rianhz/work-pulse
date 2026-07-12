"use client"

import { useCallback, useState } from "react"
import { type Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap/tiptap-icons/chevron-down-icon"

// --- Tiptap UI ---
import { useListDropdownMenu } from "@/components/tiptap/tiptap-ui/list-dropdown-menu/use-list-dropdown-menu"

// --- Shadcn UI Primitives ---
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { ListType, useList } from "./use-list"

export interface ListDropdownMenuProps extends React.ComponentPropsWithoutRef<typeof Button> {
  editor?: Editor
  types?: ListType[]
  hideWhenUnavailable?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * A clean internal component to run the useList hook per type 
 * without rendering a nested Button or breaking focus states.
 */
function ListMenuItem({
  type,
  label,
  editor,
}: {
  type: ListType
  label: string
  editor: any
}) {
  const { isVisible, canToggle, handleToggle, Icon } = useList({
    editor,
    type,
    hideWhenUnavailable: false,
  })

  if (!isVisible) return null

  return (
    <DropdownMenuItem
      disabled={!canToggle}
      onClick={(e) => {
        e.preventDefault()
        handleToggle()
      }}
      className="flex w-full items-center gap-2"
    >
      <Icon className="tiptap-button-icon" />
      <span className="tiptap-button-text">{label}</span>
    </DropdownMenuItem>
  )
}

export function ListDropdownMenu({
  editor: providedEditor,
  types = ["bulletList", "orderedList", "taskList"],
  hideWhenUnavailable = false,
  modal = true,
  onOpenChange,
  ...props
}: ListDropdownMenuProps) {
  const { editor } = useTiptapEditor(providedEditor)
  const [isOpen, setIsOpen] = useState(false)

  // `Icon` here automatically responds dynamically to whichever list node is currently active
  const { filteredLists, canToggle, isActive, isVisible, Icon } =
    useListDropdownMenu({
      editor,
      types,
      hideWhenUnavailable,
    })

  const handleOnOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open)
      onOpenChange?.(open)
    },
    [onOpenChange]
  )

  if (!isVisible) {
    return null
  }

  return (
    <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOnOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          data-active-state={isActive ? "on" : "off"}
          role="button"
          tabIndex={-1}
          disabled={!canToggle}
          data-disabled={!canToggle}
          aria-label="List options"
          // Tooltip hides when the menu is actively opened
          tooltip={isOpen ? undefined : "List"}
          {...props}
        >
          {/* Dynamically swapped active icon component */}
          <Icon className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {filteredLists.map((option) => (
            <ListMenuItem
              key={option.type}
              type={option.type}
              label={option.label}
              editor={editor}
            />
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ListDropdownMenu