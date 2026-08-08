"use client"

import { forwardRef, useCallback, useState } from "react"

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap/tiptap-icons/chevron-down-icon"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Shadcn UI Primitives ---
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

// --- Types ---
import type { Level, UseHeadingDropdownMenuConfig } from "@/components/tiptap/tiptap-ui/heading-dropdown-menu"
import { useHeading, useHeadingDropdownMenu } from "@/components/tiptap/tiptap-ui/heading-dropdown-menu"

export interface HeadingDropdownMenuProps
  extends React.ComponentPropsWithoutRef<typeof Button>, UseHeadingDropdownMenuConfig {
  onOpenChange?: (isOpen: boolean) => void
  modal?: boolean
}


/**
 * A clean internal item component to run the `useHeading` hook per level 
 * without nesting a Button element or using `asChild`.
 */
function HeadingMenuItem({ 
  level, 
  editor 
}: { 
  level: Level; 
  editor: any 
}) {
  const { isVisible, canToggle, handleToggle, Icon } = useHeading({
    editor,
    level,
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
      <span className="tiptap-button-text">Heading {level}</span>
    </DropdownMenuItem>
  )
}

export const HeadingDropdownMenu = forwardRef<
  HTMLButtonElement,
  HeadingDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      levels = [1, 2, 3, 4, 5, 6],
      hideWhenUnavailable = false,
      onOpenChange,
      children,
      modal = true,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
      editor,
      levels,
      hideWhenUnavailable,
    })

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!editor || !canToggle) return
        setIsOpen(open)
        onOpenChange?.(open)
      },
      [canToggle, editor, onOpenChange]
    )

    if (!isVisible) {
      return null
    }

    return (
      <DropdownMenu modal={modal} open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="Format text as heading"
            aria-pressed={isActive}
            tooltip="Heading"
            {...buttonProps}
            ref={ref}
          >
            {children ? (
              children
            ) : (
              <>
                <Icon className="tiptap-button-icon" />
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuGroup className="min-w-20">
            {levels.map((level) => (
              <HeadingMenuItem 
                key={`heading-${level}`} 
                level={level} 
                editor={editor} 
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
)

HeadingDropdownMenu.displayName = "HeadingDropdownMenu"

export default HeadingDropdownMenu